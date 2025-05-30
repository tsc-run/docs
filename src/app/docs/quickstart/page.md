---
title: Quick Start
---

## Install the CLI

```bash
npm install -g @tsc-run/cli
```

## Create a new Project

```bash
tsc-run new my-project
```

## Build & Deploy

If you have an AWS account, you can deploy your project, just ensure you have the AWS CLI configured with your credentials and the below environment variables set `CDK_DEFAULT_ACCOUNT` and `CDK_DEFAULT_REGION`.

```bash
tsc-run build && tsc-run deploy
```

{% callout type="note" title="Cloud Providers (AWS)" %}
We currently support AWS, with additional cloud providers coming soon.
{% /callout %}