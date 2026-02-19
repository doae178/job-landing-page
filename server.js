// --------------------
// server.js
// --------------------
const express = require("express");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const multer = require("multer");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const axios = require("axios"); // ✅ axios pour reCAPTCHA

const app = express();
const PORT = process.env.PORT || 3000;

// --------------------
// Security Headers + CSP
// --------------------
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "https://www.google.com",
                    "https://www.gstatic.com",
                    "https://www.recaptcha.net",
                ],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https://www.gstatic.com"],
                frameSrc: ["https://www.google.com", "https://www.recaptcha.net"],
            },
        },
    })
);

// --------------------
// Body parser & static files
// --------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// --------------------
// Ensure folders exist
// --------------------
if (!fs.existsSync("applicants")) fs.mkdirSync("applicants");
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// --------------------
// Multer (Upload sécurisé)
// --------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
    fileFilter: (req, file, cb) => {
        const allowed = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(file.mimetype) || ![".pdf", ".doc", ".docx"].includes(ext)) {
            return cb(new Error("Seuls les fichiers PDF/DOC sont autorisés"));
        }
        cb(null, true);
    },
});

// --------------------
// Landing page route
// --------------------
app.get("/", (req, res) => {
    const html = fs.readFileSync(path.join(__dirname, "public/index.html"), "utf8");
    res.send(html);
});

// --------------------
// Form submission
// --------------------
app.post(
    "/apply",
    upload.single("resume"),
    [
        body("name").trim().escape().notEmpty(),
        body("email").isEmail().normalizeEmail(),
        body("phone").trim().escape().notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation errors:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        if (!req.file) {
            console.log("Upload failed: req.file is undefined");
            return res.status(400).send("Le CV n’a pas été uploadé correctement.");
        }

        const recaptchaResponse = req.body["g-recaptcha-response"];
        if (!recaptchaResponse) {
            console.log("reCAPTCHA missing");
            return res.status(400).send("Veuillez compléter le reCAPTCHA");
        }

        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaResponse}`;

        try {
            const response = await axios.post(verifyUrl);
            const data = response.data;
            console.log("reCAPTCHA data:", data);

            if (!data.success) return res.status(400).send("Échec de la vérification reCAPTCHA");

            // Save applicant JSON
            const applicant = {
                id: uuidv4(),
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                resume: req.file.filename,
                date: new Date(),
            };

            fs.writeFileSync(`applicants/${applicant.id}.json`, JSON.stringify(applicant, null, 2));
            console.log("Applicant saved:", applicant.id);

            res.send("Application submitted successfully!");
        } catch (err) {
            console.error("Server error:", err);
            res.status(500).send("Server error");
        }
    }
);


// --------------------
// Start server
// --------------------
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
