#!/bin/bash

echo "====================================================="
echo "   🚀 Starting Ensolvers Notes App (Full Stack) "
echo "====================================================="

# 1. Request MySQL Credentials from the reviewer
echo ""
echo "📦 Database Configuration"
echo "This app uses MySQL. The database 'notes_db' will be created automatically."
read -p "Enter your MySQL username [default: root]: " input_user
export DB_USER=${input_user:-root}

read -sp "Enter your MySQL password [default: empty]: " input_pass
export DB_PASSWORD=${input_pass:-}
echo ""
echo ""

# 2. Start Spring Boot Backend in the background
echo "⚙️  Starting Spring Boot Backend..."
cd backend
# Make Maven wrapper executable just in case
chmod +x mvnw
# Run Spring Boot in the background and save its Process ID
./mvnw spring-boot:run > backend_log.txt 2>&1 &
BACKEND_PID=$!
echo "✅ Backend is starting in the background (logs saved to backend/backend_log.txt)."
cd ..

# 3. Setup and Start Vite/React Frontend
echo ""
echo "🎨 Setting up React Frontend..."
cd frontend
echo "Installing npm dependencies..."
npm install > /dev/null 2>&1
echo "✅ Dependencies installed."

echo "🚀 Starting Vite development server..."
echo "====================================================="
echo "   Press Ctrl+C at any time to stop both servers.    "
echo "====================================================="

# Trap Ctrl+C (SIGINT) to kill the background backend process when the user stops the frontend
trap 'echo -e "\n🛑 Stopping servers..."; kill $BACKEND_PID; exit 0' SIGINT

# Run frontend in the foreground
npm run dev