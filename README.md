Markaba – Job Application Form

This project is a responsive web page that allows users to submit job applications to the Markaba tech team. It features:

Frontend form with fields: name, email, phone number, and resume upload.

Google reCAPTCHA v2 integration to prevent bot submissions.

Toast notifications for success and error messages.

Dark/Light mode toggle.

Fully responsive design for desktop and mobile.

Features

Form Validation: Ensures all fields are filled before submission.

reCAPTCHA Verification: Displays error message if reCAPTCHA is not completed.

Success Feedback: Shows success message after submission.

Loader Animation: Shows a loader on submit to simulate processing.

Theme Toggle: Switch between dark and light mode.

Responsive Design: Works on all devices.

Project Structure

job/
├── .idea/                  # IDE configuration (IntelliJ)
├── applicants/             # Optional folder to store applicant data (if any)
├── node_modules/           # Node.js dependencies
├── public/                 # Static assets (CSS, JS, images)
├── uploads/                # Uploaded resumes
├── .env                    # Environment variables (API keys, DB settings)
├── A.java                  # Java file (if part of your project)
├── job.iml                 # IntelliJ module file
├── package.json            # Node.js project configuration
├── package-lock.json       # Node.js dependencies lock file
├── M4 README.md            # Project README
├── server.js               # Node.js server script
├── Js/                     # Additional JS files
├── db/                     # Database or data-related files
├── External Libraries/     # Libraries linked in the IDE
└── Scratches and Consoles/ # IDE scratch files

Setup: 
Clone the repository :
git clone https://github.com/yourusername/job-landing-page.git

Install dependencies

npm install


Optional: Setup .env

Create a .env file if you want to test with your own reCAPTCHA keys:

PORT=3000
RECAPTCHA_SECRET=YOUR_SECRET_KEY
UPLOAD_DIR=uploads


Note: If .env is not set, the project will still work with the existing configured keys for the demo site.

Start the backend server

node server.js


Open your browser at:

http://localhost:3000


Fill out the form and complete the reCAPTCHA.

Uploaded files will be saved in the uploads/ folder.

Toast messages appear for success or error.

How It Works Online

The site is live on Render: https://nomprojet.onrender.com

The reCAPTCHA is fully functional for all visitors.

All submissions trigger toast notifications without page reload.

Uploaded resumes are handled by the backend.

Notes for Developers

You can customize the toast messages in public/script.js.

Light/Dark theme toggle is handled by script.js and CSS .light-mode.

reCAPTCHA language is set in index.html:

<script src="https://www.google.com/recaptcha/api.js?hl=en" async defer></script>


Make sure the uploads/ folder exists and is writable if running locally.

Tech Stack

Frontend: HTML5, CSS3, JavaScript

Backend: Node.js, Express

File Uploads: Handled via Node.js

reCAPTCHA: Google reCAPTCHA v2