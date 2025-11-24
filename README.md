```markdown
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
- **Dialogflow** - AI conversations
- **Zod** - Data validation

---

## 📦 Dependencies

### Frontend Dependencies
```json
{
  "@radix-ui/react-dialog": "^1.1.1",
  "@radix-ui/react-label": "^2.1.0",
  "@radix-ui/react-select": "^2.1.1",
  "axios": "^1.6.2",
  "lucide-react": "^0.294.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-icons": "^4.12.0",
  "react-modal": "^3.16.1",
  "react-router-dom": "^7.0.0",
  "react-toastify": "^9.1.3",
  "vite": "^5.0.8"
}
```

### Backend Dependencies
```json
{
  "@google-cloud/dialogflow": "^5.6.0",
  "bcryptjs": "^2.4.3",
  "cloudinary": "^1.41.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "express-session": "^1.17.3",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.0.3",
  "multer": "^1.4.5-lts.1",
  "multer-storage-cloudinary": "^4.0.0",
  "nodemailer": "^6.9.7",
  "passport": "^0.6.0",
  "passport-google-oauth20": "^2.0.0",
  "zod": "^3.22.4"
}
```

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

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/faby-notes.git
cd faby-notes
```

### 2️⃣ Backend Setup
```bash
cd server
npm install

# Create environment file
cp .env.example .env
```

**Configure `/server/.env`:**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret_key

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

DIALOGFLOW_PROJECT_ID=your_dialogflow_project_id
```

**Start the backend server:**
```bash
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

### 4️⃣ Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 🔗 API Communication

- **Axios** for HTTP requests between frontend and backend
- **JWT tokens** attached to headers for protected routes
- **Multer middleware** for file uploads to Cloudinary
- **CORS enabled** for cross-origin requests

---

## 🖼 Screenshots

*(Add your screenshots here)*
- ![Homepage](./screenshots/home.png)
- ![Branches Page](./screenshots/branches.png)
- ![PDF Viewer](./screenshots/pdf.png)
- ![AI Chatbot](./screenshots/ai-chat.png)

---

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

- 📧 Email: your-email@example.com
- 💼 LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- 🐙 GitHub: [@your-username](https://github.com/your-username)

---

<div align="center">

### 🚀 Happy Coding!

</div>
```

Save this as `README.md` in your project root directory. This file provides a comprehensive overview of your Faby Notes project with proper formatting, badges, and clear installation instructions that will be helpful for other developers.
