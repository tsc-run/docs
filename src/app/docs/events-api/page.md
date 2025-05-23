---
title: events module
---

API reference for the tsc.run events module used for dispatching and handling events. {% .lead %}

## Import

```typescript
import { events } from '@tsc-run/framework';
```

## Emitting events

### events.emit(type, data)

Emits an event to be processed by configured subscribers:

```typescript
import { events } from '@tsc-run/framework';

export async function POST(request: http.Request) {
  const userData = request.json();
  
  // Create user...
  const user = { id: '123', name: userData.name };
  
  await events.emit('user.registered', user);
  
  return http.response(http.STATUS_CREATED).json({
    data: { id: user.id }
  });
}
```

**Parameters**:
- `type` (string): Event type/name (e.g., 'user.registered')
- `data` (unknown): Event payload data

**Returns**: `Promise<void>`

---

## Next steps

- Learn about [Subscribers](/docs/subscribers) implementation patterns
- Explore [Configuration](/docs/configuration) for event setup
- Check the [http module](/docs/http) for API endpoints