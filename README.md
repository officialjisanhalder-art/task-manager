# 📋 TaskFlow — Smart Task Manager

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Demo_Fallback-blue?style=for-the-badge)](#)
&nbsp;
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

<div align="center">

```
  ████████╗ █████╗ ███████╗██╗  ██╗███████╗██╗      ██████╗ ██╗    ██╗
  ╚══██╔══╝██╔══██╗██╔════╝██║  ██║██╔════╝██║     ██╔═══██╗██║    ██║
     ██║   ███████║███████╗███████║█████╗  ██║     ██║   ██║██║ █╗ ██║
     ██║   ██╔══██║╚════██║██╔══██║██╔══╝  ██║     ██║   ██║██║███╗██║
     ██║   ██║  ██║███████║██║  ██║██║     ███████╗╚██████╔╝╚███╔███╔╝
     ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ 
```

*An interactive dashboard layout for keeping track of your daily flow.*

</div>

---

## ✨ Features

- **Full Stack CRUD APIs** — Connects directly to local/remote MongoDB databases using Mongoose
- **Zero-Config Database Fallback** — No Mongo installed? The backend auto-switches to in-memory store so it never crashes!
- **Premium Glassmorphic Panel Layout** — Neon glows, blur backdrops, responsive sidebar layout
- **Color Coded Priorities** — Visually see high/medium/low priority tags
- **Task Filters** — Instantly filter between All, Active, and Completed items
- **Progress Tracking** — Live stats and fill bar updating task completion percentages

---

## 🚀 Quick Run (Locally)

### Step 1 — Clone the project
```bash
git clone https://github.com/officialjisanhalder-art/task-manager.git
cd task-manager
```

### Step 2 — Install Backend Server Dependencies
```bash
npm install
```

### Step 3 — Run the Server
```bash
npm start
```

Your console will output:
> `🚀 Server running at http://localhost:3000`
> `📋 Task Manager API ready!`

Open **`http://localhost:3000`** inside your web browser to test!

---

## 🛠️ Stack Architecture

```
Frontend View   →  Vanilla HTML5, Glassmorphism CSS3, clean Client Javascript
Local Server    →  NodeJS, Express Framework
Database Client →  MongoDB Server connected via Mongoose ODM
```

---

## 📂 Project Structure

```
task-manager/
├── server.js      → Express REST controller, DB connection, router APIs
├── package.json   → Node configuration scripts
└── public/
    ├── index.html → Dashboard layout panel views
    ├── style.css  → Modern animations, blur panels
    └── app.js     → Async API fetches & controller script
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=6c63ff&height=120&section=footer" width="100%"/>

**Made with ❤️ by [Jisan Halder](https://github.com/officialjisanhalder-art)**

⭐ *Give it a star if you liked this project layout!*

</div>
