---
title: http module
---

Complete API reference for the tsc.run HTTP module used in route handlers. {% .lead %}

## Import

```typescript
import {http} from '@tsc-run/framework';
```

## Request object

The `Request` object provides access to incoming HTTP request data.

### Properties

| Property  | Type                     | Description                       |
|-----------|--------------------------|-----------------------------------|
| `path`    | `string`                 | Request path (e.g., `/users/123`) |
| `method`  | `string`                 | HTTP method (e.g., `GET`, `POST`) |
| `headers` | `Record<string, string>` | Request headers                   |
| `body`    | `string \| undefined`    | Raw request body                  |

### Methods

#### json()

Parses the request body as JSON:

```typescript
export async function POST(request: http.Request) {
    const data = request.json();
    // data is Record<string, unknown>
}
```

**Returns**: `Record<string, unknown>`

## Response creation

### http.response(statusCode)

Creates a new response with the specified status code:

```typescript
const response = http.response(http.STATUS_CREATED);
```

**Parameters**:

- `statusCode` (number): HTTP status code

**Returns**: `Response`

### json(data)

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

### header(name, value)

Sets a response header:

```typescript
return http.response(200)
    .header('X-Custom-Header', 'value')
    .json({message: 'Success'});
```

**Parameters**:

- `name` (string): Header name
- `value` (string): Header value

**Returns**: `ResponseBuilder` (chainable)

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
http.STATUS_BAD_GATEWAY           // 502
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
import {http} from '@tsc-run/framework';

export async function GET(request: http.Request) {
    return http.response(http.STATUS_OK).json({
        message: 'Hello, World!',
        timestamp: new Date().toISOString()
    });
}
```

### POST with validation

```typescript
import {http} from '@tsc-run/framework';
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