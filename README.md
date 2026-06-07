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
````

**Step 3:** The script will prompt you for your local MySQL username and password. It will automatically create the notes_db database and apply the schema.

**Step 4:** The frontend will be available at http://localhost:5173.

> Note: Pressing Ctrl+C will gracefully stop both the React server and the Spring Boot background process.

### Option 2: Manual Start (Windows / All OS)
**1. Start the Backend:**

Open a terminal in the backend folder.

Verify your MySQL credentials in src/main/resources/application.properties.

Run the Spring Boot application:

```bash
./mvnw spring-boot:run
```
(The API will be available at http://localhost:8080/api/notes)

**2. Start the Frontend:**

Open a new terminal in the frontend folder.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## 🔐 Authentication (Bonus Requirement)
As per the extra functional requirements, a simulated login screen is provided.

Username: admin

Password: ensolvers123

## ✨ Features Implemented
Phase 1: Core Functionality
[x] Create, edit, and delete notes.

[x] Archive and unarchive notes.

[x] Toggle views between active and archived notes.

Phase 2: Tag Application & Filtering
[x] Add new categories dynamically.

[x] Assign multiple categories to a single note (Many-to-Many).

[x] Filter the notes dashboard by a specific category.

## ⚠️ Troubleshooting
1. Port 8080 is already in use (Backend fails to start)
If you already have a service running on port 8080 (like Jenkins, Tomcat, or another DB), the Spring Boot application will fail to start in the background.

Solution: Open backend/src/main/resources/application.properties and change server.port=8080 to an available port like server.port=8081.

2. Port 5173 is already in use (Frontend)
If port 5173 is busy, Vite will automatically assign the next available port (e.g., 5174).

Solution: You don't need to change anything in the backend. The Spring Boot API is configured with @CrossOrigin(origins = "*") to prevent CORS issues regardless of the port Vite chooses. Just check the terminal output for the correct local URL.


