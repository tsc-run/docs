---
title: API & Routing
---

Learn how to create API endpoints and handle HTTP requests in tsc.run. {% .lead %}

## File-based routing

tsc.run uses file-based routing where your directory structure defines the URL paths, and TypeScript files within those directories handle HTTP methods by exporting named handlers.

### How it works

- Directories = URL paths
- Files = HTTP method handlers
- Exports = GET, POST, PATCH, DELETE functions

```md
functions/api/
├── users/                    // /users
│   ├── handlers.ts          // exports GET, POST for /users
│   └── [id]/                // /users/[id] 
│       ├── index.ts         // exports GET, PATCH, DELETE for /users/[id]
│       └── avatar.ts        // exports GET, POST for /users/[id]/avatar
├── posts/                   // /posts
│   └── index.ts            // exports GET, POST for /posts
└── health.ts               // exports GET for /health
```

## Basic route handler

Create a simple API endpoint by exporting HTTP method functions:

```typescript
// fucntions/api/users/index.ts

import { http } from '@tsc-run/framework';

export async function GET(request: http.Request) {
  return http.response(http.STATUS_OK).json({ 
    message: 'Hello, World!' 
  });
}

export async function POST(request: http.Request) {
  const data = request.json();
  
  return http.response(http.STATUS_CREATED).json({
    data: { id: '123', ...data }
  });
}
```

## Request handling

The `Request` object provides access to the incoming HTTP request:

```typescript
export async function POST(request: http.Request) {
  // Access request properties
  const method = request.method;
  const path = request.path;
  const headers = request.headers;
  
  // Parse JSON body
  const body = request.json();
  
  return http.response(http.STATUS_OK).json({ received: body });
}
```

## Response creation

Create responses using the `http.response()` function:

```typescript
// Basic response
return http.response(http.STATUS_OK);

// JSON response
return http.response(http.STATUS_OK).json({ 
  message: 'Success' 
});

// Custom headers
return http.response(http.STATUS_OK)
  .header('X-Custom', 'value')
  .json({ data: 'result' });
```

## Next steps

- Learn about [Events](/docs/events) to handle asynchronous processing
- Explore [Validation](/docs/validation) for request validation patterns
- Check the [http module](/docs/http) API reference