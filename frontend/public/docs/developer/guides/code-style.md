# Code Style Guide

## Overview

This document outlines the coding standards and style guidelines for ThinkRED
projects. Consistent code style improves readability, maintainability, and team
collaboration.

## General Principles

- **Consistency**: Follow established patterns throughout the codebase
- **Readability**: Write code that is easy to understand and maintain
- **Simplicity**: Prefer simple, clear solutions over complex implementations
- **Documentation**: Comment complex logic and provide clear documentation

## TypeScript & JavaScript

### Naming Conventions

Use camelCase for variables and functions:

```typescript
const userName = 'john_doe';
const isAuthenticated = true;

function getUserProfile(userId: string): UserProfile {
  // Implementation
}
```

Use PascalCase for classes and interfaces:

```typescript
class UserService {
  // Implementation
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}
```

Use SCREAMING_SNAKE_CASE for constants:

```typescript
const API_BASE_URL = 'https://api.thinkred.tech';
const MAX_RETRY_ATTEMPTS = 3;
```

### Code Formatting

- Use 2 spaces for indentation
- Maximum 80 characters per line
- Always use semicolons
- Use double quotes for strings

```typescript
const message = "Welcome to ThinkRED";
const greeting = `Hello, ${userName}!`;
```

### Functions

Prefer arrow functions for utilities:

```typescript
const calculateTotal = (price: number, tax: number): number => price + tax;
```

Use async/await for asynchronous operations:

```typescript
async function fetchUserData(userId: string): Promise<UserData> {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user data', error);
    throw error;
  }
}
```

## React Components

### Component Structure

Use functional components with TypeScript:

```tsx
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <button onClick={() => onEdit(user)}>Edit</button>
    </div>
  );
};
```

### JSX Guidelines

Format elements clearly:

```tsx
<Button onClick={handleClick}>Submit</Button>

<UserForm
  user={user}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isLoading={isLoading}
/>
```

Use proper conditional rendering:

```tsx
{isLoading && <Spinner />}
{user ? <UserProfile user={user} /> : <LoginForm />}
```

## CSS & Styling

### Tailwind CSS

Group classes logically:

```tsx
<div className="
  flex items-center justify-between
  p-4 rounded-lg
  bg-white shadow-md
  hover:shadow-lg transition-shadow
">
```

Use responsive design:

```tsx
<div className="w-full md:w-1/2 lg:w-1/3 p-2 md:p-4">
```

## Testing

### Test Structure

Write clear, descriptive tests:

```typescript
describe('UserService', () => {
  it('should return user profile for valid ID', async () => {
    // Arrange
    const userId = 'user-123';
    const expectedUser = { id: userId, name: 'John Doe' };
    
    // Act
    const result = await userService.getUserProfile(userId);
    
    // Assert
    expect(result).toEqual(expectedUser);
  });
});
```

## Documentation

### JSDoc Comments

Document functions with JSDoc:

```typescript
/**
 * Calculates the total price including tax
 * @param price - The base price
 * @param taxRate - The tax rate as decimal (e.g., 0.1 for 10%)
 * @returns The total price including tax
 */
function calculateTotalPrice(price: number, taxRate: number): number {
  return price * (1 + taxRate);
}
```

### Inline Comments

Explain complex business logic:

```typescript
// Only admins or managers from the same department can edit
if (user.role === 'admin' || 
    (user.role === 'manager' && user.department === currentDepartment)) {
  allowEdit = true;
}
```

## Git Conventions

### Commit Messages

Use conventional commit format:

```text
type(scope): description

feat(auth): add JWT token refresh functionality
fix(ui): resolve button alignment issue on mobile
docs(api): update authentication endpoint documentation
```

### Branch Naming

Use descriptive branch names:

```text
feature/user-authentication
bugfix/login-redirect-issue
hotfix/security-vulnerability
docs/api-documentation-update
```

## Tools & Configuration

### ESLint

Configure ESLint for TypeScript:

```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier

Standard formatting configuration:

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2
}
```

## Performance

### React Optimization

Use React.memo for expensive components:

```tsx
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Complex rendering */}</div>;
});
```

Use dynamic imports for code splitting:

```typescript
const LazyComponent = React.lazy(() => import('./LazyComponent'));
```

## Accessibility

### ARIA Labels

Provide accessible labels:

```tsx
<button
  aria-label="Close dialog"
  onClick={handleClose}
>
  ×
</button>
```

### Semantic HTML

Use semantic elements:

```tsx
<main>
  <section>
    <h1>Page Title</h1>
    <article>
      <h2>Article Title</h2>
    </article>
  </section>
</main>
```

## Related Documentation

- [Contributing Guide](contributing.md)
- [Development Setup](../setup/installation.md)
- [API Documentation](../apis/backend-apis.md)
- [Testing Guidelines](../../operations/testing/README.md)
