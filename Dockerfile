FROM node:24

WORKDIR /app

COPY backend ./backend
COPY frontend ./frontend

# Install backend dependencies
RUN cd backend && npm ci

# Install frontend dependencies and build
RUN cd frontend && npm ci && npm run build

# Expose port (adjust as needed)
EXPOSE 3000

# Start backend (adjust command as needed)
CMD ["node", "backend/server.js"]