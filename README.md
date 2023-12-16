# CampPlanner

CampPlanner is a web application that allows users to manage campgrounds and tourist spots. With CampPlanner, users can easily add, delete, and update campgrounds and tourist spots. The application also includes a review functionality, enabling users to share their experiences and opinions about different locations.


## Installation Instructions

1. Clone the repository: `git clone https://github.com/TeekshaHarish/CampPlanner.git`
2. Navigate to the project directory: `cd CampPlanner`
3. Install the dependencies: `npm install`
4. Set up environment variables. Create a `.env` file in the root of the project and define the following variables: MONGO_URI=<your_mongodb_connection_string>
SECRET_KEY=<your_secret_key_for_jwt>
5. Start the application. `node app.js`
6. The application should now be running at `http://localhost:3000`.

## Features

- **Campground Management**: Users can add new campgrounds, view existing campgrounds, and update the details of campgrounds like name, description, and location.

- **Tourist Spot Management**: Users can add new tourist spots, view existing spots, and update the details of tourist spots, such as name, description, and location.

- **Review System**: Users can write reviews for campgrounds and tourist spots, as well as view and edit their own reviews.

- **User Authentication**: CampPlanner includes a secure user authentication system to protect sensitive data and allow personalized experiences for users.

- **Responsive Design**: The application is designed to be responsive and work smoothly on various devices, including desktops, tablets, and smartphones.



## Technologies Used

- HTML5
- CSS
- Bootstrap 
- JavaScript
- Node.js
- Express
- MongoDB
- Mongoose
- EJS
- PassportJS

## Usage

Once the application is running, you can access it through your web browser. The application will present you with a user-friendly interface to perform the following actions:

- **Sign Up / Log In**: Users can sign up or log in to access the full features of CampPlanner.

- **View Campgrounds and Tourist Spots**: Users can browse through the list of existing campgrounds and tourist spots.

- **Add New Campground / Tourist Spot**: Authenticated users can add new campgrounds or tourist spots, providing relevant details.

- **Edit / Delete Campgrounds and Tourist Spots**: Authenticated users can edit the details or remove campgrounds and tourist spots they added.

- **Add / Edit Reviews**: Authenticated users can write reviews for campgrounds and tourist spots. They can also edit or delete their own reviews.


