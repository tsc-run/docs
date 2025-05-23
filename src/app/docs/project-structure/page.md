---
title: Project structure
---

When you create a new project with `tsc.run`, the framework expects a clear and simple directory layout. This
convention-over-configuration approach allows the CLI to automatically discover routes, jobs, and event subscribers.

Here's what a typical `tsc.run` project looks like:

```bash
my-app/
├── events/                  # Custom event type definitions
│   └── user-registered.ts   # Defines the shape of a custom event
├── functions/               # Functions are auto-discovered and deployed
│   ├── api/                 # REST API routes (e.g. GET /users)
│   │   └── users/
│   │       └── list-users.ts
│   └── jobs/                # Background jobs
│       └── welcome-user.ts
├── lib/                     # Your own internal utility code
├── models/                  # Shared types and interfaces
│   └── user.ts
├── package.json
├── tsconfig.json
├── tsc-run.config.js        Customise provider, region and high level resources
└── README.md
```

---

## Key folders

### functions/api/

All HTTP handlers live here. The folder structure defines your route paths automatically:

```ts
// functions/api/users/list-users.ts
export async function GET() {
    return http.response().json({message: 'All users'});
}
```

* `GET`, `POST`, `PUT`, `DELETE` - each exported function maps to the HTTP method.
* Folder structure defines the path: `users/list-users.ts` -> `GET /users`

---

### functions/jobs/

Job files are discovered automatically. Each file should export a `run()` function.

```ts
// functions/jobs/welcome-user.ts
export async function run({userId}: { userId: string }) {
    // Background logic here
}
```

Trigger them using:

```ts
await jobs.dispatch("welcome-user", {userId});
```

---

### events/

The `events/` directory is where you define custom event types that your application emits or listens to. This helps
maintain type safety and clarity across your codebase.

```ts
// events/user-registered.ts
export type UserRegisteredEvent = {
    id: string;
    name: string;
};
```

Emit events from anywhere using:

```ts
await events.emit("user-registered", {id, name});
```

---

### lib/, models/

These are optional folders for organising shared logic, types or helpers.

---

## Customisation

You can fine-tune behaviour using `tsc-run.config.js`. This config supports providers, regions, custom resources, and
event subscriber wiring.

```ts
// tsc-run.config.js
export default {
    provider: 'aws',
    region: 'eu-west-2',
    resources: {
        database: true,
        cache: true,
    },
    events: {
        eventBus: 'default',
        subscribers: {
            'create-team': {
                events: ['user-registered']
            }
        }
    }
};
```

Read the [configuration guide](/docs/configuration) for more details.
