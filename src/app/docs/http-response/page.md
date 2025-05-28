---
title: HTTP Response
---

API reference for the tsc.run HTTP Response. {% .lead %}

```typescript
import {http} from '@tsc-run/core';
```

## Properties

| Property     | Type                     | Description                    |
|--------------|--------------------------|--------------------------------|
| `statusCode` | `number`                 | HTTP status code               |
| `headers`    | `Record<string, string>` | Response headers               |
| `body`       | `string`                 | Response body content          |

## Methods

All response methods are chainable and return a new `Response` object.

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

### html(content)

Sets the response body as HTML:

```typescript
return http.response(200).html('<h1>Hello World</h1>');
```

**Parameters**:
- `content` (string): HTML content

**Returns**: `Response`

### redirect(url, status?)

Creates a redirect response:

```typescript
return http.response().redirect('/login', 302);
```

**Parameters**:
- `url` (string): Redirect URL
- `status` (number, optional): Redirect status code (defaults to 302)

**Returns**: `Response`

### cookie(name, value, options?)

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

### attachment(filename?)

Sets response headers for file download:

```typescript
return http.response(200)
    .attachment('data.csv')
    .header('Content-Type', 'text/csv');
```

**Parameters**:
- `filename` (string, optional): Suggested filename for download

**Returns**: `Response`

### status(code)

Sets the response status code:

```typescript
return http.response().status(201).json({created: true});
```

**Parameters**:
- `code` (number): HTTP status code

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

## Next steps

- Learn about [Events](/docs/events) for asynchronous processing
- Explore [Validation](/docs/validation) patterns
- Check the [events module](/docs/events-api) API reference