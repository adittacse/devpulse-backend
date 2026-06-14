# DevPulse - Internal Tech Issue & Feature Tracker

DevPulse is a backend REST API for an internal software team issue tracking system. It allows team members to register, log in, create issues, view reported bugs or feature requests, update issue information, and manage issue records based on user roles.

## Live URL

```txt
https://devpulse-backend-rouge.vercel.app
```

## Features

* User registration with role selection
* User login with JWT authentication
* Password hashing using bcrypt
* Role-based authorization system
* Contributor and maintainer role support
* Authenticated issue creation
* Public issue listing
* Public single issue details
* Issue filtering by type and status
* Issue sorting by newest or oldest
* Contributor can update own open issues
* Maintainer can update and delete any issue
* Standard success and error response format
* PostgreSQL database with raw SQL queries

## Tech Stack

* Node.js
* TypeScript
* Express.js
* PostgreSQL
* pg
* bcrypt
* jsonwebtoken
* dotenv
* cors

## Project Structure

```txt
src/
├── config/
│   └── index.ts
├── db/
│   └── index.ts
├── middleware/
│   ├── auth.ts
│   ├── globalErrorHandler.ts
│   └── index.d.ts
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.interface.ts
│   │   ├── auth.route.ts
│   │   └── auth.service.ts
│   └── issues/
│       ├── issue.controller.ts
│       ├── issue.interface.ts
│       ├── issue.route.ts
│       └── issue.service.ts
├── types/
│   └── index.ts
├── utility/
│   ├── sendResponse.ts
│   └── validators.ts
├── app.ts
└── server.ts
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/adittacse/devpulse-backend.git
cd devpulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000
CONNECTIONSTRING=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the project in development mode

```bash
npm run dev
```

The server will run on:

```txt
http://localhost:5000
```

### 5. Build the project

```bash
npm run build
```

### 6. Run the production build

```bash
npm start
```

## Environment Variables

| Variable           | Description                                       |
| ------------------ | ------------------------------------------------- |
| `PORT`             | Server running port                               |
| `CONNECTIONSTRING` | PostgreSQL database connection string             |
| `JWT_SECRET`       | Secret key for JWT token signing and verification |

## API Endpoints

### Authentication Routes

| Method | Endpoint           | Access | Description                      |
| ------ | ------------------ | ------ | -------------------------------- |
| POST   | `/api/auth/signup` | Public | Register a new user              |
| POST   | `/api/auth/login`  | Public | Login user and receive JWT token |

### Issue Routes

| Method | Endpoint          | Access                  | Description              |
| ------ | ----------------- | ----------------------- | ------------------------ |
| POST   | `/api/issues`     | Contributor, Maintainer | Create a new issue       |
| GET    | `/api/issues`     | Public                  | Get all issues           |
| GET    | `/api/issues/:id` | Public                  | Get single issue details |
| PATCH  | `/api/issues/:id` | Contributor, Maintainer | Update an issue          |
| DELETE | `/api/issues/:id` | Maintainer only         | Delete an issue          |

## Query Parameters for Get All Issues

Endpoint:

```txt
GET /api/issues
```

Available query parameters:

| Parameter | Values                            | Description                  |
| --------- | --------------------------------- | ---------------------------- |
| `sort`    | `newest`, `oldest`                | Sort issues by creation date |
| `type`    | `bug`, `feature_request`          | Filter issues by type        |
| `status`  | `open`, `in_progress`, `resolved` | Filter issues by status      |

Example:

```txt
GET /api/issues?sort=newest&type=bug&status=open
```

## Authentication Header

Protected routes require a JWT token in the request header.

```txt
Authorization: your_jwt_token
```

## Request and Response Examples

### User Registration

Endpoint:

```txt
POST /api/auth/signup
```

Request body:

```json
{
    "name": "John Doe",
    "email": "john.doe@devpulse.com",
    "password": "securePassword123",
    "role": "contributor"
}
```

Success response:

```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@devpulse.com",
        "role": "contributor",
        "created_at": "2026-01-20T09:00:00.000Z",
        "updated_at": "2026-01-20T09:00:00.000Z"
    }
}
```

### User Login

Endpoint:

```txt
POST /api/auth/login
```

Request body:

```json
{
    "email": "john.doe@devpulse.com",
    "password": "securePassword123"
}
```

Success response:

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "jwt_token_here",
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john.doe@devpulse.com",
            "role": "contributor",
            "created_at": "2026-01-20T09:00:00.000Z",
            "updated_at": "2026-01-20T09:00:00.000Z"
        }
    }
}
```

### Create Issue

Endpoint:

```txt
POST /api/issues
```

Request body:

```json
{
    "title": "Login button not responding on mobile view",
    "description": "When users tap the login button from a mobile browser, the button does not submit the form properly.",
    "type": "bug"
}
```

Success response:

```json
{
    "success": true,
    "message": "Issue created successfully",
    "data": {
        "id": 1,
        "title": "Login button not responding on mobile view",
        "description": "When users tap the login button from a mobile browser, the button does not submit the form properly.",
        "type": "bug",
        "status": "open",
        "reporter_id": 1,
        "created_at": "2026-01-20T10:30:00.000Z",
        "updated_at": "2026-01-20T10:30:00.000Z"
    }
}
```

## Database Schema Summary

### users Table

| Column       | Type               | Description                          |
| ------------ | ------------------ | ------------------------------------ |
| `id`         | SERIAL PRIMARY KEY | Unique user ID                       |
| `name`       | VARCHAR            | User full name                       |
| `email`      | VARCHAR UNIQUE     | User login email                     |
| `password`   | TEXT               | Hashed password                      |
| `role`       | VARCHAR            | User role: contributor or maintainer |
| `created_at` | TIMESTAMP          | Account creation time                |
| `updated_at` | TIMESTAMP          | Account last update time             |

### issues Table

| Column        | Type               | Description                                  |
| ------------- | ------------------ | -------------------------------------------- |
| `id`          | SERIAL PRIMARY KEY | Unique issue ID                              |
| `title`       | VARCHAR            | Issue title                                  |
| `description` | TEXT               | Issue details                                |
| `type`        | VARCHAR            | Issue type: bug or feature_request           |
| `status`      | VARCHAR            | Issue status: open, in_progress, or resolved |
| `reporter_id` | INT                | ID of the user who created the issue         |
| `created_at`  | TIMESTAMP          | Issue creation time                          |
| `updated_at`  | TIMESTAMP          | Issue last update time                       |

## User Roles and Permissions

### Contributor

* Can register and log in
* Can create new issues
* Can view all issues
* Can view single issue details
* Can update own issue only when the issue status is open

### Maintainer

* Can do everything a contributor can do
* Can update any issue
* Can change issue status
* Can delete any issue

## Standard Response Format

### Success Response

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {}
}
```

### Error Response

```json
{
    "success": false,
    "message": "Error message",
    "errors": {}
}
```

## Important Notes

* Passwords are never returned in API responses.
* JWT token is required for protected routes.
* Role verification is checked before protected operations.
* Raw SQL queries are used with `pool.query()`.
* No ORM or query builder is used.
* No SQL JOIN is used for fetching reporter information.
