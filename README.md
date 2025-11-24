# 📚 Faby Notes — Your Study Buddy (2025)

A full-stack platform for students to upload, organize, and access study materials — enhanced with AI-powered smart search.

<div align="center">

![React](https://img.shields.io/badge/Frontend-React%2019-blue)
![Vite](https://img.shields.io/badge/Bundler-Vite-purple)
![NodeJS](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/API-Express-black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-lightblue)
![Dialogflow](https://img.shields.io/badge/AI-Dialogflow-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

</div>

---

## 📖 About the Project

**Faby Notes** is a college-oriented web platform that helps students study smarter by providing an organized system of Streams → Branches → Semesters.

### ✔ What You Can Do
- 📤 Upload, manage & share study notes (PDFs, Docs)
- 🗂 Navigate content with a clean 3-level structure
- 👀 Preview PDFs inside the browser
- 🤖 Chat with an AI assistant (Dialogflow)
- 👨‍🏫 Teachers can upload, students can view
- 🔐 JWT Authentication + Google OAuth
- ☁️ Cloud-based file storage using Cloudinary

---

## 🚀 Features

### 📂 Notes Organization  
- Stream > Branch > Semester navigation  
- Clean card UI  
- Fast routing with React Router v7  

### 📝 PDF Upload & Viewer  
- Upload via Multer + Cloudinary  
- Direct PDF preview  
- Secure access  

### 🔐 Authentication  
- JWT login  
- Google OAuth  
- Role-based access (Teacher / Student)  

### 🤖 AI Assistant  
- Created using Dialogflow  
- Smart note search  
- Subject & topic guidance  

### 🎨 Modern UI  
- Radix UI components  
- Lucide & React Icons  
- React Toastify notifications  
- Fully responsive

---

## 🏗 Tech Stack

### 🌐 Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **Radix UI** - Component library
- **React Router DOM v7** - Routing
- **React Modal** - Modal dialogs
- **React Toastify** - Notifications

### 🖥 Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database & ODM
- **Multer + Cloudinary** - File upload & storage
- **JSON Web Tokens (JWT)** - Authentication
- **Nodemailer** - Email service
- **Passport Google OAuth** - Social authentication
- **Dialogflow** - AI Chatbot
- **Zod** - Data validation

---

## 📁 Project Structure

```
Faby-Notes/
│
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── store/         # State management
│   │   ├── assets/        # Static files
│   │   └── App.jsx        # Main App component
│   ├── public/            # Public assets
│   └── package.json
│
└── server/                # Backend Express application
    ├── controllers/       # Route controllers
    ├── models/           # MongoDB models
    ├── routes/           # API routes
    ├── middleware/       # Custom middleware
    ├── utils/            # Utility functions
    ├── server.js         # Server entry point
    └── package.json
```
## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/DevendraMane/Faby-Notes.git
cd Faby-Notes
```

### 2️⃣ Backend Setup
```bash
cd server
bun install

# Create environment file
cp .env.example .env
```

**Configure `/server/.env`:**
```env
# -----------------------------------------
# 🌱 MongoDB Connection
# -----------------------------------------
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/faby-notes

# -----------------------------------------
# ⚙️ Server Configuration
# -----------------------------------------
PORT=5000
NODE_ENV=development

# -----------------------------------------
# 📧 Email Configuration
# -----------------------------------------
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<your-app-password>

# -----------------------------------------
# 🌐 Frontend URL
# -----------------------------------------
FRONTEND_URL=http://localhost:5173
# FRONTEND_URL=https://your-frontend.onrender.com

# -----------------------------------------
# 🔐 JWT Secret
# -----------------------------------------
JWT_SECRET_KEY=<your-jwt-secret>

# -----------------------------------------
# 🔑 Google OAuth
# -----------------------------------------
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
# GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback

# -----------------------------------------
# ☁️ Cloudinary Configuration
# -----------------------------------------
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<cloud-api-key>
CLOUDINARY_API_SECRET=<cloud-api-secret>

# -----------------------------------------
# 🤖 OpenAI API
# -----------------------------------------
OPENAI_API_KEY=<your-openai-api-key>

# -----------------------------------------
# ⚡ GROQ API
# -----------------------------------------
GROQ_API_KEY=<your-groq-api-key>

# -----------------------------------------
# 🗣 Dialogflow
# -----------------------------------------
DIALOGFLOW_PROJECT_ID=faby-notes

# Base64 encoded Google Application Credentials (Service Account JSON)
GOOGLE_APPLICATION_CREDENTIALS_BASE64=<base64-service-account-json>
```

**Start the backend server:**
```
nodemon server.js
```

### 3️⃣ Frontend Setup
```bash
cd ../client
bun install
bun run dev
```

### 4️⃣ Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 🔗 API Communication
- **JWT tokens** attached to headers for protected routes
- **Multer middleware** for file uploads to Cloudinary
- **CORS enabled** for cross-origin requests

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request
---
## 📝 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## ⭐ Support

If you found this project helpful, please give it a ⭐ on GitHub!

---

## 💬 Contact

**Made with ❤️ by Devendra**

- 📧 Email: devendradineshmane@gmail.com
- 💼 LinkedIn: [DevendraMane](https://www.linkedin.com/in/devendramane/)


---

<div align="center">

### 🚀 Happy Coding!

</div>
```
