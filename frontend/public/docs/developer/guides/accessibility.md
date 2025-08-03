# Accessibility Guidelines

## Overview

This document outlines accessibility standards and implementation guidelines
for the ThinkRED platform. We are committed to creating inclusive digital
experiences for all users.

## Accessibility Standards

### WCAG 2.1 Compliance

We aim for **WCAG 2.1 Level AA** compliance across all digital properties.

**Key Principles:**
- **Perceivable**: Information must be presentable in ways users can perceive
- **Operable**: Interface components must be operable by all users
- **Understandable**: Information and UI operation must be understandable
- **Robust**: Content must be robust enough for various assistive technologies

## Implementation Guidelines

### Semantic HTML

Use proper HTML elements for their intended purpose:

```tsx
// Good: Semantic structure
<main>
  <header>
    <h1>Page Title</h1>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
  
  <section>
    <h2>Content Section</h2>
    <article>
      <h3>Article Title</h3>
      <p>Article content...</p>
    </article>
  </section>
</main>

// Avoid: Generic divs for everything
<div class="main">
  <div class="header">
    <div class="title">Page Title</div>
  </div>
</div>
```

### ARIA Labels and Roles

Provide appropriate ARIA attributes for screen readers:

```tsx
// Form controls
<label htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-error"
/>
<div id="email-error" role="alert">
  Please enter a valid email address
</div>

// Buttons with context
<button
  aria-label="Close dialog"
  onClick={handleClose}
>
  ×
</button>

// Navigation landmarks
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/docs">Documentation</a></li>
    <li aria-current="page">Guidelines</li>
  </ol>
</nav>
```

### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```tsx
// Custom interactive elements need keyboard support
const CustomButton = ({ onClick, children, ...props }) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
};

// Skip links for navigation
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white p-2 rounded"
>
  Skip to main content
</a>
```

### Color and Contrast

Maintain appropriate color contrast ratios:

```css
/* WCAG AA Requirements */
/* Normal text: 4.5:1 contrast ratio */
/* Large text (18pt+): 3:1 contrast ratio */

.text-primary {
  color: #1a365d; /* Dark blue with high contrast */
}

.text-secondary {
  color: #4a5568; /* Gray with sufficient contrast */
}

/* Never rely on color alone for information */
.error-message {
  color: #e53e3e;
  border-left: 3px solid #e53e3e; /* Visual indicator */
}

.error-message::before {
  content: "⚠️ "; /* Icon for context */
}
```

### Focus Management

Provide clear focus indicators and logical focus flow:

```css
/* Custom focus styles */
.focus-visible {
  outline: 2px solid #3182ce;
  outline-offset: 2px;
}

/* Skip links */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: inherit;
}
```

## Component Accessibility

### Forms

Create accessible form components:

```tsx
interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  required,
  children
}) => {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span aria-label="required">*</span>}
      </label>
      
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-required': required,
        'aria-describedby': errorId,
        'aria-invalid': !!error
      })}
      
      {error && (
        <div id={errorId} role="alert" className="form-error">
          {error}
        </div>
      )}
    </div>
  );
};
```

### Modals and Dialogs

Implement accessible modal dialogs:

```tsx
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus management
      modalRef.current?.focus();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Trap focus within modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="modal-close"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
```

### Data Tables

Create accessible data tables:

```tsx
const DataTable: React.FC<TableProps> = ({ data, columns }) => {
  return (
    <table role="table" aria-label="User data">
      <caption className="sr-only">
        Table showing user information with {data.length} rows
      </caption>
      
      <thead>
        <tr role="row">
          {columns.map(column => (
            <th
              key={column.key}
              role="columnheader"
              scope="col"
              aria-sort={column.sortDirection}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      
      <tbody>
        {data.map((row, index) => (
          <tr key={index} role="row">
            {columns.map(column => (
              <td key={column.key} role="gridcell">
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

## Testing Accessibility

### Automated Testing

Use accessibility testing tools in development:

```typescript
// Jest + jest-axe for unit tests
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing

**Keyboard Testing:**
- Tab through all interactive elements
- Ensure focus is visible and logical
- Test keyboard shortcuts and navigation
- Verify skip links functionality

**Screen Reader Testing:**
- Test with NVDA, JAWS, or VoiceOver
- Verify content is announced correctly
- Test form interactions and error messages
- Ensure proper heading structure

**Color and Contrast:**
- Test with color blindness simulators
- Verify sufficient contrast ratios
- Ensure information isn't color-dependent

## Tools and Resources

### Development Tools

**Browser Extensions:**
- axe DevTools
- WAVE Web Accessibility Evaluator
- Lighthouse accessibility audit
- Color Contrast Analyzer

**Testing Tools:**
- jest-axe for automated testing
- pa11y for command-line testing
- Playwright accessibility testing
- Storybook accessibility addon

### Screen Readers

**Free Options:**
- NVDA (Windows)
- VoiceOver (macOS/iOS)
- Orca (Linux)
- TalkBack (Android)

**Commercial:**
- JAWS (Windows)
- Dragon NaturallySpeaking

## Accessibility Checklist

### Development Phase
- [ ] Use semantic HTML elements
- [ ] Provide appropriate ARIA labels
- [ ] Ensure keyboard navigation works
- [ ] Test color contrast ratios
- [ ] Add alt text for images
- [ ] Implement proper heading hierarchy
- [ ] Test with screen readers

### Pre-Release
- [ ] Run automated accessibility tests
- [ ] Manual keyboard testing completed
- [ ] Screen reader testing done
- [ ] Color contrast verified
- [ ] Focus management tested
- [ ] Error messages are accessible

### Ongoing Maintenance
- [ ] Regular accessibility audits
- [ ] User feedback collection
- [ ] Update to latest WCAG guidelines
- [ ] Team accessibility training

## Related Documentation

- [Testing Guidelines](../../operations/testing/README.md)
- [Code Style Guide](code-style.md)
- [Performance Guidelines](../../operations/performance/README.md)
- [Development Setup](../setup/installation.md)
