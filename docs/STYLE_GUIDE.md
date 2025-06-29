# ThinkRED Style Guide

## Overview

This style guide establishes coding standards and best practices for the ThinkRED Technologies website project.
Following these guidelines ensures consistency, maintainability, and high code quality across the entire codebase.

## Code Formatting

### General Principles

- **Consistency**: Follow established patterns throughout the codebase
- **Readability**: Code should be self-documenting and easy to understand
- **Maintainability**: Write code that is easy to modify and extend
- **Performance**: Consider performance implications of coding decisions

### Automated Formatting

We use automated tools to enforce consistent formatting:

- **Prettier**: For code formatting
- **ESLint**: For code quality and style enforcement
- **TypeScript**: For type safety and modern JavaScript features

## Frontend Guidelines

### TypeScript/JavaScript

#### Naming Conventions

```typescript
// Use PascalCase for components, types, and interfaces
interface UserProfile {
  firstName: string;
  lastName: string;
}

// Use camelCase for variables, functions, and methods
const userName = 'john_doe';
const getUserProfile = () => {...};

// Use UPPER_SNAKE_CASE for constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// Use kebab-case for file names
// user-profile.tsx
// api-utils.ts
// contact-form.component.tsx
```

#### Function Declaration

```typescript
// Prefer arrow functions for simple operations
const calculateTotal = (items: Item[]) => items.reduce((sum, item) => sum + item.price, 0);

// Use function declarations for complex operations
function processFormSubmission(formData: FormData): Promise<SubmissionResult> {
  // Complex logic here
  return submitData(formData);
}

// Use async/await instead of promises when possible
async function fetchUserData(userId: string): Promise<User> {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
}
```

#### Type Definitions

```typescript
// Define interfaces for all object structures
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  company?: string; // Optional fields marked with ?
}

// Use union types for enums
type ProjectType = 'web' | 'mobile' | 'desktop' | 'api';

// Use generic types when appropriate
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

#### Import/Export Guidelines

```typescript
// Use named imports when possible
import { useState, useEffect } from 'react';
import { validateEmail, sanitizeInput } from '../utils/validation';

// Group imports by type
// 1. External libraries
import React from 'react';
import { Router } from 'react-router-dom';

// 2. Internal utilities and hooks
import { useApi } from '../hooks/useApi';
import { formatDate } from '../utils/dateUtils';

// 3. Components
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

// 4. Types
import type { User, ApiResponse } from '../types';
```

### React Components

#### Component Structure

```tsx
// File: UserProfile.tsx
import React, { useState, useEffect } from 'react';
import type { User } from '../types';

interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await getUserById(userId);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading user profile...</div>;
  }

  if (!user) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="user-profile">
      <h2 className="user-profile__name">{user.name}</h2>
      <p className="user-profile__email">{user.email}</p>
    </div>
  );
};
```

#### Component Guidelines

- Use functional components with hooks
- Define props interface above the component
- Use TypeScript for all props and state
- Handle loading and error states
- Use meaningful class names (BEM methodology)

### CSS/Tailwind Guidelines

#### Tailwind CSS Usage

```tsx
// Good: Logical grouping and readable classes
<div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
    Action
  </button>
</div>

// Avoid: Too many classes on one line
<div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
```

#### Custom CSS Classes

```css
/* Use BEM methodology for custom classes */
.contact-form {
  /* Block */
}

.contact-form__field {
  /* Element */
}

.contact-form__field--error {
  /* Modifier */
}

/* Use CSS custom properties for theme values */
:root {
  --primary-color: #e4093e;
  --secondary-color: #1a1a1a;
  --accent-color: #f97316;
}
```

## Backend Guidelines

### Google Apps Script

#### Function Structure

```javascript
/**
 * Processes form submission data
 * @param {Object} formData - The form data to process
 * @returns {Object} Processing result
 */
