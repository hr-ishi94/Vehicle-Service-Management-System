# Vehicle Service Management System

This is a full-stack application for managing vehicle service data, built with Django (backend), Django Rest Framework (DRF), and React with Vite (frontend).

## Table of Contents
- [Technologies](#technologies)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [License](#license)

## Technologies
- **Backend**: Django, Django Rest Framework, Sqlite3
- **Frontend**: React, Vite , Redux Toolkit 
- **Database**: Sqlite3
- **Charts Library**: Recharts


## Installation

### Backend Setup
1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd vehicle-service-management/backend
    ```

2. Create and activate a virtual environment:

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. Install the backend dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Apply migrations to set up the database:

    ```bash
    python manage.py migrate
    ```

5. Create a superuser to access the Django admin (optional):

    ```bash
    python manage.py createsuperuser
    ```

6. Start the backend server:

    ```bash
    python manage.py runserver
    ```

The backend will be running on `http://127.0.0.1:8000/`.

### Frontend Setup
1. Navigate to the frontend directory:

    ```bash
    cd vehicle-service-management/frontend
    ```

2. Install the frontend dependencies using npm or yarn:

    ```bash
    npm install  # or `yarn install` if you use Yarn
    ```

3. Start the frontend server:
    ```bash
    npm run dev  # or `yarn dev` if you use Yarn
    ```

The frontend will be running on `http://localhost:5173/`.

## Running the Application

- The frontend and backend servers should be running simultaneously.
- Make sure the frontend is making requests to the correct API URL provided by your backend server.


