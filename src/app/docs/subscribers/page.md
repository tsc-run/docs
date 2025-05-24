---
title: Subscribers
---

Learn how to create event subscribers that process events asynchronously in tsc.run. {% .lead %}

## What are subscribers?

Subscribers are functions that automatically execute when specific events are dispatched. They enable asynchronous processing of business logic without blocking your API responses.

## Creating a subscriber

Create a subscriber by exporting a `listen` function from a file in your `functions/subscribers/` directory:

```typescript
// functions/subscribers/send-welcome-email.ts
import { events } from '@tsc-run/core';
import type { UserRegisteredEvent } from '../../events/user-registered.js';

export async function listen(event: events.Event<UserRegisteredEvent>) {
    const { type, data } = event;

    console.log(`Processing ${type} event for user:`, data.id);

    // Send welcome email logic
    await sendWelcomeEmail(data.email, data.name);

    console.log(`Welcome email sent to ${data.email}`);
}

async function sendWelcomeEmail(email: string, name: string) {
    // Email sending implementation
}
```

## Event structure

Subscribers receive events as `Event<T>` objects:

```typescript
export type Event<T = unknown> = {
  type: string;    // Event name (e.g., 'user.registered')
  data: T;         // Event payload with your type
}

// Example usage
export async function handler(event: events.Event<UserRegisteredEvent>) {
  // Access event type
  console.log('Event type:', event.type);
  
  // Access typed event data
  const user = event.data; // TypeScript knows this is UserRegisteredEvent
  console.log('User ID:', user.id);
  console.log('User name:', user.name);
}
```

## Configuration

Configure which events each subscriber should handle in `tsc-run.config.ts`:

```typescript
export default {
  provider: 'aws',
  events: {
    eventBus: 'default',
    subscribers: {
      'send-welcome-email': {
        events: ['user.registered', 'user.verified']
      },
      'increment-registered-users': {
        events: ['user.registered']
      },
      'update-analytics': {
        events: ['user.registered', 'order.completed', 'payment.succeeded']
      }
    }
  }
};
```

## Multiple event types

Handle multiple event types in a single subscriber:

```typescript
// functions/subscribers/user-analytics.ts
import {events} from '@tsc-run/core';
import type {UserRegisteredEvent} from '../../events/user-registered.js';
import type {UserVerifiedEvent} from '../../events/user-verified.js';

export async function handler(event: events.Event) {
    switch (event.type) {
        case 'user.registered':
            await handleUserRegistered(event.data as UserRegisteredEvent);
            break;

        case 'user.verified':
            await handleUserVerified(event.data as UserVerifiedEvent);
            break;

        default:
            console.log('Unknown event type:', event.type);
    }
}

async function handleUserRegistered(data: UserRegisteredEvent) {
    // Track new user registration
    await analytics.track('user_registered', {
        userId: data.id,
        registrationDate: data.registeredAt
    });
}

async function handleUserVerified(data: UserVerifiedEvent) {
    // Track user verification
    await analytics.track('user_verified', {
        userId: data.id,
        verificationDate: data.verifiedAt
    });
}
```

## Next steps

- Learn about [Events](/docs/events) to understand event dispatching
- Check the [events module](/docs/events-api) API reference
- Explore [Configuration](/docs/configuration) for subscriber setup