---
title: Validation with Zod
---

Learn how to validate HTTP requests and event data using Zod schemas in tsc.run applications. {% .lead %}

## Why validation?

Request validation ensures your API endpoints receive correctly formatted data and provides meaningful error messages to clients. tsc.run integrates with [Zod](https://zod.dev) for type-safe validation.

## Basic validation

Use `http.validate()` to validate request data against a Zod schema:

```typescript
import { http } from '@tsc-run/core';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required')
});

export async function POST(request: http.Request) {
  const result = http.validate(userSchema, request.json());
  
  if (!result.success) {
    return http.response(http.STATUS_BAD_REQUEST).json({
      errors: result.errors
    });
  }
  
  const { name, email } = result.data;
  // TypeScript knows the exact types here
}
```

## Validation result

The `http.validate()` function returns a discriminated union:

```typescript
type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; errors: ZodIssue[] };
```

### Success case
When validation succeeds, you get the parsed and typed data:

```typescript
if (result.success) {
  // result.data is fully typed according to your schema
  const user = result.data; // { name: string; email: string }
}
```

### Error case
When validation fails, you get detailed error information:

```typescript
if (!result.success) {
  // result.errors contains ZodIssue[] with validation details
  return http.response(http.STATUS_BAD_REQUEST).json({
    message: 'Validation failed',
    errors: result.errors
  });
}
```

## Common validation patterns

### String validation

```typescript
const schema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long'),
    
  email: z.string()
    .email('Invalid email format'),
    
  phone: z.string()
    .regex(/^\+?[\d\s-()]+$/, 'Invalid phone format')
    .optional(),
    
  website: z.string()
    .url('Invalid URL format')
    .optional()
});
```

### Number validation

```typescript
const schema = z.object({
  age: z.number()
    .int('Age must be a whole number')
    .min(0, 'Age must be positive')
    .max(150, 'Age must be realistic'),
    
  price: z.number()
    .positive('Price must be positive')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
    
  quantity: z.number()
    .int()
    .min(1, 'Quantity must be at least 1')
});
```

### Array validation

```typescript
const schema = z.object({
  tags: z.array(z.string())
    .min(1, 'At least one tag is required')
    .max(10, 'Too many tags'),
    
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().positive()
  })).nonempty('Items list cannot be empty')
});
```

### Date validation

```typescript
const schema = z.object({
  birthDate: z.string()
    .datetime('Invalid date format')
    .refine(
      (date) => new Date(date) < new Date(),
      'Birth date must be in the past'
    ),
    
  appointmentDate: z.string()
    .datetime()
    .refine(
      (date) => new Date(date) > new Date(),
      'Appointment must be in the future'
    )
});
```

## Advanced validation

### Conditional validation

```typescript
const userSchema = z.object({
  type: z.enum(['individual', 'business']),
  name: z.string().min(1),
  email: z.string().email(),
  
  // Required only for business accounts
  companyName: z.string().optional(),
  taxId: z.string().optional()
}).refine(
  (data) => {
    if (data.type === 'business') {
      return data.companyName && data.taxId;
    }
    return true;
  },
  {
    message: 'Company name and tax ID required for business accounts',
    path: ['companyName'] // Attach error to specific field
  }
);
```

### Custom validation

```typescript
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password must contain uppercase letter'
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Password must contain lowercase letter'
  )
  .refine(
    (password) => /\d/.test(password),
    'Password must contain number'
  );

const registerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }
);
```

### Transform validation

```typescript
const schema = z.object({
  email: z.string()
    .email()
    .transform(email => email.toLowerCase()), // Normalize email
    
  price: z.string()
    .transform(str => parseFloat(str))        // Convert string to number
    .pipe(z.number().positive()),             // Then validate as number
    
  tags: z.string()
    .transform(str => str.split(','))         // Convert CSV to array
    .pipe(z.array(z.string().trim()))         // Validate and trim each tag
});
```

## Complete examples

### User registration

```typescript
import { http, events } from '@tsc-run/core';
import { z } from 'zod';
import { v7 as uuidv7 } from 'uuid';

const registerSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long'),
    
  email: z.string()
    .email('Invalid email address')
    .transform(email => email.toLowerCase()),
    
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),
    
  age: z.number()
    .int('Age must be a whole number')
    .min(13, 'Must be at least 13 years old')
    .max(120, 'Invalid age')
    .optional(),
    
  terms: z.boolean()
    .refine(val => val === true, 'Must accept terms and conditions')
});

type RegisterData = z.infer<typeof registerSchema>;

export async function POST(request: http.Request) {
  // Validate request body
  const result = http.validate<RegisterData>(registerSchema, request.json());
  
  if (!result.success) {
    return http.response(http.STATUS_BAD_REQUEST).json({
      message: 'Validation failed',
      errors: result.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }
  
  const { name, email, password, age } = result.data;
  
  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return http.response(http.STATUS_CONFLICT).json({
      message: 'User with this email already exists'
    });
  }
  
  // Create user
  const user = {
    id: uuidv7(),
    name,
    email,
    age,
    createdAt: new Date().toISOString()
  };
  
  await saveUser(user);
  await events.dispatch('user.registered', user);
  
  return http.response(http.STATUS_CREATED).json({
    data: { id: user.id }
  });
}
```

### Order creation

```typescript
const orderItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number()
    .int('Quantity must be whole number')
    .min(1, 'Quantity must be at least 1')
    .max(99, 'Maximum quantity is 99')
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema)
    .min(1, 'Order must contain at least one item')
    .max(20, 'Maximum 20 items per order'),
    
  shippingAddress: z.object({
    street: z.string().min(1, 'Street address required'),
    city: z.string().min(1, 'City required'),
    postalCode: z.string()
      .regex(/^\d{5}(-\d{4})?$/, 'Invalid postal code'),
    country: z.string().length(2, 'Country must be 2-letter code')
  }),
  
  couponCode: z.string()
    .regex(/^[A-Z0-9]{6,12}$/, 'Invalid coupon format')
    .optional()
});

export async function POST(request: http.Request) {
  const result = http.validate(createOrderSchema, request.json());
  
  if (!result.success) {
    return http.response(http.STATUS_BAD_REQUEST).json({
      errors: result.errors
    });
  }
  
  const orderData = result.data;
  
  // Validate products exist and calculate total
  const validatedItems = await validateOrderItems(orderData.items);
  const total = calculateOrderTotal(validatedItems);
  
  const order = {
    id: uuidv7(),
    ...orderData,
    items: validatedItems,
    total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  await saveOrder(order);
  await events.dispatch('order.created', order);
  
  return http.response(http.STATUS_CREATED).json({
    data: { id: order.id, total }
  });
}
```

## Error formatting

Format validation errors for better client experience:

```typescript
function formatValidationErrors(errors: ZodIssue[]) {
  return errors.map(error => {
    const field = error.path.join('.');
    return {
      field,
      message: error.message,
      code: error.code
    };
  });
}

// Usage
if (!result.success) {
  return http.response(http.STATUS_BAD_REQUEST).json({
    message: 'Validation failed',
    errors: formatValidationErrors(result.errors)
  });
}
```

## Event data validation

Validate event data in subscribers:

```typescript
import { events } from '@tsc-run/core';
import { z } from 'zod';

const userRegisteredSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  registeredAt: z.string().datetime()
});

export async function handler(message: events.Message) {
  if (message.type !== 'user.registered') {
    return;
  }
  
  const result = userRegisteredSchema.safeParse(message.data);
  
  if (!result.success) {
    console.error('Invalid event data:', result.error);
    return; // Skip processing invalid events
  }
  
  const userData = result.data;
  await processUserRegistration(userData);
}
```

## Best practices

### 1. Create reusable schemas

```typescript
// schemas/common.ts
export const emailSchema = z.string().email().transform(e => e.toLowerCase());
export const idSchema = z.string().uuid();
export const timestampSchema = z.string().datetime();

// schemas/user.ts
import { emailSchema, idSchema, timestampSchema } from './common.js';

export const userSchema = z.object({
  id: idSchema,
  email: emailSchema,
  name: z.string().min(1).max(100),
  createdAt: timestampSchema
});
```

### 2. Validate early

```typescript
export async function POST(request: http.Request) {
  // Validate immediately at the start of handlers
  const result = http.validate(schema, request.json());
  if (!result.success) {
    return http.response(http.STATUS_BAD_REQUEST).json({
      errors: result.errors
    });
  }
  
  // Continue with validated data
  const data = result.data;
}
```

### 3. Use discriminated unions

```typescript
const notificationSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('email'),
    email: z.string().email(),
    subject: z.string(),
    body: z.string()
  }),
  z.object({
    type: z.literal('sms'),
    phone: z.string(),
    message: z.string().max(160)
  }),
  z.object({
    type: z.literal('push'),
    deviceId: z.string(),
    title: z.string(),
    body: z.string()
  })
]);
```

### 4. Type inference

```typescript
// Infer TypeScript types from schemas
type User = z.infer<typeof userSchema>;
type CreateOrderData = z.infer<typeof createOrderSchema>;
type NotificationData = z.infer<typeof notificationSchema>;

// Use inferred types in your functions
async function createUser(data: User): Promise<void> {
  // Implementation
}
```

---

## Next steps

- Learn about [API & Routing](/docs/api-routing) for request handling
- Explore [Events](/docs/events) for event data validation
- Check the [http module](/docs/http) API reference