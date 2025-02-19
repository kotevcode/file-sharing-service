FROM node:20-alpine

WORKDIR /app

# Install TypeScript globally
RUN npm install -g typescript tsc-alias

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig*.json ./

RUN yarn install

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose the port defined in Helm values
EXPOSE 4040

# Start the server
CMD ["yarn", "start"]


