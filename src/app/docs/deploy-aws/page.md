---
title: Deploy to AWS
---

Learn how to deploy your tsc.run applications to Amazon Web Services (AWS). {% .lead %}

## Prerequisites

Before deploying to AWS, ensure you have:

1. **AWS account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **tsc.run CLI** installed in your project

## AWS setup

### Install AWS CLI

```bash
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Windows
# Download from https://aws.amazon.com/cli/
```

### Configure credentials

For local development:

```bash
# Configure with your AWS credentials
aws configure

# Or set environment variables
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_DEFAULT_REGION=us-east-1
```

For GitHub Actions deployment, OIDC authentication is recommended over access keys for security. While you can use
access keys, OIDC provides more secure, temporary credentials without storing long-lived secrets.

**Learn more:**

- [AWS Access Keys documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)
- [AWS OIDC documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)

### Verify configuration

```bash
# Test AWS access
aws sts get-caller-identity
```

## Deployment configuration

Configure your application for AWS deployment:

```typescript
// tsc-run.config.js
export default {
    provider: 'aws',
    region: 'eu-west-2',
};
```

## Deployment process

### 1. Set required environment variables

tsc.run uses AWS CDK under the hood and requires these environment variables:

```bash
export CDK_DEFAULT_ACCOUNT=123456789012  # Your AWS account ID
export CDK_DEFAULT_REGION=us-east-1      # Your preferred region
```

### 2. Build your application

```bash
tsc-run build
```

This creates optimised JavaScript bundles in the `dist/` directory.

### 3. Deploy to AWS

```bash
tsc-run deploy
```

On first deployment, this will bootstrap your AWS account for CDK usage.

The deployment process:

1. **Bootstraps CDK** (first deployment only)
2. **Creates Lambda functions** for your API routes and subscribers.
3. **Sets up EventBridge** for event routing.
4. **Configures API Gateway** for HTTP routing.
5. **Creates IAM roles** with appropriate permissions.
6. **Sets up CloudWatch** for logging.

### 3. Get your API URL

After deployment, you'll receive your API Gateway URL:

```bash
Deployment successful!
API URL: https://abc123.execute-api.us-east-1.amazonaws.com/prod
```

## Next steps

- Learn about [Configuration](/docs/configuration) options
- Explore [Framework API](/docs/http) for implementation
- Check [Validation](/docs/validation) for request handling