---
title: http module
---

Complete API reference for the tsc.run HTTP module used in route handlers. {% .lead %}

## Import

```typescript
import {http} from '@tsc-run/core';
```

## Request object

The `Request` object provides access to incoming HTTP request data.

### Properties

| Property    | Type                     | Description                            |
|-------------|--------------------------|----------------------------------------|
| `method`    | `string`                 | HTTP method (e.g., `GET`, `POST`)      |
| `url`       | `string`                 | Full request URL                       |
| `path`      | `string`                 | Request path (e.g., `/users/123`)     |
| `query`     | `Record<string, string>` | URL query parameters                   |
| `params`    | `Record<string, string>` | Route parameters                       |
| `headers`   | `Record<string, string>` | Request headers                        |
| `cookies`   | `Record<string, string>` | Request cookies                        |
| `ip`        | `string`                 | Client IP address                      |
| `userAgent` | `string`                 | Client User-Agent header               |
| `body`      | `string \| undefined`    | Raw request body                       |

### Methods

#### json()

Parses the request body as JSON:

```typescript
export async function POST(request: http.Request) {
    const data = await request.json();
    // data is Record<string, unknown>
}
```

**Returns**: `Promise<Record<string, unknown>>`

**Throws**: Error if no body or invalid JSON

#### text()

Returns the request body as a string:

```typescript
export async function POST(request: http.Request) {
    const text = await request.text();
    // text is string
}
```

**Returns**: `Promise<string>`

#### formData()

Parses the request body as form data:

```typescript
export async function POST(request: http.Request) {
    const formData = await request.formData();
    // formData is Record<string, string | string[]>
}
```

**Returns**: `Promise<Record<string, string | string[]>>`

#### buffer()

Returns the request body as a Buffer:

```typescript
export async function POST(request: http.Request) {
    const buffer = await request.buffer();
    // buffer is Buffer
}
```

**Returns**: `Promise<Buffer>`

## Response object

The `Response` object represents an HTTP response with chainable methods for setting content and headers.

### Properties

| Property     | Type                     | Description                    |
|--------------|--------------------------|--------------------------------|
| `statusCode` | `number`                 | HTTP status code               |
| `headers`    | `Record<string, string>` | Response headers               |
| `body`       | `string`                 | Response body content          |

### Methods

All response methods are chainable and return a new `Response` object.

#### json(data)

Sets the response body as JSON:

```typescript
return http.response(200).json({
    message: 'Success',
    data: {id: '123'}
});
```

**Parameters**:
- `data` (string | Record<string, unknown>): Data to serialize as JSON

**Returns**: `Response`

#### html(content)

Sets the response body as HTML:

```typescript
return http.response(200).html('<h1>Hello World</h1>');
```

**Parameters**:
- `content` (string): HTML content

**Returns**: `Response`

#### redirect(url, status?)

Creates a redirect response:

```typescript
return http.response().redirect('/login', 302);
```

**Parameters**:
- `url` (string): Redirect URL
- `status` (number, optional): Redirect status code (defaults to 302)

**Returns**: `Response`

#### cookie(name, value, options?)

Sets a response cookie:

```typescript
return http.response(200)
    .cookie('sessionId', 'abc123', {
        httpOnly: true,
        secure: true,
        maxAge: 3600000
    })
    .json({message: 'Logged in'});
```

**Parameters**:
- `name` (string): Cookie name
- `value` (string): Cookie value  
- `options` (CookieOptions, optional): Cookie configuration

**Returns**: `Response`

#### attachment(filename?)

Sets response headers for file download:

```typescript
return http.response(200)
    .attachment('data.csv')
    .header('Content-Type', 'text/csv');
```

**Parameters**:
- `filename` (string, optional): Suggested filename for download

**Returns**: `Response`

#### status(code)

Sets the response status code:

```typescript
return http.response().status(201).json({created: true});
```

**Parameters**:
- `code` (number): HTTP status code

**Returns**: `Response`

#### header(name, value)

Sets a response header:

```typescript
return http.response(200)
    .header('X-Custom-Header', 'value')
    .json({message: 'Success'});
```

**Parameters**:
- `name` (string): Header name
- `value` (string): Header value

**Returns**: `Response`

## Response creation

### http.response(statusCode?)

Creates a new response with the specified status code:

```typescript
const response = http.response(http.STATUS_CREATED);
// or
const response = http.response(); // defaults to 200
```

**Parameters**:
- `statusCode` (number, optional): HTTP status code (defaults to 200)

**Returns**: `Response`

## Cookie options

When setting cookies, you can provide additional options:

