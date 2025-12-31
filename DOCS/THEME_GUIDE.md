# Sigmapay Theme Guide

## Overview

This document describes the visual theme applied to SigmaPay-light, adapted from the [Ammar-M-Eid/Sigmapay](https://github.com/Ammar-M-Eid/Sigmapay) repository. The theme includes color tokens, typography, animations, and component utility classes.

## Theme Files

- **Token File**: `frontend-client/src/styles/sigmapay-tokens.css` - Central repository for all design tokens
- **Global Styles**: `frontend-client/src/index.css` - Imports tokens and defines global styles
- **Logo Asset**: `frontend-client/public/assets/sigmapay/sigmapay-logo.svg` - Sigmapay branding logo

## Color Palette

### Primary Colors

The core brand colors from Sigmapay:

```css
--color-primary: #646cff;      /* Primary brand color - buttons, links, focus states */
--color-secondary: #535bf2;    /* Secondary brand color - hover states, accents */
```

**Usage Example:**
```tsx
// In inline styles
style={{ background: '#646cff' }}

// In CSS with variables
background-color: var(--color-primary);
```

### Background Colors

```css
--color-background: #f9fafb;   /* Page background (light gray) */
--color-card-bg: #ffffff;      /* Card/panel backgrounds (white) */
```

### Text Colors

```css
--color-text-primary: #1f2937;    /* Main text (dark gray) */
--color-text-secondary: #6b7280;  /* Secondary text (medium gray) */
--color-text-tertiary: #9ca3af;   /* Tertiary/helper text (light gray) */
```

### Border Colors

```css
--color-border: #e5e7eb;          /* Default borders */
--color-border-light: #d1d5db;    /* Light borders */
--color-border-focus: var(--color-primary);  /* Focus state borders */
```

### State Colors

Success, error, warning, and info states:

```css
/* Success */
--color-success: #22543d;
--color-success-bg: #c6f6d5;

/* Error */
--color-error: #742a2a;
--color-error-bg: #fed7d7;

/* Warning */
--color-warning: #744210;
--color-warning-bg: #feebc8;

/* Info */
--color-info: #2c5282;
--color-info-bg: #bee3f8;
```

### Logo & Branding

```css
--color-logo-bg: #4F46E5;  /* Indigo background for logo */
```

## Shadows

Pre-defined shadow tokens for consistent elevation:

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 10px 30px rgba(0, 0, 0, 0.2);
--shadow-primary: 0 4px 15px rgba(100, 108, 255, 0.4);  /* Primary-colored shadow */
```

## Focus Ring

Standard focus ring for accessibility:

```css
--focus-ring: 0 0 0 3px rgba(100, 108, 255, 0.1);
```

## Typography

### Font Families

```css
--font-family-base: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
--font-family-mono: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
```

### Font Sizes

```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
```

### Font Weights

```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Line Heights

```css
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

## Spacing & Borders

### Spacing Tokens

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 0.75rem;   /* 12px */
--spacing-lg: 1rem;      /* 16px */
--spacing-xl: 1.5rem;    /* 24px */
--spacing-2xl: 2rem;     /* 32px */
--spacing-3xl: 3rem;     /* 48px */
```

### Border Radius

```css
--border-radius-sm: 0.5rem;   /* 8px */
--border-radius-md: 0.75rem;  /* 12px */
--border-radius-lg: 1rem;     /* 16px */
```

## Animations

### Keyframes

The following animations are available from the Sigmapay design system:

1. **fadeIn** - Simple fade in effect
2. **slideUp** - Slide up with fade in (from bottom)
3. **slideDown** - Slide down with fade in (from top)
4. **slideInRight** - Slide in from right
5. **slideInLeft** - Slide in from left
6. **blob** - Organic blob-like movement animation
7. **fadeInUp** - Legacy animation (preserved from original codebase)

### Animation Classes

Apply these classes to elements for instant animations:

```css
.animate-fade-in        /* fadeIn 0.5s ease-in-out */
.animate-slide-up       /* slideUp 0.5s ease-in-out */
.animate-slide-down     /* slideDown 0.5s ease-in-out */
.animate-slide-in-right /* slideInRight 0.5s ease-in-out */
.animate-slide-in-left  /* slideInLeft 0.5s ease-in-out */
.animate-bounce-slow    /* bounce 3s infinite */
.animate-pulse-slow     /* pulse 3s infinite */
.animate-blob           /* blob 7s infinite */
```

**Usage Example:**
```html
<div className="animate-slide-up">
  This content slides up when it appears
</div>
```

## Component Utility Classes

### Button - Primary

Standard primary button from Sigmapay:

```css
.btn-primary {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--border-radius-sm);
  transition: background-color 0.3s;
  border: none;
  cursor: pointer;
  font-weight: var(--font-weight-semibold);
}

.btn-primary:hover {
  background-color: var(--color-secondary);
}

.btn-primary:focus {
  outline: none;
  box-shadow: var(--focus-ring);
}
```

**HTML Example:**
```html
<button class="btn-primary">Click Me</button>
```

### Input Field

Standard input field styling:

```css
.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius-sm);
  font-family: inherit;
  font-size: var(--font-size-base);
  transition: all 0.3s ease;
  background-color: var(--color-card-bg);
}

.input-field:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: var(--focus-ring);
}
```

**HTML Example:**
```html
<input type="text" class="input-field" placeholder="Enter text">
```

### Card

Standard card container:

```css
.card {
  background: var(--color-card-bg);
  padding: 1.5rem;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
}

.card-elevated {
  box-shadow: var(--shadow-xl);
}
```

**HTML Example:**
```html
<div class="card">
  Card content here
</div>

<div class="card card-elevated">
  Elevated card with stronger shadow
</div>
```

### Text Utilities

```css
.text-primary   /* Primary brand color text */
.text-secondary /* Secondary text color */
.text-muted     /* Muted/tertiary text */
```

### Background Utilities

```css
.bg-primary    /* Primary background color */
.bg-secondary  /* Secondary background color */
.bg-card       /* Card background color */
```

### Border Utilities

```css
.border-primary  /* Primary border color */
```

## Color Migration Reference

This table shows the mapping from the old colors to the new Sigmapay colors:

| Old Color | New Sigmapay Color | Hex Value | Usage |
|-----------|-------------------|-----------|-------|
| `#667eea` | Primary | `#646cff` | Primary buttons, links, focus states, active navigation |
| `#764ba2` | Secondary | `#535bf2` | Hover states, accents, secondary elements |
| `#f9fafb` | Background | `#f9fafb` | Page background (unchanged) |
| `#ffffff` | Card BG | `#ffffff` | Card backgrounds (unchanged) |

## Gradients

### Primary Gradient

The main brand gradient used throughout the application:

```css
background: linear-gradient(135deg, #646cff 0%, #535bf2 100%);
```

**Used in:**
- App background
- Header
- Primary buttons
- Hero sections
- Auth pages

### Footer Gradient

Darker gradient for footer sections:

```css
background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
```

## Implementation Notes

### How to Use Tokens in Components

**In CSS files:**
```css
.my-component {
  color: var(--color-primary);
  background: var(--color-card-bg);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
}
```

**In React inline styles (use hex values directly):**
```tsx
const styles: React.CSSProperties = {
  background: '#646cff',  // Use hex directly
  color: 'white',
  padding: '1rem',
  borderRadius: '8px',
};
```

### Best Practices

1. **Always use tokens in CSS files** - Use CSS custom properties for maintainability
2. **Use hex values in inline styles** - React inline styles don't support CSS variables well
3. **Maintain consistency** - Use the defined gradients and shadows consistently
4. **Accessibility** - Always ensure sufficient color contrast (WCAG AA standard)
5. **Focus states** - Always include focus rings for keyboard navigation

### Preserved Elements

The following elements from the original SigmaPay-light theme were preserved:

- **fadeInUp animation** - Original card entrance animation
- **Smooth scrolling behavior** - `scroll-behavior: smooth`
- **Button hover effects** - Transform and shadow on hover
- **Component structure** - No architectural changes

## File Locations

### Theme Files
- `/frontend-client/src/styles/sigmapay-tokens.css` - All design tokens
- `/frontend-client/src/index.css` - Global styles with token imports

### Assets
- `/frontend-client/public/assets/sigmapay/sigmapay-logo.svg` - Sigmapay logo

### Components Using Theme
- `/frontend-client/src/App.tsx` - Main app with primary gradient
- `/frontend-client/src/components/Header.tsx` - Navigation header
- `/frontend-client/src/pages/AuthPage.tsx` - Authentication page
- `/frontend-client/src/pages/LoginPage.tsx` - Login page
- `/frontend-client/src/pages/BudgetPage.tsx` - Budget management
- `/frontend-client/src/pages/ReportsPage.tsx` - Reports and charts
- `/frontend-client/src/components/Charts.tsx` - Chart components

## Version History

- **v1.0** (2024) - Initial Sigmapay theme application
  - Migrated from `#667eea/#764ba2` to `#646cff/#535bf2`
  - Added comprehensive design token system
  - Implemented Sigmapay animations
  - Added component utility classes
  - Created theme documentation

## Support

For questions or issues related to the theme, refer to:
- This documentation
- The token definitions in `sigmapay-tokens.css`
- Original Sigmapay repository: [Ammar-M-Eid/Sigmapay](https://github.com/Ammar-M-Eid/Sigmapay)
