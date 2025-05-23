---
title: Using the CLI
---

Learn how to use the tsc.run CLI tools to build, develop, and deploy your applications.

## Installation

Install the tsc.run CLI globally or as a project dependency:

```bash
# Global installation
npm install -g @tsc-run/cli

# Project dependency
npm install --save-dev @tsc-run/cli
yarn add --dev @tsc-run/cli
```

## Available commands

The tsc.run CLI provides the following commands:

### tsc-run build

Compiles your TypeScript code and prepares it for deployment:

```bash
tsc-run build
```

This command:
- Compiles TypeScript files to JavaScript
- Validates your configuration
- Generates deployment artifacts
- Creates optimized bundles for cloud functions

### tsc-run deploy

Deploys your application to the configured cloud provider:

```bash
tsc-run deploy
```

This command:
- Runs the build process
- Creates cloud resources (Lambda functions, EventBridge, etc.)
- Deploys your code to the cloud
- Sets up event routing and subscriptions

## Project scripts

Set up common npm scripts in your `package.json`:

```json
{
  "scripts": {
    "build": "tsc-run build",
    "deploy": "tsc-run deploy",
    "dev": "tsc --watch",
    "clean": "rm -rf dist",
    "lint": "eslint . --ext .ts",
    "type-check": "tsc --noEmit"
  }
}
```

## Development workflow

Here's a typical development workflow:

### 1. Install dependencies
```bash
npm install
```

### 2. Start TypeScript compilation in watch mode
```bash
npm run dev
# or
tsc --watch
```

### 3. Make your changes
Edit your route handlers, event subscribers, and configuration.

### 4. Build for deployment
```bash
npm run build
# or
tsc-run build
```

### 5. Deploy to cloud
```bash
npm run deploy
# or
tsc-run deploy
```

## Build output

The build process creates a `dist/` directory with compiled JavaScript:

```md
dist/
├── functions/
│   ├── api/
│   │   └── users/
│   │       └── register.js
│   └── subscribers/
│       └── send-welcome-email.js
├── config/
│   └── tsc-run.config.js
└── manifest.json
```

## Next steps

- Learn about [AWS deployment](/docs/deploy-aws) specifics
- Explore [Configuration](/docs/configuration) options
- Check out [API & Routing](/docs/api-routing) for building endpoints