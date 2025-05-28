---
title: HTTP Request
---

API reference for the tsc.run HTTP Request. {% .lead %}

```typescript
import {http} from '@tsc-run/core';
```

## Properties

| Property    | Type                     | Description                       |
|-------------|--------------------------|-----------------------------------|
| `method`    | `string`                 | HTTP method (e.g., `GET`, `POST`) |
| `url`       | `string`                 | Full request URL                  |
| `path`      | `string`                 | Request path (e.g., `/users/123`) |
| `query`     | `Record<string, string>` | URL query parameters              |
| `params`    | `Record<string, string>` | Route parameters                  |
| `headers`   | `Record<string, string>` | Request headers                   |
| `cookies`   | `Record<string, string>` | Request cookies                   |
| `ip`        | `string`                 | Client IP address                 |
| `userAgent` | `string`                 | Client User-Agent header          |
| `body`      | `string \| undefined`    | Raw request body                  |

## Methods

### json()

Parses the request body as JSON:

```typescript
export async function POST(request: http.Request) {
    const data = await request.json();
    // data is Record<string, unknown>
}
```

**Returns**: `Promise<Record<string, unknown>>`

**Throws**: Error if no body or invalid JSON

### text()

Returns the request body as a string:

```typescript
export async function POST(request: http.Request) {
    const text = await request.text();
    // text is string
}
```

**Returns**: `Promise<string>`

### formData()

Parses the request body as form data:

```typescript
export async function POST(request: http.Request) {
    const formData = await request.formData();
    // formData is Record<string, string | string[]>
}
```

**Returns**: `Promise<Record<string, string | string[]>>`

### buffer()

Returns the request body as a Buffer:

```typescript
export async function POST(request: http.Request) {
    const buffer = await request.buffer();
    // buffer is Buffer
}
```

**Returns**: `Promise<Buffer>`


### header(name: string)

{% callout type="note" title="New" %}
Upcoming in 0.4.0-alpha.1.
{% /callout %}

Returns a specific request header value (case-insensitive):

```typescript
export async function POST(request: http.Request) {
    const authHeader = await request.header('Authorization');
}
```

**Returns**: `string | undefined`

## Next steps

- Learn about [Events](/docs/events) for asynchronous processing
- Explore [Validation](/docs/validation) patterns
- Check the [events module](/docs/events-api) API reference