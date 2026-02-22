# AI Career Platform - Backend Server

This is the backend server for the AI Career Platform, designed to be deployed separately on platforms like Railway.

## Deployment to Railway

### Prerequisites
- Railway account created (https://railway.app)

### Steps

1. **Push your code to a Git repository (GitHub, GitLab, etc.)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for backend server"
   git remote add origin your-git-repository-url
   git push -u origin main
   ```

2. **Deploy to Railway**
   - Go to https://railway.app
   - Click "New Project"
   - Select your Git repository
   - Railway will automatically detect this as a Node.js project

3. **Set environment variables in Railway**
   - Go to your project in Railway
   - Navigate to "Variables" or "Environment Variables"
   - Add the following variables:
     - `MONGODB_URI`: your-mongodb-connection-string
     - `JWT_SECRET`: your-very-secure-jwt-secret-key-here

4. **Configure the deployment**
   - Railway will automatically use the `start` script from package.json
   - The `web: node server.js` in Procfile will be detected

5. **Access your deployed app**
   - Your app will be available at a URL like: https://your-project-name.up.railway.app

## Environment Variables Required

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires authentication)

## Updating Frontend

Once deployed, update the frontend to use the new backend URL:

1. In your Vercel deployment, set the environment variable:
   ```
   REACT_APP_API_URL=https://your-project-name.up.railway.app
   ```

2. Rebuild and redeploy the frontend to Vercel

## Local Development

To run locally:
```bash
npm install
npm start
```

Make sure you have the required environment variables set in a `.env` file:
```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```