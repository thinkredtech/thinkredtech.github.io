# ThinkRED Technologies Design System

## Overview

The ThinkRED Technologies Design System is a comprehensive collection of reusable components, design
tokens, and guidelines that ensure consistency, accessibility, and brand alignment across all
digital touchpoints. This system is built upon our core [Brand Guidelines](./brand-guidelines) and
serves as the foundation for all user interface development.

## Design Principles

### 1. Simplicity First

Every design decision prioritizes clarity and ease of use, reflecting our core mission to "Simplify
Technology & Experience." We eliminate unnecessary complexity while maintaining functional
sophistication.

### 2. Engineering Excellence

Components are built with performance, accessibility, and maintainability as fundamental
requirements, not afterthoughts. Each element is optimized for both developer experience and
end-user performance.

### 3. Brand Consistency

All elements faithfully represent ThinkRED's visual identity while providing flexibility for diverse
application needs. The design system ensures brand recognition across all touchpoints.

### 4. User-Centered Approach

Design decisions are validated against user needs and business objectives, ensuring optimal user
experience through research-backed choices and accessibility standards.

### 5. Scalable Architecture

Components are designed to scale gracefully across different devices, contexts, and future
requirements while maintaining visual and functional integrity.

## Typography System

### Font Families

#### Primary Display Font: Comfortaa

Used for brand headlines, hero sections, and primary display text where personality and brand
recognition are paramount.

- **Characteristics**: Rounded, friendly, approachable
- **Usage**: Headlines, hero text, brand statements
- **Weights Available**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

#### Primary Text Font: Montserrat

Used for all body text, navigation, and interface elements where readability and professionalism are
essential.

- **Characteristics**: Clean, professional, highly legible
- **Usage**: Body text, navigation, UI elements, captions
- **Weights Available**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Typography Scale

#### Display Typography (Comfortaa)

| Style     | Size/Line Height | Letter Spacing | Weight     | Usage                                    |
| --------- | ---------------- | -------------- | ---------- | ---------------------------------------- |
| Display 1 | 80px/88px        | -2px           | Medium 500 | Hero headlines, primary brand statements |
| Display 2 | 48px/56px        | -1px           | Medium 500 | Section headers, secondary headlines     |

#### Heading Typography (Montserrat)

| Style     | Size/Line Height | Letter Spacing | Weight                 | Usage                             |
| --------- | ---------------- | -------------- | ---------------------- | --------------------------------- |
| Heading 1 | 32px/40px        | -0.5px         | Medium 500/Regular 400 | Page titles, main section headers |
| Heading 2 | 24px/32px        | -0.25px        | Medium 500/Regular 400 | Subsection headers, card titles   |
| Heading 3 | 18px/26px        | -0.25px        | Medium 500/Regular 400 | Component headers, list headers   |

#### Body Typography (Montserrat)

| Style  | Size/Line Height | Letter Spacing | Weight                              | Usage                           |
| ------ | ---------------- | -------------- | ----------------------------------- | ------------------------------- |
| Body 1 | 16px/24px        | 0              | Regular 400/Medium 500/SemiBold 600 | Primary body text, descriptions |
| Body 2 | 14px/20px        | 0              | Medium 500                          | Secondary text, captions        |

#### Interactive Typography (Montserrat)

| Style       | Size      | Letter Spacing | Weight                  | Usage                                         |
| ----------- | --------- | -------------- | ----------------------- | --------------------------------------------- |
| CTA Medium  | 14px      | 1.5px          | SemiBold 600            | Primary buttons, prominent calls-to-action    |
| CTA Small   | 12px      | 1px            | SemiBold 600            | Secondary buttons, small interactive elements |
| Label 1     | 14px      | 1px            | SemiBold 600            | Form labels, primary labels                   |
| Label 2     | 12px      | 1px            | SemiBold 600            | Secondary labels, metadata                    |
| Small Label | 10px/14px | 0.25px         | SemiBold 600            | Micro-labels, status indicators               |
| Caption     | 12px/16px | 0.25px         | SemiBold 600/Medium 500 | Image captions, fine print                    |
| Breadcrumb  | 10px/14px | 0.25px         | Medium 500              | Navigation breadcrumbs                        |

## Color System

### Brand Color Palette

#### Primary Brand Color

- **ThinkRED Primary**: `#E4093E`
- **Usage**: Primary CTAs, brand elements, active states, primary navigation
- **Accessibility**: Meets WCAG AA contrast requirements against white backgrounds

#### Accent Colors

