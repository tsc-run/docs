---
title: Configuration
---

Learn how to configure your tsc.run application for different environments and cloud providers. {% .lead %}

## Configuration file

tsc.run uses a configuration file to define your application settings. Create a `tsc-run.config.ts` or `tsc-run.config.js` file in your project root.

## Basic configuration

```typescript
// tsc-run.config.ts
export default {
  provider: 'aws' as const,
  region: 'us-east-1',
};
```

## Configuration options

| Option | Type | Description |
| --- | --- | --- |
| `provider` | `'aws'` | Cloud provider (currently AWS only) |
| `region` | `string` | AWS region for deployment |
| `events` | `object` | Event configuration for subscribers |
| `resources` | `object` | Cloud resources like databases |

## Event configuration

Configure event handling and subscribers:

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
            'increment-registered-users': {
                events: ['user.registered']
            },
            'update-analytics': {
                events: ['user.registered', 'order.completed']
            }
        }
    }
};
```

### Event configuration options

| Option | Type | Description |
| --- | --- | --- |
| `eventBus` | `string` | AWS EventBridge bus name |
| `subscribers` | `object` | Map of subscriber names to their configuration |
| `subscribers[name].events` | `string[]` | Array of event names this subscriber handles |

## Next steps

- Learn about [CLI commands](/docs/cli) to build and deploy
- Explore [AWS deployment](/docs/deploy-aws) for production setup
- Check the [Framework API](/docs/http) for implementation details