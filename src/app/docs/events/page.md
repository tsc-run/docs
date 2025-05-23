---
title: Events
---

Learn how to dispatch and handle events for asynchronous processing in tsc.run. {% .lead %}

## Event-driven architecture

tsc.run uses an event-driven architecture where you can dispatch events from your API handlers and process them asynchronously with subscribers.

## Defining event types

Create type-safe events by defining TypeScript types:

```typescript
// events/user-registered.ts
export type UserRegisteredEvent = {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
}
```

## Dispatching events

Dispatch events from your API handlers using the `events.emit()` function:

```typescript
import { http, events } from '@tsc-run/framework';
import type { UserRegisteredEvent } from '../events/user-registered.js';

export async function POST(request: http.Request) {
  const userData = request.json();
    
  // Event
  const user: UserRegisteredEvent = {
    id: uuidv7(),
    ...userData,
    registeredAt: new Date().toISOString()
  };
  
  // Dispatch event for async processing
  await events.emit('user.registered', userRegisteredEvent);
  
  return http.response(http.STATUS_CREATED).json({
    data: { id: user.id }
  });
}
```

## Event naming conventions

Use descriptive, hierarchical event names:

```typescript
// ✅ Good - Clear hierarchy and action
'user.registered'
'user.verified'
'order.completed'
'payment.failed'

// ❌ Avoid - Too generic or unclear
'user'
'event'
'update'
```

## Event configuration

Configure which events your subscribers should listen to in `tsc-run.config.ts`:

```typescript
export default {
  provider: 'aws',
  region: 'us-east-1',
  events: {
    eventBus: 'default',
    subscribers: {
      'send-welcome-email': {
        events: ['user.registered', 'user.verified']
      },
      'update-analytics': {
        events: ['user.registered', 'order.completed']
      }
    }
  }
};
```

## Event message structure

Events are delivered to subscribers as `Event<T>` objects:

```typescript
export type Event<T = unknown> = {
  type: string;    // The event name (e.g., 'user.registered')
  data: T;         // The event payload with your custom type
}
```

## Next steps

- Learn about [Subscribers](/docs/subscribers) to handle events
- Check the [events module](/docs/events-api) API reference
- Explore [Configuration](/docs/configuration) for event setup