- **ThinkRED Blue**: `#518CEA`
  - **Usage**: Secondary actions, informational elements, links
- **ThinkRED Purple**: `#AE6CFC`
  - **Usage**: Tertiary actions, decorative elements, gradients

#### Neutral Colors

- **Dark Primary**: `#2A2A2A`
  - **Usage**: Primary text, headlines, high-emphasis content
- **Medium Gray**: `#7A7A7A`
  - **Usage**: Secondary text, supporting content
- **Light Gray**: `#AAAAAA`
  - **Usage**: Tertiary text, placeholder content, subtle elements

### Background Colors

#### Primary Backgrounds

- **Pure White**: `#FEFEFE`
  - **Usage**: Main content areas, cards, modals
- **Warm White**: `#FEFEF6`
  - **Usage**: Page backgrounds, section backgrounds, warm contexts

### Extended Color Palette

#### State Colors

- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)
- **Info**: `#3B82F6` (Blue)

#### Opacity Variants

Each brand color includes predefined opacity variants:

- 10%, 20%, 30%, 50%, 70%, 90% opacity levels
- Used for backgrounds, hover states, and layered elements

## Spacing System

### Grid-Based Spacing

Built on an 8px base unit for mathematical consistency and visual harmony.

| Token        | Value | Rem Equivalent | Usage                            |
| ------------ | ----- | -------------- | -------------------------------- |
| `spacing-1`  | 4px   | 0.25rem        | Tiny gaps, tight spacing         |
| `spacing-2`  | 8px   | 0.5rem         | Small spacing, icon gaps         |
| `spacing-3`  | 12px  | 0.75rem        | Small component spacing          |
| `spacing-4`  | 16px  | 1rem           | Regular spacing, paragraph gaps  |
| `spacing-6`  | 24px  | 1.5rem         | Medium spacing, section gaps     |
| `spacing-8`  | 32px  | 2rem           | Large spacing, component margins |
| `spacing-10` | 40px  | 2.5rem         | Very large spacing               |
| `spacing-12` | 48px  | 3rem           | Extra large spacing              |
| `spacing-14` | 56px  | 3.5rem         | Huge spacing                     |
| `spacing-16` | 64px  | 4rem           | Giant spacing, section dividers  |

### Layout Spacing

- **Container Max Width**: 1200px
- **Container Padding**: 16px (mobile), 24px (tablet), 32px (desktop)
- **Section Vertical Spacing**: 64px (mobile), 96px (desktop)
- **Component Spacing**: 32px (mobile), 48px (desktop)

## Shadow System

### Elevation Levels

| Level        | Shadow                       | Usage                             |
| ------------ | ---------------------------- | --------------------------------- |
| **Subtle**   | `0.4px 8px rgba(0,0,0,0.08)` | Hover states, slight elevation    |
| **Subtle 2** | `0.4px 8px rgba(0,0,0,0.08)` | Alternative subtle shadow         |
| **Small**    | `0.4px 8px rgba(0,0,0,0.16)` | Small cards, dropdowns            |
| **Regular**  | `0.8px 8px rgba(0,0,0,0.16)` | Cards, modals, prominent elements |

### Shadow Usage Guidelines

- Use shadows to establish visual hierarchy
- Maintain consistency across similar components
- Consider performance impact of complex shadows
- Test shadows across different backgrounds

## Border Radius System

### Radius Scale

| Token            | Value  | Usage                                 |
| ---------------- | ------ | ------------------------------------- |
| `radius-sm`      | 4px    | Small elements, badges, tags          |
| `radius-default` | 8px    | Default components, buttons, inputs   |
| `radius-lg`      | 16px   | Large components, cards, modals       |
| `radius-xl`      | 24px   | Extra large components, hero sections |
| `radius-full`    | 9999px | Circular elements, pills, avatars     |

## Component Guidelines

### Button System

#### Primary Button

- **Background**: `#E4093E` (ThinkRED Primary)
- **Text**: White
- **Padding**: 12px 24px
- **Border Radius**: 8px (radius-default)
- **Typography**: CTA Medium (14px, SemiBold 600, 1.5px letter-spacing)
- **States**: Hover (darker), Active (darkest), Disabled (grayed)

#### Secondary Button

- **Border**: 2px solid `#E4093E`
- **Text**: `#E4093E`
- **Background**: Transparent
- **Padding**: 10px 22px (adjusted for border)
- **Border Radius**: 8px
- **Typography**: CTA Medium
- **States**: Hover (filled), Active (darker), Disabled (grayed)

#### Tertiary Button

