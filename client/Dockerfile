# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Install TypeScript globally
RUN npm install -g typescript tsc-alias vite

# Copy package files
COPY package.json ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build the application
RUN yarn run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
