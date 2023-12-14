# Frontend

This is a Next.js application.

## Running the App Locally

### Prerequisites

- npm
- Node.js

Install dependencies with;
```
npm run install
```

Run the development server with:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Reverse Proxy

`next.config.js` file is edited to route requests from `/api/*` to `localhost:80/api/*`.

### Docker

A Dockerfile is provided for containerization. It can be used for development with mount binding.
