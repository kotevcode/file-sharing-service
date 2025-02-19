# File Sharing Service

A simple file sharing service that allows users to upload files with an expiration time. Files are automatically cleaned up after expiration.

## Features

- File upload with customizable expiration time
- Automatic file cleanup
- Secure file storage using AWS S3
- Shareable URLs for downloaded files

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL
- **Storage**: AWS S3
- **Testing**: Jest

## Prerequisites

- Node.js (v16+)
- PostgreSQL
- AWS Account with S3 bucket
- Yarn

## Environment Variables

Create `.env` file in the server directory:

```
PORT=4040
POSTGRES_USER=your_user
POSTGRES_PASS=your_password
POSTGRES_DB=file-sharing-service
POSTGRES_HOST=localhost
AWS_S3_BUCKET=your_bucket_name
AWS_REGION=your_region
```

Create `.env` file in the client directory:

```
VITE_API_URL=http://localhost:4040
```

## Installation

Install dependencies

```
yarn install
```

Run database migrations

```
cd server && sequelize-cli db:migrate --url 'postgres://root:root@localhost/file-sharing-service'
```

Build both client and server
```
yarn build
```

Run both client and server in development mode
```
yarn dev
```

Run only client
```
yarn dev:client
```

Run only server
```
yarn dev:server
```

## Testing

Run server tests
```
cd server && yarn test
```

Run with coverage
```
cd server && yarn test:coverage
```

Run cleanup job
```
cd server && yarn cleanup
```


## Key Considerations

1. **Security**:
   - Files are stored in S3 with unique IDs
   - File access is validated against expiration time
   - Input validation using AJV

2. **Performance**:
   - Files are streamed directly from S3
   - Database indexes on frequently queried fields
   - Efficient cleanup process for expired files

3. **Scalability**:
   - Separate cleanup job can be run independently
   - Stateless architecture allows horizontal scaling
   - Uses connection pooling for database

