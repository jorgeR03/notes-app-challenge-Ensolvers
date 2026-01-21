#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}    Notes App - Startup Script${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Check if PostgreSQL is running
echo -e "${BLUE}[1/5] Checking PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: PostgreSQL is not installed or not in PATH${NC}"
    echo -e "${RED}Please install PostgreSQL and ensure it's running${NC}"
    exit 1
fi

# Check if database exists, create if not
echo -e "${BLUE}[2/5] Checking database 'notes_db'...${NC}"
DB_EXISTS=$(psql -U postgres -lqt | cut -d \| -f 1 | grep -w notes_db)
if [ -z "$DB_EXISTS" ]; then
    echo -e "${BLUE}Creating database 'notes_db'...${NC}"
    psql -U postgres -c "CREATE DATABASE notes_db;"
    echo -e "${GREEN}✓ Database created${NC}"
else
    echo -e "${GREEN}✓ Database exists${NC}"
fi

echo ""
echo -e "${BLUE}[3/5] Starting Backend (Spring Boot)...${NC}"
cd backend

# Check if Maven wrapper exists
if [ ! -f "./mvnw" ]; then
    echo -e "${RED}Error: Maven wrapper not found in backend/mvnw${NC}"
    exit 1
fi

# Make mvnw executable
chmod +x mvnw

# Start backend in background
echo -e "${BLUE}Building and starting backend...${NC}"
./mvnw clean install -DskipTests > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Backend build failed${NC}"
    exit 1
fi

./mvnw spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo -e "${BLUE}  Backend running on: http://localhost:8080/api${NC}"

cd ..

echo ""
echo -e "${BLUE}[4/5] Starting Frontend (React + Vite)...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    npm install
fi

# Start frontend in background
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo -e "${BLUE}  Frontend running on: http://localhost:5173${NC}"

cd ..

echo ""
echo -e "${BLUE}[5/5] Waiting for services to be ready...${NC}"
sleep 5

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}    ✓ Application Started Successfully!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${BLUE}Backend API:${NC}  http://localhost:8080/api"
echo -e "${BLUE}Frontend:${NC}     http://localhost:5173"
echo ""
echo -e "${BLUE}Logs:${NC}"
echo -e "  Backend:  ${PWD}/backend.log"
echo -e "  Frontend: ${PWD}/frontend.log"
echo ""
echo -e "${BLUE}To stop the application:${NC}"
echo -e "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop monitoring logs${NC}"
echo ""

# Follow logs
tail -f backend.log frontend.log
