# AI Career Platform - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Create a free account at [vercel.com](https://vercel.com)
2. **MongoDB Atlas Account**: Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
3. **Node.js**: Version 14 or higher
4. **Git**: For version control

## Step 1: Set up MongoDB Atlas

1. Create a MongoDB Atlas cluster (free tier available)
2. Get your connection string from Atlas dashboard
3. Update the `.env.vercel` file with your MongoDB URI

## Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

## Step 3: Deploy to Vercel

### Option 1: Using Vercel CLI

```bash
# Navigate to project root
cd infosys_internship

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts to configure your project
```

### Option 2: Using Git Integration

1. Push your code to GitHub/GitLab
2. Import project in Vercel dashboard
3. Connect your Git repository
4. Configure environment variables in Vercel dashboard

## Step 4: Configure Environment Variables

In your Vercel project dashboard, add these environment variables:

```
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=production
```

## Step 5: Redeploy

After setting environment variables, redeploy:

```bash
vercel --prod
```

## Important Notes

### Database Migration
- **Local MongoDB** → **MongoDB Atlas** (cloud database)
- Update connection string in environment variables
- No data migration needed if starting fresh

### File Uploads
- Vercel has 50MB limit for serverless functions
- Large file uploads may need external storage (AWS S3, Cloudinary)

### Python Dependencies
- Some Python packages may not work in Vercel's environment
- Consider using external Python services for heavy ML tasks

## Project Structure for Vercel

```
infosys_internship/
├── api/                 # Vercel Serverless Functions
│   ├── auth/
│   ├── resume/
│   ├── career/
│   └── trending/
├── frontend/            # React application
├── backend/             # Original backend (for reference)
├── vercel.json          # Vercel configuration
└── package.json         # Root package.json
```

## Testing Deployment

After deployment:
1. Visit your Vercel URL
2. Test all features:
   - User registration/login
   - Resume upload
   - Job matching
   - Career simulation
   - Skill prediction

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string format

2. **API Route Not Found**
   - Check Vercel function logs
   - Verify API route file structure

3. **Python Module Errors**
   - Some packages may not be available in Vercel
   - Consider using external Python APIs

## Production Considerations

1. **Security**: Use strong JWT secrets
2. **Monitoring**: Set up error tracking
3. **Performance**: Enable Vercel's Edge Network
4. **Backup**: Regular MongoDB backups
5. **Scaling**: Vercel auto-scales serverless functions

## Support

For issues with deployment:
- Vercel Support: https://vercel.com/support
- MongoDB Atlas: https://www.mongodb.com/support