FROM ubuntu:18.04

# Create data directory
RUN mkdir -p /data/db

# Set working directory
WORKDIR /app

# Set timezone
ENV TZ=America/Chicago
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Update and upgrade packages
RUN apt-get update --fix-missing && \
    apt-get upgrade -y --fix-missing && \
    apt-get install -y git curl python3 python3-pip python3-lxml

# Install Python dependencies
RUN pip3 install flasgger flask flask_cors jsonschema==3.0.1 pathlib2 sqlalchemy mysql-connector-python

# Install MongoDB
RUN apt-get install -y wget gnupg && \
    wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - && \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" > /etc/apt/sources.list.d/mongodb-org-4.4.list && \
    apt-get update && \
    apt-get install -y mongodb-org && \
    rm -rf /var/lib/apt/lists/* # Clean up unnecessary files

# Install prerequisites
RUN apt-get update && \
    apt-get install -y wget curl git gcc make && \
    rm -rf /var/lib/apt/lists/*

# Install Redis
RUN wget http://download.redis.io/releases/redis-6.0.10.tar.gz && \
    tar xzf redis-6.0.10.tar.gz && \
    cd redis-6.0.10 && \
    make && \
    make install && \
    cd .. && \
    rm -rf redis-6.0.10* && \
    mkdir /var/redis && \
    chmod -R 777 /var/redis

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs

# Install Express dependencies
RUN npm install express

# Install Node.js dependencies
COPY package.json package-lock.json ./
RUN npm install

# Install Mocha, Chai, Sinon, and Request
RUN npm install mocha chai sinon request --save-dev

# Install GraphQL, Apollo Server, and Mongoose
RUN npm install graphql apollo-server-express mongoose

# Set environment variables
ENV PERSONAL_DATA_DB_USERNAME=root \
    PERSONAL_DATA_DB_PASSWORD=root \
    PERSONAL_DATA_DB_HOST=localhost \
    PERSONAL_DATA_DB_NAME=my_db

# Copy the application source code to the working directory
COPY . .

# Default command to start MongoDB service
CMD ["mongod", "--bind_ip", "0.0.0.0"]
