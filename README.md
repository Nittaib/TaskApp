This project was bootstrapped with React App and also includes a Node.js backend.

Prerequisites
Before running the project, ensure that you have the following installed:
docker
Node.js

Deploying Redis & MongoDB
run:
docker run -d --name mongodb -p 27017:27017 -v mongodb-data:/data/db mongo
docker run -d --name redis -p 6379:6379 -v redis-data:/data redis

Installing Dependencies
To install the necessary dependencies for both the frontend and backend, run:

npm install
in the backend and frontend dirs separately

Running the Frontend
To start the React frontend, use the following command:

npm start

Running the Backend
To start the Node.js backend, use the following command:

npm start
