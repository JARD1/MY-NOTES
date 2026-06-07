# 📝 Ensolvers Notes App (Full Stack Challenge)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

A Single Page Application (SPA) built to manage notes efficiently. This project fulfills all requirements for **Phase 1 (CRUD & Archiving)** and the extra-credit **Phase 2 (Categories & Filtering)**. Created as part of the technical evaluation for Ensolvers by **JForge**.

---

## 🌍 Live Demo (Production)

The project is 100% functional and deployed in the cloud. You can test the live application here:

* **🌐 Frontend (Vercel):** [https://my-notes-olive-gamma.vercel.app](https://my-notes-olive-gamma.vercel.app)
* **⚙️ Backend API (Render):** [https://my-notes-backend-otzz.onrender.com/api/notes](https://my-notes-backend-otzz.onrender.com/api/notes)

---

## 🏗️ Cloud Infrastructure & Deployment

To ensure the project's scalability and accessibility, the following cloud infrastructure was implemented:

* **Frontend:** User interface built with React and Vite, deployed via continuous integration (CI/CD) on **Vercel**.
* **Backend:** RESTful API built with **Java 21** and Spring Boot. The environment was dockerized (`Dockerfile` included) and hosted on **Render** servers.
* **Database:** Relational **MySQL** instance hosted on **Clever Cloud**, automatically managed by Hibernate (JPA) for data persistence.

---

## 🚀 Technologies Used

### Frontend (User Interface)
* **Framework:** React 18 (Built with Vite 5)
* **Styling:** Tailwind CSS 3.4
* **HTTP Client:** Axios
* **Architecture:** Component-based UI with encapsulated service layers
* **Extras:** Dynamic UI Theming (Fonts & Colors)

### Backend (REST API)
* **Framework:** Java 21 + Spring Boot 3.5.12
* **Database:** MySQL 8
* **ORM:** Spring Data JPA / Hibernate
* **Architecture:** Layered Pattern (Controllers -> Services -> Repositories)
* **Deployment:** Docker

---

## 📋 Prerequisites

To run this application locally, you will need:
* **Node.js:** v18.0 or higher
* **Java:** JDK 21 or higher
* **MySQL:** Server running locally on port `3306`

---

## 🛠️ How to Run the Application

### Option 1: The One-Click Script (macOS / Linux / Git Bash)

For Unix-based environments, a bash script is provided to install dependencies, configure the database, and start both servers simultaneously.

**Step 1:** Open your terminal in the root folder of the project.

**Step 2:** Run the script:
```bash
./run.sh
