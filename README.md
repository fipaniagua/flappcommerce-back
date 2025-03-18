# Shipping API

This repository contains an API for getting shipping quotes from two fictional providers: TraeloYa and Uder. The API is built with NestJS and allows you to get, compare, and select the best available shipping rate.

## Features

- Shipping quotes from multiple providers
- Automatic selection of the most economical rate
- Input data validation
- Modular and extensible structure

## Setup

### Prerequisites

- Docker and Docker Compose (recommended)
- Node.js 16+ and npm (alternative)

### Environment Variables

Before starting the application, you need to configure the necessary environment variables:

1. Create a `.env` file in the project root:

```
TRAELO_YA_API_KEY=your_api_key_here
UDER_API_KEY=your_api_key_here
```

### Running with Docker (Recommended)

1. Build and start the container:

```bash
docker-compose up --build
```

2. The API will be available at: `http://localhost:3000/api`

### Running without Docker

1. Install dependencies:

```bash
npm install
```

2. Start the application:

```bash
npm run start:dev
```

3. The API will be available at: `http://localhost:3000/api`