```typescript
type CookieOptions = {
  maxAge?: number;        // Cookie lifetime in milliseconds
  expires?: Date;         // Expiration date
  domain?: string;        // Cookie domain
  path?: string;          // Cookie path
  secure?: boolean;       // HTTPS only
  httpOnly?: boolean;     // HTTP only (not accessible via JavaScript)
  sameSite?: 'strict' | 'lax' | 'none'; // SameSite policy
};
```

## Status codes

Pre-defined status code constants:

### Success codes

```typescript
http.STATUS_OK                   // 200
http.STATUS_CREATED              // 201
http.STATUS_ACCEPTED             // 202
http.STATUS_NO_CONTENT           // 204
```

### Client error codes

```typescript
http.STATUS_BAD_REQUEST          // 400
http.STATUS_UNAUTHORIZED         // 401
http.STATUS_FORBIDDEN            // 403
http.STATUS_NOT_FOUND            // 404
http.STATUS_METHOD_NOT_ALLOWED   // 405
http.STATUS_CONFLICT             // 409
http.STATUS_UNPROCESSABLE_ENTITY // 422
```

### Server error codes

```typescript
http.STATUS_INTERNAL_SERVER_ERROR // 500
http.STATUS_NOT_IMPLEMENTED       // 501
http.STATUS_SERVICE_UNAVAILABLE   // 503
```

## Validation

### http.validate(schema, data)

Validates data against a Zod schema:

```typescript
import {z} from 'zod';

const userSchema = z.object({
    name: z.string().min(1),
    email: z.string().email()
});

export async function POST(request: http.Request) {
    const result = http.validate(userSchema, request.json());

    if (!result.success) {
        return http.response(http.STATUS_BAD_REQUEST).json({
            errors: result.errors
        });
    }

    const {name, email} = result.data;
    // TypeScript knows the exact type here
}
```

**Parameters**:

- `schema` (ZodSchema): Zod validation schema
- `data` (unknown): Data to validate

**Returns**: `ValidationResult<T>`

### ValidationResult

```typescript
type ValidationResult<T> =
    | { success: true; data: T }
    | { success: false; errors: ZodIssue[] };
```

## Complete examples

### Simple GET endpoint

```typescript
import {http} from '@tsc-run/core';

export async function GET(request: http.Request) {
    return http.response(http.STATUS_OK).json({
        message: 'Hello, World!',
        timestamp: new Date().toISOString()
    });
}
```

### POST with validation

```typescript
import {http} from '@tsc-run/core';
import {z} from 'zod';

const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email required'),
    age: z.number().min(0).optional()
});

export async function POST(request: http.Request) {
    // Validate request body
    const result = http.validate(createUserSchema, request.json());
    if (!result.success) {
        return http.response(http.STATUS_BAD_REQUEST).json({
            message: 'Validation failed',
            errors: result.errors
        });
    }

    const userData = result.data;

    // Create user (example)
    const user = {
        id: generateId(),
        ...userData,
        createdAt: new Date().toISOString()
    };

    // Save to database...
    await saveUser(user);

    return http.response(http.STATUS_CREATED).json({
        data: {id: user.id}
    });
}
```

### Error handling

```typescript
export async function GET(request: http.Request) {
    try {
        const data = await fetchData();

        return http.response(http.STATUS_OK).json({
            data
        });
    } catch (error) {
        console.error('Error fetching data:', error);

        return http.response(http.STATUS_INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error'
        });
    }
}
```

### Custom headers

```typescript
export async function GET(request: http.Request) {
    const data = await fetchData();

    return http.response(http.STATUS_OK)
        .header('X-Total-Count', data.length.toString())
        .header('Cache-Control', 'max-age=3600')
        .json({
            data,
            meta: {
                total: data.length,
                timestamp: new Date().toISOString()
            }
        });
}
```

### Multiple HTTP methods

Handle multiple HTTP methods in a single file:

```typescript
// GET /users
export async function GET(request: http.Request) {
    const users = await getAllUsers();

    return http.response(http.STATUS_OK).json({
        data: users
    });
}

// POST /users
export async function POST(request: http.Request) {
    const userData = request.json();
    const user = await createUser(userData);

    return http.response(http.STATUS_CREATED).json({
        data: user
    });
}

// PUT /users
export async function PUT(request: http.Request) {
    const userData = request.json();
    const user = await updateUser(userData);

    return http.response(http.STATUS_OK).json({
        data: user
    });
}

// DELETE /users
export async function DELETE(request: http.Request) {
    await deleteAllUsers();

    return http.response(http.STATUS_NO_CONTENT);
}
```

## Next steps

- Learn about [Events](/docs/events) for asynchronous processing
- Explore [Validation](/docs/validation) patterns
- Check the [events module](/docs/events-api) API reference