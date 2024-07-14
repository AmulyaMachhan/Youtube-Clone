# YouTube Clone

A full-stack YouTube clone application built with the MERN stack (MongoDB, Express, React, Node.js) that mimics the core features of YouTube, including video upload, playback, user authentication, and more.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication:** Register and login with JWT-based authentication.
- **Video Upload:** Users can upload videos with metadata such as title, description, and tags.
- **Video Playback:** Stream videos with custom player controls.
- **Video Management:** Edit or delete uploaded videos.
- **Commenting System:** Users can comment on videos.
- **Like/Dislike Videos:** Users can like or dislike videos.
- **Search Functionality:** Search for videos based on title, tags, or description.
- **Responsive Design:** Fully responsive and mobile-friendly UI.

## Technologies Used

- **Frontend:**

  - React.js
  - Redux Toolkit
  - Tailwind CSS
  - Axios
  - React Router
  - React Player
  - Flowbite Components

- **Backend:**

  - Node.js
  - Express.js
  - MongoDB (Mongoose)
  - Multer (for file uploads)
  - JWT (JSON Web Tokens) for authentication
  - Cloudinary for storing videos

- **Others:**
  - Moment.js for date/time formatting
  - Docker for containerization
  - ESLint and Prettier for code formatting

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/youtube-clone.git
   cd youtube-clone
   ```

2. **Install dependencies for backend:**

   ```bash
   cd backend
   npm install
   ```

3. **Install dependencies for frontend:**

    ```bash
    cd ../frontend
    npm install
    ```

4. **Create environment variables:**

  Create a .env file in the backend directory with the following variables:

  ```bash
  PORT=your_port
  MONGO_URI=your_mongodb_uri
  CORS_ORIGIN=*
  JWT_SECRET=your_jwt_secret
  ACCESS_TOKEN_SECRET=your_access_token_secret
  ACCESS_TOKEN_EXPIRY=1d
  REFRESH_TOKEN_SECRET=your_refresh_token_secret
  REFRESH_TOKEN_EXPIRY=10d
  CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
  CLOUDINARY_API_KEY=your_cloudinary_api_key
  CLOUDINARY_API_SECRET=your_cloudinary_api_secret
  ```

5. **Run the development server:**

Open two terminals:

- Backend:

> ```bash
> cd backend
> npm run dev
> ```

- Frontend:

> ```bash
> cd frontend
> npm start
> ```

6. **Open your browser and navigate to:**

```bash
http://localhost:5000
```

## Usage

- **Register/Login:** Create an account or log in with an existing account.
- **Upload Videos:** Click the upload button to upload videos and fill in the metadata.
- **Browse & Search:** Explore uploaded videos or search using the search bar.
- **Watch Videos:** Click on a video thumbnail to watch it, like/dislike, and leave comments.
- **Manage Videos:** Navigate to your profile to manage (edit or delete) your uploaded videos.

## Folder Structure

youtube-clone/
├── backend/
│ ├── public/
│ │ └── temp/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── middlewares/
│ │ ├── db/
│ │ ├── utils/
│ │ ├── app.js
│ │ ├── constants.js
│ │ └── index.js
│ ├── .env
│ ├── .gitignore
│ ├── .prettierignore
│ ├── .prettierrc
│ ├── package-lock.json
│ ├── package.json
│ └── Readme.md
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── redux/
│ │ ├── styles/
│ │ ├── utils/
│ │ ├── App.js
│ │ └── index.js
│ └── package.json
└── README.md

## API Endpoints

### **Authentication:**

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login a user

### **Videos:**

- **GET** `/api/videos` - Get all videos
- **GET** `/api/videos/:id` - Get video by ID
- **POST** `/api/videos` - Upload a new video
- **PUT** `/api/videos/:id` - Update video details
- **DELETE** `/api/videos/:id` - Delete a video

### **Comments:**

- **POST** `/api/comments` - Add a new comment
- **GET** `/api/comments/:videoId` - Get all comments for a video
- **DELETE** `/api/comments/:id` - Delete a comment

### **Likes/Dislikes:**

- **POST** `/api/videos/:id/like` - Like a video
- **POST** `/api/videos/:id/dislike` - Dislike a video

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
