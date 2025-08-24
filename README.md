# API Response Wrapper

A lightweight, zero-dependency npm package that standardizes API responses across your Node.js projects. Enforce consistent JSON response structures and reduce boilerplate code in your backend routes.

## 📦 Installation

```bash
npm i @techsolu/api-wrapper
```

## 🚀 Quick Start

### Basic Usage

```javascript
import { success, error } from '@techsolu/api-wrapper';

// Success response
const successResponse = success({ id: 1, name: 'John' }, 'User created successfully');

// Error response
const errorResponse = error('User not found', 404, { userId: 123 });
```

### Express Integration

```javascript
import express from 'express';
import { middleware } from '@techsolu/api-wrapper';

const app = express();
app.use(middleware());

app.get('/users', async (req, res) => {
  try {
    const users = await fetchUsersFromDB();
    res.apiSuccess(users, 'Users fetched successfully');
  } catch (err) {
    res.apiError('Failed to fetch users', 500);
  }
});

app.listen(3000);
```

## ✨ Key Benefits

### 1. **Consistent Response Structure**
Eliminate inconsistent response formats across your API endpoints. Every response follows the same predictable structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { "id": 1, "name": "John Doe" }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Resource not found",
  "error": {
    "code": 404,
    "details": { "resourceId": 123 }
  }
}
```

### 2. **Reduced Boilerplate Code**
Stop repeating the same response formatting code in every route handler:

**Before:**
```javascript
app.get('/users', (req, res) => {
  // Inconsistent formatting across different developers
  res.json({ status: 'success', data: users, message: 'OK' });
  // or
  res.json({ ok: true, result: users });
  // or
  res.json(users); // No structure at all
});
```

**After:**
```javascript
app.get('/users', (req, res) => {
  res.apiSuccess(users, 'Users fetched successfully');
});
```

### 3. **Frontend Developer Happiness**
Frontend developers can write consistent response handling logic:

```javascript
// Consistent response handling
const response = await fetch('/api/users');
const data = await response.json();

if (data.success) {
  // Work with data.data
  setUsers(data.data);
} else {
  // Handle error with data.error.code and data.message
  showError(data.message, data.error.code);
}
```

### 4. **Built-in Error Handling**
Standardized error responses with proper HTTP status codes and optional details:

```javascript
// Simple error
res.apiError('Validation failed', 400);

// Error with details
res.apiError('Invalid input', 422, {
  fields: {
    email: 'Must be valid email',
    password: 'Minimum 8 characters'
  }
});
```

### 5. **Framework Agnostic**
Works with Express, Fastify, and any Node.js HTTP server:

**Fastify Integration:**
```javascript
import Fastify from 'fastify';
import { ResponseWrapper } from '@techsolu/api-wrapper';

const fastify = Fastify();
const wrapper = new ResponseWrapper();

wrapper.decorateFastify(fastify);

fastify.get('/users', async (request, reply) => {
  reply.apiSuccess(users, 'Users fetched successfully');
});
```

### 6. **Customizable Configuration**
Configure default messages and error details globally:

```javascript
import { configure } from '@techsolu/api-wrapper';

configure({
  defaultSuccessMessage: 'Request processed successfully',
  defaultErrorMessage: 'An unexpected error occurred',
  includeErrorDetails: process.env.NODE_ENV === 'development'
});
```

### 7. **TypeScript Support**
Full TypeScript support with complete type definitions:

```typescript
import { success, error, ApiResponse } from '@techsolu/api-wrapper';

// Type-safe responses
const response: ApiResponse<User> = success(user, 'User created');

// Type-safe error handling
if (!response.success) {
  console.log(response.error.code); // TypeScript knows this exists
}
```

## 📖 API Reference

### Core Functions

#### `success(data, message?)`
Creates a standardized success response.

```javascript
success({ id: 1 }, 'User created');
// { success: true, message: "User created", data: { id: 1 } }
```

#### `error(message?, code?, details?)`
Creates a standardized error response.

```javascript
error('Not found', 404, { resource: 'user' });
// { success: false, message: "Not found", error: { code: 404, details: { resource: "user" } } }
```

### Middleware

#### `middleware()`
Express middleware that adds `res.apiSuccess()` and `res.apiError()` methods.

```javascript
app.use(middleware());
// Now you can use res.apiSuccess() and res.apiError() in all routes
```

### Configuration

#### `configure(config)`
Update global configuration settings.

```javascript
configure({
  defaultSuccessMessage: 'Success',
  defaultErrorMessage: 'Error',
  includeErrorDetails: true
});
```

## 🛠️ Advanced Usage

### Custom Instance Creation
Create multiple instances with different configurations:

```javascript
import { ResponseWrapper } from '@techsolu/api-wrapper';

const publicApiWrapper = new ResponseWrapper({
  defaultSuccessMessage: 'OK',
  includeErrorDetails: false
});

const internalApiWrapper = new ResponseWrapper({
  defaultSuccessMessage: 'Operation completed',
  includeErrorDetails: true
});
```

### Error Handling Middleware
Standardize error handling across your application:

```javascript
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.apiError('Validation failed', 422, err.details);
  } else if (err instanceof AuthenticationError) {
    res.apiError('Unauthorized', 401);
  } else {
    res.apiError('Internal server error', 500);
  }
});
```

## 🔧 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultSuccessMessage` | string | `'Operation completed successfully'` | Default message for success responses |
| `defaultErrorMessage` | string | `'An error occurred'` | Default message for error responses |
| `includeErrorDetails` | boolean | `false` | Whether to include error details in responses |

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

MIT License - feel free to use this package in your commercial projects.

## 🚀 Performance

- **Zero dependencies** - No additional packages required
- **Lightweight** - Minimal impact on bundle size
- **Fast** - Optimized for performance-critical applications

---

**Start standardizing your API responses today and make your frontend developers (and your future self) much happier!** 🎉
