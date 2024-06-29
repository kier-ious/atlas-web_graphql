FROM ubuntu:20.04

# Set timezone (optional)
ENV TZ=America/Chicago
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install required packages in a single RUN command to reduce layer count
RUN apt-get update && \
    apt-get install -y \
    git \
    curl \
    python3 \
    python3-pip \
    python3-lxml \
    wget \
    gnupg \
    gcc \
    make \
    nodejs \
    npm \
    redis-server \
    && rm -rf /var/lib/apt/lists/*

# Install MongoDB
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - && \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list && \
    apt-get update && \
    apt-get install -y mongodb-org && \
    rm -rf /var/lib/apt/lists/*

# Install necessary Python packages
RUN pip3 install \
    flasgger \
    flask \
    flask_cors \
    jsonschema==3.0.1 \
    pathlib2 \
    sqlalchemy \
    mysql-connector-python

# Set environment variables
ENV PERSONAL_DATA_DB_USERNAME=root \
    PERSONAL_DATA_DB_PASSWORD=root \
    PERSONAL_DATA_DB_HOST=localhost \
    PERSONAL_DATA_DB_NAME=my_db

# Create directories and set working directory
RUN mkdir -p /data/db \
    && mkdir -p /var/redis \
    && mkdir -p /app
WORKDIR /app

# Initialize npm project and install local dependencies
RUN npm init -y \
    && npm install \
    express \
    graphql \
    express-graphql \
    apollo-boost \
    graphql-tag \
    react-apollo \
    --save

# Copy package.json and package-lock.json for npm install
COPY package.json package-lock.json ./

# Install npm packages for the application
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose ports if necessary
# EXPOSE 3000 (example port)

# Default command to start MongoDB service
CMD ["mongod", "--bind_ip", "0.0.0.0"]
