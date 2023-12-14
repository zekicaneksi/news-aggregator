# Add the base image for the Node.js app
FROM node:20-alpine3.18

# Create a working folder for running the application inside the Docker container
WORKDIR /src/app

# Copy dependencies to the above working folder
COPY package.json package-lock.json ./

RUN npm install 

# Copy every code to the Docker working directory
COPY ./ ./

# Tell Docker the container will listen on port 3000
EXPOSE 3000

# Run the the Node.js application
CMD ["npm", "run", "dev"]
