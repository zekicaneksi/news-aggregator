# Frontend

This is a Next.js application.

## Running the App Locally

Run the development server with:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Reverse Proxy

`next.config.js` file is edited to route requests from `/api/*` to `localhost:80/api/*`.
