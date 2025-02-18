# Dev Assessment

## Project Overview
This repository contains the solution for the backend assessment. It includes an API server built with Node.js, TypeScript, Sequelize (ORM), and MySQL.

## Local Setup and Running of the API Server

### Prerequisites
Ensure you have the following installed on your local machine:

- **Node.js** (version >= 18.x.x)
- **npm** (Node Package Manager) or **yarn**
- **MySQL** for the database

### 1. Clone the Repository
Clone the repository to your local machine:

```bash
git clone https://github.com/farisimadinphosoft/dev-assessment.git
cd dev-assessment
```

### 2. Install Dependencies
Install the required dependencies for the project:

```bash
npm install
```
or if you're using `yarn`:

```bash
yarn install
```

### 3. Set Up the Database
Make sure your MySQL database is running locally. You will need to create a `.env` file in the root directory to configure your database connection.

Create a `.env` file and add the following:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-database-password
DB_NAME=dev_assessment
DB_DIALECT=mysql
```

Alternatively, you can use your database configuration as needed.

### 4. Run Migrations
Run the Sequelize migrations to set up the necessary database tables:

```bash
npx sequelize-cli db:migrate
```

### 5. Start the API Server
You can now start the API server:

```bash
npm run dev
```
or if using `yarn`:

```bash
yarn dev
```

The API server should now be running on `http://localhost:3000` (or another port if configured differently).

### 6. Testing the API
You can test the API using tools like Postman or cURL. Ensure that the following endpoints are functional (based on your project requirements):

- **POST** `/api/register` - Register students to a teacher
  - Request body: `{ "teacherEmail": "teacher@example.com", "studentEmails": ["student1@example.com", "student2@example.com"] }`
  - Success response: HTTP 204


## Running Unit Tests

This project includes unit tests written with Jest to ensure functionality and reliability.

To run the unit tests, use the following command:

```bash
npm run test
```

or if using `yarn`:

```bash
yarn test
```

## Additional Information
- This project uses **Sequelize** as the ORM for database interaction and **MySQL** as the database engine.
- The code follows **TypeScript** for type safety and better development experience.
- Unit tests are written using **Jest** to ensure the functionality and reliability of the code.
- You can modify the database connection settings in the `.env` file as needed for your environment.

## Troubleshooting
If you encounter any issues, here are some common problems and their solutions:

1. **Error: Database connection refused**  
   - Ensure that MySQL is running on your local machine and that the credentials in the `.env` file are correct.

2. **Error: Duplicate entry for primary key**  
   - This error may occur if the data in the `teacher_students` table is being inserted without unique constraints. Ensure that the primary key and foreign key constraints are set correctly in the Sequelize models.
