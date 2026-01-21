# 📝 Notes App - Full Stack Application

A modern, full-stack notes application with categories, built with Spring Boot and React.

## 🚀 Features

### Phase 1 (Core Features) 
- Create, edit, and delete notes
- Archive/unarchive notes
- List active notes
- List archived notes

### Phase 2 (Advanced Features) 
- Add/remove categories to notes
- Filter notes by category
- Modern, responsive UI with Tailwind CSS

## 🛠️ Technology Stack

### Backend
- **Java**: 21
- **Spring Boot**: 3.5.9
- **Spring Data JPA** (Hibernate ORM)
- **PostgreSQL**: 17
- **Maven**: 3.x
- **Lombok**: For reducing boilerplate code

### Frontend
- **React**: 18
- **TypeScript**: 5.x
- **Vite**: 7.x (Build tool)
- **TailwindCSS**: 3.4.1 (Styling)
- **Axios**: HTTP client
- **React Query**: Server state management

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Java JDK 21**: [Download here](https://www.oracle.com/java/technologies/downloads/#java21)
- **Node.js 18+** and **npm 9+**: [Download here](https://nodejs.org/)
- **PostgreSQL 15+**: [Download here](https://www.postgresql.org/download/)
- **Git**: [Download here](https://git-scm.com/)

### Verify installations:

```bash
java -version    # Should show Java 21.x.x
node -v          # Should show v18.x.x or higher
npm -v           # Should show 9.x.x or higher
psql --version   # Should show PostgreSQL 15+ or higher
```

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

#### Option A: Using pgAdmin (GUI)
1. Open **pgAdmin**
2. Connect to your PostgreSQL server
3. Right-click on **Databases** → **Create** → **Database**
4. Database name: `notes_db`
5. Owner: `postgres`
6. Click **Save**

#### Option B: Using psql (Command Line)
```bash
psql -U postgres
CREATE DATABASE notes_db;
\q
```

### 2. Configure Database Connection

Edit `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/notes_db
    username: postgres
    password: YOUR_POSTGRES_PASSWORD  # Change this! - Coloca la tuya!
```

**Important**: Replace `YOUR_POSTGRES_PASSWORD` with your actual PostgreSQL password.

## Quick Start

### Option 1: Using the startup script (Linux/macOS)

```bash
# Make the script executable
chmod +x start.sh

# Run the script
./start.sh
```

The script will:
- Check PostgreSQL and create database if needed
- Build and start the backend
- Install dependencies and start the frontend
- Display URLs and log locations

### Option 2: Manual startup

#### Start Backend:
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

Backend will run on: **http://localhost:8080/api**

#### Start Frontend (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: **http://localhost:5173**

## 🌐 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api

### API Endpoints

#### Notes
- `GET /api/notes/active` - Get all active notes
- `GET /api/notes/archived` - Get all archived notes
- `GET /api/notes/{id}` - Get note by ID
- `GET /api/notes/category/{categoryId}` - Get notes by category
- `POST /api/notes` - Create a new note
- `PUT /api/notes/{id}` - Update a note
- `DELETE /api/notes/{id}` - Delete a note
- `PATCH /api/notes/{id}/archive` - Archive a note
- `PATCH /api/notes/{id}/unarchive` - Unarchive a note

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `PUT /api/categories/{id}` - Update a category
- `DELETE /api/categories/{id}` - Delete a category


## Architecture

### Backend Architecture (Spring Boot)

The backend follows a **layered architecture** pattern:

1. **Controller Layer**: Handles HTTP requests and responses
2. **Service Layer**: Contains business logic
3. **Repository Layer**: Manages data persistence (JPA)
4. **Model Layer**: JPA entities
5. **DTO Layer**: Data transfer objects for API

### Frontend Architecture (React)

- **Components**: Reusable UI components
- **Services**: API communication with Axios
- **Types**: TypeScript interfaces
- **State Management**: React Query for server state

## Testing the Application

### Create a Category
1. Click **"+ New Category"**
2. Enter a category name (e.g., "Work")
3. Click **"Create"**

### Create a Note
1. Click **"+ New Note"**
2. Fill in the title and content
3. Select categories (optional)
4. Click **"Create Note"**

### Other Features
- Edit notes by clicking **"Edit"**
- Archive notes by clicking **"Archive"**
- View archived notes by clicking **"Show Archived"**
- Filter notes by category using the category buttons
- Remove categories from notes using the **×** button

## Stopping the Application

### If using the startup script:
```bash
# Find the process IDs
ps aux | grep java
ps aux | grep vite

# Kill the processes
kill <BACKEND_PID> <FRONTEND_PID>
```

### If started manually:
- Press `Ctrl+C` in each terminal window

## Troubleshooting

### Backend won't start - Database connection error
**Error**: `authentication failed for user "postgres"`

**Solution**:
1. Check PostgreSQL is running
2. Verify the password in `backend/src/main/resources/application.yml`
3. Ensure the database `notes_db` exists

### Frontend build errors - Tailwind CSS
**Error**: `postcss plugin error`

**Solution**:
```bash
cd frontend
npm uninstall tailwindcss postcss autoprefixer
npm install -D tailwindcss@3.4.1 postcss@8.4.35 autoprefixer@10.4.18
npx tailwindcss init -p
npm run dev
```

### Port already in use
**Error**: `Port 8080 is already in use`

**Solution**:
```bash
# Find and kill the process using port 8080
# Linux/macOS:
lsof -ti:8080 | xargs kill

# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

## Development Notes

### Backend
- Uses **Hibernate JPA** for ORM
- Automatic table creation/update via `ddl-auto: update`
- CORS enabled for `localhost:5173` and `localhost:3000`
- Logging level set to DEBUG for development

### Frontend
- Hot Module Replacement (HMR) enabled
- Tailwind CSS for utility-first styling
- React Query for efficient data fetching and caching
- TypeScript for type safety

## Author

**Jorge Andres Caceres** - Full Stack Developer

## License

This project is developed as part of the Ensolvers technical challenge.


**Enjoy using the Notes App! 🎉**