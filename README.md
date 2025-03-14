# Task Management App

## Overview

This is a **Task Management Application** built using **Next.js, NestJS, MongoDB, and ShadCN UI**. Users can create, update, and delete tasks while categorizing them, marking them as completed, and viewing their LinkedIn profile information scraped via Puppeteer.

## Tech Stack

- **Frontend:** Next.js, TypeScript, Redux, Tailwind CSS, ShadCN UI
- **Backend:** NestJS, MongoDB, Puppeteer
- **Authentication:** JWT-based authentication

## Setup Instructions

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/ahmedgamer4/test-anytimesoftware.git
cd test-anytimesoftware
```

### **2️⃣ Install Dependencies**

```sh
npm i -g turbo
yarn intsall 
```

### **3️⃣ Set Up Environment Variables**

Create a `.env` file in both `frontend` and `backend` directories:

#### **Backend (**\`\`\`\`**\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*)**

```
JWT_SECRET='erxDxHh4sPWFxrio8nqVlPxZW5bZp4/CkfynxzAk3ms='
JWT_EXPIRES_IN=1d
PORT=8000
MONGODB_URI=mongodb://localhost:27017/db-name
```

#### **Frontend (**````**\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*)**

```
SESSION_SECRET_KEY=8XVU6r6QAhyCRMOdooGpoOeR/BRbMU+IPFmuW
```

### **4️⃣ Start the Application**

#### Start MongoDB (if not running already):

```sh
mongod --dbpath /path/to/your/data/db
```

#### Start the monorepo

```sh
yarn run dev
```

#####  

## Additional Notes

- Ensure MongoDB is running before starting the backend.
- The LinkedIn scraper runs when a user registers with a LinkedIn URL.
