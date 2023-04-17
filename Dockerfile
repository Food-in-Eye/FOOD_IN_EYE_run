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

# Build the production-ready code
RUN npm run build

# Set the environment variable
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000


# 개발할 때의 커멘드
CMD ["nodemon", "--inspect=0.0.0.0:9229", "src/index.js"]

# 배포할 때의 커멘드
# CMD ["npm", "start"]
