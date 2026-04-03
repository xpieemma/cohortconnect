# 📋 Pro-Tasker

A collaborative project management tool for small teams.

## 🌐 Deployment

* **Frontend:** 🔗 https://pro-tasker-mw.netlify.app
* **Backend:** 🔗 https://pro-tasker-35rc.onrender.com

## 💻 Technologies Used

* **MongoDB:** Atlas combines the flexible document model with a suite of data services to give you a versatile cloud database that simplifies everything you build.
* **Express:** Fast, unopinionated, minimalist web framework for Node.js
* **React:** Frontend library for building the user interface.
* **Node.js:** A free, open-source, cross-platform JavaScript runtime environment that lets developers create servers, web apps, command line tools and scripts
* **Tailwind CSS:** Utility-first framework for styling.
* **And more...:** More dependencies can be found in the package.json files.

## ✨ Features

* **Create Tasks and Projects:** User can create new tasks and projects.
* **View Tasks and Projects:** Displays a list of all user-owned projects or project-related tasks.
* **Update Status:** Change the current phase of any task (e.g., from pending to completed).
* **Edit Tasks and Projects:** Edit any task or project property.
* **Delete Tasks and Projects:** Permanently remove projects from the dashboard and/or tasks from the Project Details page.

## 🔌 API Endpoints

**User Endpoints**

| Method | Endpoint| Description |
| :--- | :--- | :--- |
| POST | /api/users/register | Create a user |
| POST | /api/users/login | User login |
| GET | /api/users/| Verify a user |
| GET | /api/users/list| Get a list of users. This can only be accessed by an authenticated user. |

**Project Endpoints**

| Method | Endpoint| Description |
| :--- | :--- | :--- |
| POST | /api/projects/ | Create a project |
| GET | /api/projects/ | Retrieve a user's projects |
| GET | /api/projects/:projectId | Retrieves a user's project by Project ID |
| PUT | /api/projects/:projectId | Update a project with it's ID |
| DELETE | /api/projects/:projectId | Delete a project with it's ID |

**Task Endpoints**

| Method | Endpoint| Description |
| :--- | :--- | :--- |
| POST | /api/projects/:projectId/tasks | Create a task associated with a project |
| GET | /api/projects/:projectId/tasks | Retrieves tasks for a Project ID |
| PUT | /api/tasks/:taskId | Update a task with it's ID |
| PUT | /api/projects/:projectId/api/tasks/:taskId | Update a task with it's ID |
| DELETE | /api/tasks/:taskId | Delete a task with it's ID |
| DELETE | /api/projects/:projectId/api/tasks/:taskId | Delete a task with it's ID |


## ⚙️ Installation and Setup

To run this project locally, execute the following commands in your terminal:

### Clone the reposityory
```bash
# Clone the repository
git clone https://github.com/shanosha/pro-tasker.git
```

### Replace environment variables

There are example .env files in the "frontend" and "backend" directories. Update the variables there with your local variables.

### Backend
```bash
# Navigate into the backend directory
cd pro-tasker/backend

# Install dependencies
npm install

# Start the local development server
npm run dev
```

### Frontend
```bash
# Navigate into the frontend directory
cd pro-tasker/frontend

# Install dependencies
npm install

# Start the local development server
npm run dev
```