function processFormSubmission(formData) {
  try {
    // Validate input data
    if (!formData || !formData.email) {
      throw new Error('Invalid form data');
    }

    // Process the data
    const result = {
      success: true,
      message: 'Form processed successfully',
      timestamp: new Date().toISOString(),
    };

    return result;
  } catch (error) {
    Logger.log('Error processing form: ' + error.toString());
    throw error;
  }
}
```

#### Error Handling

```javascript
function handleFormSubmission(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const result = processFormData(data);
    return createSuccessResponse(result);
  } catch (error) {
    Logger.log('Form submission error: ' + error.toString());
    return createErrorResponse(error.message);
  }
}

function createErrorResponse(message) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}
```

## Documentation Standards

### Code Comments

```typescript
/**
 * Validates and submits contact form data
 * @param formData - The form data to submit
 * @returns Promise that resolves to submission result
 * @throws Error if validation fails or submission is rejected
 */
async function submitContactForm(formData: ContactFormData): Promise<SubmissionResult> {
  // Validate required fields
  if (!formData.email || !formData.name) {
    throw new Error('Name and email are required');
  }

  // Sanitize input data
  const sanitizedData = sanitizeFormData(formData);

  // Submit to backend
  return await apiClient.post('/contact', sanitizedData);
}

// Single-line comments for complex logic
const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // RFC 5322 basic validation
```

### README Documentation

Each component or utility should include:

- Purpose and functionality
- Usage examples
- API documentation
- Dependencies and requirements

## Testing Standards

### Unit Tests

```typescript
// File: validation.test.ts
import { validateEmail, validatePhone } from '../validation';

describe('Email Validation', () => {
  test('should validate correct email formats', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.email+tag@domain.co.uk')).toBe(true);
  });

  test('should reject invalid email formats', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
  });
});
```

### Integration Tests

```typescript
// File: contactForm.integration.test.ts
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ContactForm } from '../ContactForm';

describe('Contact Form Integration', () => {
  test('should submit form successfully', async () => {
    const { getByLabelText, getByText } = render(<ContactForm />);

    fireEvent.change(getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.click(getByText(/submit/i));

    await waitFor(() => {
      expect(getByText(/success/i)).toBeInTheDocument();
    });
  });
});
```

## Security Guidelines

### Input Validation

```typescript
// Always validate and sanitize user input
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>]/g, ''); // Remove HTML brackets
}

// Validate data types and ranges
function validateAge(age: number): boolean {
  return Number.isInteger(age) && age >= 0 && age <= 150;
}
```

### API Security

```typescript
// Use environment variables for sensitive data
const API_URL = process.env.VITE_API_URL || 'fallback-url';

// Implement proper error handling without exposing internal details
try {
  const result = await apiCall();
  return result;
} catch (error) {
  // Log detailed error for debugging
  console.error('API call failed:', error);
  // Return generic error message to user
  throw new Error('Service temporarily unavailable');
}
```

## Performance Guidelines

### Code Optimization

```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <div>{/* expensive rendering */}</div>;
});

// Implement proper loading states
const [data, setData] = useState<Data | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Use useCallback for event handlers in useEffect dependencies
const handleSubmit = useCallback(async (formData: FormData) => {
  try {
    await submitForm(formData);
  } catch (error) {
    setError(error.message);
  }
}, []);
```

### Bundle Optimization

```typescript
// Use dynamic imports for code splitting
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Implement proper loading boundaries
<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>;
```

## File Organization

### Directory Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── features/     # Feature-specific components
│   └── layout/       # Layout components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── config/           # Configuration files
└── assets/           # Static assets
```

### File Naming

- Use `kebab-case` for file names
- Add appropriate suffixes for file types
- Use descriptive names that indicate purpose

```
contact-form.component.tsx
api-client.util.ts
user-profile.hook.ts
form-validation.types.ts
```

## Git Workflow

### Commit Messages

```bash
# Format: type(scope): description

feat(contact): add form validation
fix(api): resolve CORS issues
docs(readme): update setup instructions
style(components): fix formatting
refactor(utils): simplify validation logic
test(forms): add integration tests
chore(deps): update dependencies
```

### Branch Naming

```bash
feature/contact-form-validation
bugfix/api-cors-issue
hotfix/security-vulnerability
docs/setup-guide-update
```

---

Following these guidelines ensures our codebase remains clean, maintainable, and scalable.
For questions or clarifications, please refer to the [FAQ](./FAQ.md) or create an issue.