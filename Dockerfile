FROM node:24

WORKDIR /app

COPY backend ./backend
COPY frontend ./frontend

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --ignore-scripts

# Install frontend dependencies and build
WORKDIR /app/frontend
RUN npm ci --ignore-scripts && npm run build

# Expose port (adjust as needed)
EXPOSE 3000

# Start backend (adjust command as needed)
CMD ["node", "backend/server.js"]