- **Background**: Transparent
- **Text**: `#E4093E`
- **Padding**: 12px 24px
- **Border**: None
- **Border Radius**: 8px
- **Typography**: CTA Medium
- **States**: Hover (subtle background), Active (more pronounced), Disabled (grayed)

### Card System

#### Standard Card

- **Background**: `#FEFEFE` (Pure White)
- **Border Radius**: 8px (radius-default)
- **Shadow**: Regular shadow
- **Padding**: 24px (spacing-6)
- **Border**: None (shadow provides definition)

#### Feature Card

- **Background**: `#FEFEFE`
- **Border Radius**: 16px (radius-lg)
- **Shadow**: Regular shadow
- **Padding**: 32px (spacing-8)
- **Hover State**: Elevated shadow, slight transform

### Form Elements

#### Input Fields

- **Border**: 1px solid `#E5E7EB`
- **Border Radius**: 8px (radius-default)
- **Padding**: 12px 16px
- **Typography**: Body 1 (16px, Regular 400)
- **Focus State**: 2px border `#518CEA` (ThinkRED Blue)
- **Error State**: 2px border `#EF4444` (Error red)

#### Labels

- **Typography**: Label 1 (14px, SemiBold 600, 1px letter-spacing)
- **Color**: `#2A2A2A` (Dark Primary)
- **Spacing**: 8px margin bottom

### Navigation System

#### Header Navigation

- **Background**: `#FEFEFE` with backdrop blur
- **Height**: 80px
- **Logo**: Left-aligned, 32px height
- **Navigation Links**: Right-aligned, Body 1 typography
- **Mobile**: Hamburger menu with slide-out drawer

#### Mobile Navigation

- **Drawer Background**: `#FEFEFE`
- **Animation**: Slide from right, 300ms ease-out
- **Link Spacing**: 16px vertical spacing
- **Typography**: Body 1 for links, CTA Medium for buttons

## Accessibility Standards

### Color Contrast

- All text meets WCAG AA contrast requirements (4.5:1 minimum)
- Large text meets AAA requirements (3:1 minimum)
- Interactive elements have sufficient contrast in all states

### Focus Management

- Visible focus indicators on all interactive elements
- Logical tab order throughout the interface
- Skip links for keyboard navigation

### Screen Reader Support

- Semantic HTML structure
- Appropriate ARIA labels and descriptions
- Alt text for all meaningful images

## Responsive Design Guidelines

### Breakpoint System

| Breakpoint | Min Width | Usage                          |
| ---------- | --------- | ------------------------------ |
| `mobile`   | 0px       | Default, mobile-first approach |
| `tablet`   | 768px     | Tablet devices, medium screens |
| `desktop`  | 1024px    | Desktop devices, large screens |
| `wide`     | 1440px    | Large desktop displays         |

### Grid System

- **Mobile**: Single column, full-width components
- **Tablet**: 2-3 column grid, flexible layouts
- **Desktop**: 3-4 column grid, optimal content width
- **Wide**: Centered content, maximum 1200px width

## Implementation Guidelines

### CSS Custom Properties

All design tokens are implemented as CSS custom properties for easy theming and maintenance:

```css
:root {
  --color-primary: #e4093e;
  --color-accent-blue: #518cea;
  --color-accent-purple: #ae6cfc;
  --spacing-4: 1rem;
  --radius-default: 8px;
  --shadow-regular: 0.8px 8px rgba(0, 0, 0, 0.16);
}
```

### Component Implementation

- Use TypeScript for type safety
- Implement proper prop interfaces
- Include accessibility attributes
- Follow naming conventions
- Document component usage and examples

### Performance Considerations

- Optimize animations for 60fps
- Use CSS transforms for performant animations
- Implement lazy loading for images
- Minimize CSS bundle size through purging unused styles
- Active state with #E4093E underline or highlight

## Responsive Breakpoints

- **Mobile:** 0-767px
- **Tablet:** 768px-1023px
- **Desktop:** 1024px-1439px
- **Large Desktop:** 1440px+

## Animation Guidelines

- Smooth transitions (0.3s ease)
- Subtle hover effects
- Scroll-triggered animations for content sections
- 3D avatar assistant with interactive animations

## Image Treatment

- High-quality imagery
- Consistent aspect ratios
- Subtle rounded corners (8px)
- Optional subtle overlay gradient for text legibility

## Accessibility Considerations

- Minimum contrast ratio of 4.5:1 for text
- Focus states clearly visible
- Interactive elements with appropriate hover/active states
- Alternative text for all images
