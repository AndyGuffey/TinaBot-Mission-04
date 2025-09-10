# TinaBot Insurance Assistant

<img src="m4-frontend/public/Favicon.png" alt="TinaBot Insurance Assistant" width="100" height="100">

TinaBot is an AI-powered insurance policy assistant that helps users find the right insurance policy through an interactive chat interface. This application uses Google's Gemini AI to provide personalized insurance recommendations.

## Features

- 💬 Interactive chat interface with TinaBot
- 🤖 Real-time AI responses using Google's Gemini models
- ✨ Markdown support for formatted responses
- 📱 Responsive design with custom branding
- 🐳 Containerized deployment for easy portability

## Tech Stack

### Frontend

- **React.js** - UI library
- **Tailwind CSS with DaisyUI** - Styling framework
- **ReactMarkdown** - For message formatting
- **Custom styling** - With brand colors

### Backend

- **Node.js with Express** - API server
- **Google Generative AI SDK** - Interface with Gemini AI
- **Custom system prompts** - For insurance domain knowledge

### DevOps

- **Docker** - For containerization
- **Docker Compose** - For orchestration
- **Nginx** - For serving frontend and API proxying

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Google Gemini API key

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/AndyGuffey/TinaBot-Mission-04.git
   cd TinaBot-Mission-04
   ```

2. Create a `.env` file in the root directory with your Gemini API key

   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

3. Build and start the containers

   ```bash
   docker-compose up --build
   ```

4. Access the application at http://localhost

## Project Structure

```
mission-04/
├── docker-compose.yml    # Docker Compose configuration
├── m4-frontend/          # React frontend application
│   ├── Dockerfile        # Frontend Docker configuration
│   ├── nginx.conf        # Nginx configuration for serving and proxying
│   └── src/              # React source code
│       ├── App.jsx       # Main application component
│       └── ...
└── m4-backend/           # Node.js backend application
    ├── Dockerfile        # Backend Docker configuration
    ├── server.js         # Express server setup
    └── prompt.js         # System prompts for the Gemini AI
```

## Development

### Running in Development Mode

For development without Docker:

1. Start the backend

   ```bash
   cd m4-backend
   npm install
   npm run dev
   ```

2. Start the frontend in a separate terminal

   ```bash
   cd m4-frontend
   npm install
   npm run dev
   ```

3. Access the development server at http://localhost:5173

### Modifying the System Prompts

The AI behavior can be customized by editing the system prompts in `m4-backend/prompt.js`:

```javascript
module.exports = {
  insurance: `You are TinaBot, an AI assistant for insurance policies.
  Your goal is to help users find the right insurance policy by asking
  relevant questions about their needs and providing tailored recommendations.
  Be friendly, professional, and concise in your responses.`,

  // Additional prompts...
};
```

## Additional Information

### Architecture Details

The application follows a modern microservices architecture:

- Frontend container serves the React application via Nginx
- Backend container runs the Node.js Express server
- Communication between services is handled via Docker networking
- API requests are proxied through Nginx to the backend

### Deployment Options

#### Production Deployment

For production deployment, consider:

- Using a container orchestration platform like Kubernetes
- Setting up CI/CD pipelines for automated deployment
- Implementing proper logging and monitoring
- Using a reverse proxy like Traefik or Nginx Ingress

#### Cloud Deployment

The containerized application can be easily deployed to:

- AWS ECS or EKS
- Google Cloud Run or GKE
- Azure Container Instances or AKS

## Troubleshooting

- **API Key Issues**: Ensure your Gemini API key is correctly set in the `.env` file
- **Container Communication**: If services can't communicate, check the Nginx configuration
- **Port Conflicts**: Make sure ports 80 and 3000 are not in use by other applications

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for providing the language model capabilities
- React and Vite teams for frontend tooling
- Docker for simplifying deployment and environment consistency

```

```
