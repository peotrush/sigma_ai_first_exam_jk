FROM node:20

# Install PostgreSQL client and Redis CLI for database/cache connections
RUN apt-get update && apt-get install -y \
    postgresql-client-15 \
    redis-tools \
    && rm -rf /var/lib/apt/lists/*

# Install global Node.js tools
RUN npm install -g typescript eslint @nestjs/cli