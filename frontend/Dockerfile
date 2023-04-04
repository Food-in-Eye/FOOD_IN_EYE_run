# Use an official Node runtime as a parent image
FROM node:18.14.0

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to /app
COPY . .

# Add the following line to your Dockerfile
RUN echo "webpack-dev-server --disable-host-check" >> node_modules/react-scripts/scripts/start.js

# Build the production-ready code
RUN npm run build

# Set the environment variable
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
