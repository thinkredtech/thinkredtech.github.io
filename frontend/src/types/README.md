# TypeScript Type Declarations

This directory contains custom TypeScript type declarations to enhance type safety and compatibility
across the project.

## Files Overview

### `react-icons.d.ts`

**Purpose**: Provides React 19 compatibility for the react-icons library.

**Problem Solved**: React 19 introduced changes to the JSX runtime that affect how icon libraries
like react-icons work with TypeScript.

**Solution**: Instead of hard-coding specific icon exports (which would be unmaintainable), this
file provides:

- Generic module declarations that work with all react-icons packages
- Proper TypeScript integration for React 19's JSX runtime
- Scalable approach that automatically works with new icons

**Benefits**:

- ✅ **Scalable**: Works with any icon from any react-icons package
- ✅ **Maintainable**: No need to manually add new icon types
- ✅ **Future-proof**: Compatible with react-icons updates
- ✅ **Type-safe**: Full TypeScript support for all icon props

**Usage Example**:

```tsx
import { FaReact, FaNodeJs } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs } from 'react-icons/si';

// All icons are fully typed and work seamlessly
<FaReact className="text-blue-500" size={24} />
<SiTypescript className="text-blue-600" />
```

## Best Practices

### When to Add New Type Declarations

- When integrating third-party libraries that lack React 19 compatibility
- When you need to augment existing types for better developer experience
- When fixing TypeScript compilation issues with external dependencies

### When NOT to Add Type Declarations

- For libraries that already have proper TypeScript support
- For internal components (use proper TypeScript interfaces instead)
- For temporary workarounds (fix the root cause instead)

## Alternative Approaches Considered

### 1. Hard-coded Icon Exports (Previous Approach)

```typescript
// ❌ Not scalable - requires manual maintenance
export const FaReact: ComponentType<SVGProps<SVGSVGElement>>;
export const FaNodeJs: ComponentType<SVGProps<SVGSVGElement>>;
// ... hundreds more
```

**Issues**:

- Maintenance burden for every new icon
- Doesn't scale with library updates
- Easy to miss icons or make typos

### 2. Any/Unknown Types

```typescript
// ❌ Loses type safety
declare module 'react-icons/*' {
  const content: any;
  export = content;
}
```

**Issues**:

- No type checking
- No IntelliSense support
- Error-prone development

### 3. Current Approach (Recommended)

```typescript
// ✅ Generic, scalable, and type-safe
declare module 'react-icons/*' {
  const content: ComponentType<SVGProps<SVGSVGElement>>;
  export = content;
}
```

**Benefits**:

- Automatic compatibility with all icons
- Full type safety
- Minimal maintenance required
- Works with future react-icons updates

## Troubleshooting

### Common Issues

**Issue**: TypeScript errors when importing react-icons

```
Cannot find module 'react-icons/fa' or its corresponding type declarations
```

**Solution**: Ensure this `react-icons.d.ts` file is included in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "typeRoots": ["./src/types", "./node_modules/@types"]
  },
  "include": ["src/**/*"]
}
```

**Issue**: Icons not rendering properly

**Solution**: This is likely a React 19 JSX runtime issue. The type declarations here only fix
TypeScript compilation, not runtime issues. Check your React version and JSX runtime configuration.

## Maintenance

This file should require minimal maintenance. Only update if:

1. React Icons releases a major version with breaking changes
2. React introduces further JSX runtime changes
3. You need to support additional icon libraries

## Related Documentation

- [React Icons Documentation](https://react-icons.github.io/react-icons/)
- [React 19 JSX Runtime Changes](https://react.dev/blog/2024/04/25/react-19)
- [TypeScript Module Declarations](https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules)
