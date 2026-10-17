# School Management Web App

Full-stack web application for administrators, teachers and students:
dynamic weekly calendar, grades, absences, disciplinary records, and
course/exercise publishing. Built as my PFA project (4DSI, EMSI).

## Features

- **Admin**: accounts, classes, subjects, teaching assignments, weekly
  timetable, calendar exceptions, bulk student actions (change class,
  reset password, CSV export, delete), disciplinary measures, absences
- **Teacher**: own calendar with dated remarks, student lists with
  absences, publish courses and exercises, read answers, grades
- **Student**: class calendar, grades, absences, disciplinary records,
  courses and exercises with answers

## Stack

Java, Spring Boot, Spring Security (JWT), JPA/Hibernate, MySQL,
React, Vite, REST API

## Design highlights

- **Calendar**: a typical weekly timetable plus dated exceptions
  (cancellations, one-off sessions). The server computes each week on
  request, so nothing is stored per week.
- **Security**: stateless JWT authentication, role-based access
  (`@PreAuthorize`) and ownership checks, so users only see their own data.
- **Data model**: 16 entities; users use JPA JOINED inheritance
  (admin, teacher, student).

## Run locally

1. Install Java, Maven (or use the included `mvnw`), Node.js and MySQL.
2. Create the database:
```sql
   CREATE DATABASE gestion_ecole;
```
3. In `backend/src/main/resources/`, copy `application.properties.example`
   to `application.properties` and fill in your MySQL password and a long
   random `app.jwt.secret`.
4. Start the backend (port 8080):
```
   cd backend
   ./mvnw spring-boot:run
```
5. Start the frontend:
```
   cd frontend
   npm install
   npm run dev
```
6. Create the first admin account with a POST request to
   `http://localhost:8080/api/auth/register`:
```json
   {
     "nom": "Admin",
     "prenom": "First",
     "email": "admin@example.com",
     "password": "choose-a-password",
     "role": "ADMIN"
   }
```
   Then log in from the frontend and create classes, subjects and the
   other accounts from the admin dashboard.

## Known limitations

- No automated tests yet
- No file attachments or profile photo upload
- No timetable conflict detection