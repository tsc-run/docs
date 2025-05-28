---
title: Configuration
---

Learn how to configure your tsc.run application for different environments and cloud providers. {% .lead %}

## Configuration file

tsc.run uses a configuration file to define your application settings. Create a `tsc-run.config.ts` or
`tsc-run.config.js` file in your project root.

## Basic configuration

```typescript
// tsc-run.config.ts
export default {
    projectName: 'my-app',
    provider: 'aws' as const,
    region: 'us-east-1',
    environment: 'dev',
};
```

## Configuration options

{% callout type="note" title="New" %}
`build` available from 0.4.0-alpha.1.
{% /callout %}

| Option        | Type     | Required | Default | Description                             |
|---------------|----------|----------|---------|-----------------------------------------|
| `projectName` | `string` | Yes      | -       | Name of the project                     |
| `provider`    | `'aws'`  | Yes      | -       | Cloud provider (currently AWS only)     |
| `region`      | `string` | No       | -       | Region for deployment                   |
| `environment` | `string` | No       | `'dev'` | Deployment environment                  |
| `domain`      | `object` | No       | -       | Domain configuration                    |
| `networking`  | `object` | No       | -       | Network configuration for NAT gateways  |
| `events`      | `object` | No       | -       | Event configuration for subscribers     |
| `build`       | `object` | No       | -       | Build configuration for the application |

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

| Option                     | Type       | Description                                    |
|----------------------------|------------|------------------------------------------------|
| `eventBus`                 | `string`   | AWS EventBridge bus name                       |
| `subscribers`              | `object`   | Map of subscriber names to their configuration |
| `subscribers[name].events` | `string[]` | Array of event names this subscriber handles   |

## Domain configuration

Configure custom domains for your application:

```typescript
export default {
    projectName: 'my-app',
    provider: 'aws',
    region: 'us-east-1',
    domain: {
        name: 'api.example.com',
        type: 'subdomain', // 'subdomain' | 'hosted-zone' | 'external'
        certificate: {
            create: true // or { arn: 'arn:aws:acm:us-east-1:123456789012:certificate/...' }
        }
    }
};
```

### Domain configuration options

| Option                      | Type                                         | Default            | Description                         |
|-----------------------------|----------------------------------------------|--------------------|-------------------------------------|
| `domain.name`               | `string`                                     | -                  | Domain name for the application     |
| `domain.type`               | `'subdomain' \| 'hosted-zone' \| 'external'` | `'subdomain'`      | Type of domain configuration        |
| `domain.certificate`        | `object`                                     | `{ create: true }` | SSL certificate configuration       |
| `domain.certificate.create` | `boolean`                                    | -                  | Whether to create a new certificate |
| `domain.certificate.arn`    | `string`                                     | -                  | ARN of existing certificate to use  |

## Networking configuration

Configure NAT gateways for outbound internet access:

```typescript
export default {
    projectName: 'my-app',
    provider: 'aws',
    region: 'us-east-1',
    networking: {
        natGateways: 1 // 0-3
    }
};
```

### Networking configuration options

| Option                   | Type     | Default | Description                  |
|--------------------------|----------|---------|------------------------------|
| `networking.natGateways` | `number` | `0`     | Number of NAT gateways (0-3) |

**NAT Gateway options:**

- `0` - No egress internet access
- `1` - Cost-effective single NAT gateway
- `2-3` - High availability with multiple NAT gateways

## Build configuration

Configure build settings for your application:

```typescript
export default {
    projectName: 'my-app',
    provider: 'aws',
    region: 'us-east-1',
    build: {
        exclude: [
            'mysql2'
        ]
    }
};
```

### Build configuration options

| Option          | Type    | Default                                                                     | Description                     |
|-----------------|---------|-----------------------------------------------------------------------------|---------------------------------|
| `build.exclude` | `array` | `['aws-sdk', 'path', 'os', 'crypto', 'util', 'events', 'stream', 'buffer']` | An array of modules to exlcude. |

## Complete configuration example

Here's a comprehensive configuration example with all available options:

```typescript
// tsc-run.config.ts
export default {
    projectName: 'my-production-app',
    provider: 'aws' as const,
    region: 'us-east-1',
    environment: 'production',

    domain: {
        name: 'api.example.com',
        type: 'hosted-zone',
        certificate: {
            create: true
        }
    },

    networking: {
        natGateways: 2
    },

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
    },
};
```

## Next steps

- Learn about [CLI commands](/docs/cli) to build and deploy
- Explore [AWS deployment](/docs/deploy-aws) for production setup
- Check the [Framework API](/docs/http) for implementation details