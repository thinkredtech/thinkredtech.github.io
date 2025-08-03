# Testing Guidelines

## Overview

This document outlines the testing strategies, tools, and best practices for
the ThinkRED platform. Comprehensive testing ensures reliability, performance,
and user satisfaction.

## Testing Strategy

### Testing Pyramid

**Unit Tests (Foundation):**
- Test individual functions and components in isolation
- Fast execution and quick feedback
- High coverage of business logic
- Mock external dependencies

**Integration Tests (Middle):**
- Test component interactions and API integrations
- Verify data flow between systems
- Database and external service interactions
- End-to-end user workflows

**End-to-End Tests (Top):**
- Test complete user journeys
- Browser automation testing
- Cross-browser compatibility
- Performance under real conditions

## Testing Types

### Frontend Testing

**Component Testing:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  };

  it('should display user information', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should handle edit button click', () => {
    const mockOnEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

**Hook Testing:**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### Backend Testing

**API Testing:**
```typescript
import request from 'supertest';
import { app } from '../app';

describe('User API', () => {
  it('should create a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);

    expect(response.body).toMatchObject(userData);
    expect(response.body.id).toBeDefined();
  });
});
```

**Google Apps Script Testing:**
```javascript
function testUserCreation() {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com'
  };
  
  const result = createUser(testUser);
  
  console.assert(result.success === true, 'User creation should succeed');
  console.assert(result.user.id !== undefined, 'User should have an ID');
}
```

### Performance Testing

**Load Testing:**
- Simulate normal user load
- Test peak traffic scenarios
- Monitor response times and error rates
- Identify performance bottlenecks

**Stress Testing:**
- Test beyond normal capacity
- Find breaking points
- Validate error handling under load
- Test recovery mechanisms

**Tools:**
- **Lighthouse**: Web performance auditing
- **WebPageTest**: Detailed performance analysis
- **K6**: API load testing
- **Artillery**: Stress testing

### Security Testing

**Authentication Testing:**
- Test login/logout functionality
- Verify session management
- Test password policies
- Validate access controls

**Authorization Testing:**
- Test role-based permissions
- Verify data access restrictions
- Test API endpoint security
- Validate CORS policies

**Data Security:**
- Test input validation
- Verify data encryption
- Test against injection attacks
- Validate secure data transmission

## Testing Tools

### Frontend Testing Stack

**Jest**: JavaScript testing framework
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**React Testing Library**: Component testing utilities
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
```

**MSW (Mock Service Worker)**: API mocking
```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json({ users: [] }));
  })
);
```

### E2E Testing

**Playwright**: Cross-browser testing
```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'password');
  await page.click('[data-testid="login-button"]');
  
  await expect(page).toHaveURL('/dashboard');
});
```

**Cypress**: Alternative E2E testing
```typescript
describe('Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('password');
    cy.get('[data-testid="login-button"]').click();
    
    cy.url().should('include', '/dashboard');
  });
});
```

## Test Organization

### Directory Structure

```text
src/
  components/
    UserCard/
      UserCard.tsx
      UserCard.test.tsx
      UserCard.stories.tsx
  hooks/
    useCounter/
      useCounter.ts
      useCounter.test.ts
  utils/
    helpers/
      helpers.ts
      helpers.test.ts
tests/
  e2e/
    login.spec.ts
    dashboard.spec.ts
  integration/
    api.test.ts
    database.test.ts
```

### Naming Conventions

- Unit tests: `Component.test.tsx`
- Integration tests: `feature.integration.test.ts`
- E2E tests: `workflow.spec.ts`
- Test utilities: `test-utils.ts`

## Testing Best Practices

### Writing Good Tests

**Arrange, Act, Assert Pattern:**
```typescript
it('should calculate total with tax', () => {
  // Arrange
  const price = 100;
  const taxRate = 0.1;
  
  // Act
  const total = calculateTotal(price, taxRate);
  
  // Assert
  expect(total).toBe(110);
});
```

**Descriptive Test Names:**
```typescript
// Good
it('should display error message when email is invalid')

// Bad
it('should validate email')
```

**Test Independence:**
- Each test should be independent
- No shared state between tests
- Use setup/teardown appropriately
- Mock external dependencies

### Mocking Guidelines

**Mock External Services:**
```typescript
jest.mock('../api/userService', () => ({
  getUser: jest.fn(),
  createUser: jest.fn()
}));
```

**Mock React Router:**
```typescript
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));
```

## Continuous Integration

### Automated Testing

**GitHub Actions Workflow:**
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e
```

**Quality Gates:**
- Minimum test coverage threshold
- All tests must pass
- No security vulnerabilities
- Performance budgets met

### Test Reports

**Coverage Reports:**
- Line coverage > 80%
- Branch coverage > 75%
- Function coverage > 90%
- Statement coverage > 85%

**Performance Reports:**
- Page load times < 3s
- API response times < 500ms
- Core Web Vitals passing
- No accessibility violations

## Testing Checklist

### Pre-Development
- [ ] Define test strategy for new feature
- [ ] Identify testing scenarios
- [ ] Set up test environment
- [ ] Plan for edge cases

### During Development
- [ ] Write unit tests for new code
- [ ] Test edge cases and error conditions
- [ ] Verify component behavior
- [ ] Test API integrations

### Pre-Deployment
- [ ] Run full test suite
- [ ] Verify test coverage meets requirements
- [ ] Execute E2E tests
- [ ] Performance testing completed
- [ ] Security testing passed

### Post-Deployment
- [ ] Monitor application metrics
- [ ] Verify production functionality
- [ ] Check error rates
- [ ] Validate performance metrics

## Related Documentation

- [Code Style Guide](../../developer/guides/code-style.md)
- [Performance Testing](../performance/README.md)
- [Security Guidelines](../security/README.md)
- [Development Setup](../../developer/setup/installation.md)
