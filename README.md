# Evidya 🎓

**Evidya** is a full-stack student achievement management platform designed to track, manage, and validate academic and extracurricular accomplishments.
It enables students to showcase their achievements while allowing faculty members to verify and approve submissions.

The platform creates a **centralized digital profile of student achievements** including certificates, activities, projects, and research publications.

---

## 🚀 Features

### Student Module

* Student registration and login
* Complete student profile management
* Upload and manage:

  * Certificates
  * Activities
  * Projects
  * Publications

* Add supporting documents or proof files
* Track submission status (Pending / Approved / Rejected)
* View accumulated achievement points

### Faculty Module

* Faculty login and authentication
* View student submissions
* Approve or reject achievements
* Monitor student performance and activities

### System Features

* Secure authentication
* File upload support
* Achievement verification workflow
* Points-based evaluation system
* Structured student profile dashboard

---

## 🛠️ Tech Stack

### Frontend

* React.js
* CSS
* Axios
* React Toastify

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Other Tools

* Git & GitHub
* Postman (API testing)

---

## 📂 Project Structure

```
Evidya
│
├── frontend
│   ├── components
│   ├── pages
│   ├── styles
│   └── services
│
├── backend
│   ├── routes
│   ├── controllers
│   ├── models
│   ├── middleware
│   └── config
│
├── database
│   └── evidya_schema.sql
│
└── README.md
```

---

## 🗄️ Database Overview

Main database tables include:

* **students** – stores student account and profile information
* **faculty** – faculty accounts and details
* **certificates** – student certificates and achievements
* **activities** – extracurricular activities
* **projects** – student academic projects
* **publications** – research papers and publications

Each record is linked using **UUID-based relationships**.

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```
git clone https://github.com/yourusername/evidya.git
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Start the server

```
node server.js
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

### 4️⃣ Database Setup

1. Install PostgreSQL
2. Create the database
3. Run the SQL schema file

```
psql -U postgres -f evidya_schema.sql
```

---

## 🔐 Authentication Flow

1. User registers as **Student** or **Faculty**
2. Login credentials are validated
3. Students submit achievements
4. Faculty verifies submissions
5. Points are assigned after approval

---

## 📊 Future Improvements

* Achievement leaderboard
* Analytics dashboard
* AI-based achievement recommendation
* Resume auto-generation
* Placement profile export
* Mobile application support

---

## 👩‍💻 Author

**Disha**
B.Tech Computer Engineering Student
Full Stack Developer | AI/ML Enthusiast

---

## 📜 License

This project is developed for **academic and learning purposes**.
