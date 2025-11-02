# AI Test Generator - Design Guidelines

## Design Approach
**Selected Approach**: Design System - Linear-inspired aesthetic
**Justification**: This is a utility-focused developer/QA tool where clarity, efficiency, and professional presentation of code and data are paramount. Linear's clean, modern design system excels at presenting complex information in an accessible way while maintaining visual sophistication.

**Core Design Principles**:
- Information hierarchy through typography and spacing
- Clean, distraction-free interfaces that let content shine
- Precise alignment and consistent patterns
- Professional polish suitable for enterprise use

## Typography System

**Font Family**: Inter (via Google Fonts)
- Primary: Inter 400, 500, 600 for all UI text
- Code: JetBrains Mono 400, 500 for code blocks and Cypress scripts

**Hierarchy**:
- Page Titles: text-3xl font-semibold (30px)
- Section Headers: text-2xl font-semibold (24px)
- Component Titles: text-lg font-medium (18px)
- Body Text: text-base font-normal (16px)
- Subtext/Labels: text-sm font-medium (14px)
- Code: text-sm font-mono (14px)

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Component padding: p-6, p-8
- Section spacing: space-y-8, space-y-12
- Card gaps: gap-6, gap-8
- Margins: mb-4, mb-8, mt-12

**Grid Structure**:
- Container: max-w-7xl mx-auto px-6
- Dashboard: Single column layout for focus
- History Page: Grid of saved results - grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

**Responsive Breakpoints**:
- Mobile: Base styles, single column
- Tablet: md: prefix, two columns where appropriate
- Desktop: lg: prefix, full layouts

## Component Library

### Navigation Header
- Fixed top navigation with backdrop blur
- Logo/app name on left (text-xl font-semibold)
- Navigation links centered or right-aligned
- Height: h-16
- Border bottom: border-b with subtle divider

### Dashboard (Main Generator Page)

**Hero Section** (No large hero image - utility focused):
- Compact header area with app title and brief description
- Height: Natural content height, not forced to viewport
- Padding: py-12 to py-16
- Center-aligned heading and description
- Max-width for text: max-w-2xl mx-auto

**Input Section**:
- Full-width container with max-w-4xl mx-auto
- Textarea for requirements input:
  - Large size: min-h-48 on desktop, min-h-32 on mobile
  - Rounded corners: rounded-lg
  - Padding: p-4
  - Border: border with focus state (ring-2 on focus)
  - Font: text-base
- Character counter below input: text-sm text-right
- Submit button:
  - Size: px-8 py-3
  - Typography: text-base font-medium
  - Rounded: rounded-lg
  - Full-width on mobile, auto on desktop
  - Loading state with spinner icon

### Results Display Section

**Two-Column Layout** (Desktop only, stacked on mobile):
- Grid: grid-cols-1 lg:grid-cols-2 gap-8
- Equal height columns

**Manual Test Cases Card**:
- Border: border rounded-lg
- Padding: p-6
- Header with title and copy button
- Table format:
  - Full width
  - Headers: font-medium with bottom border
  - Cells: py-3 px-4
  - Alternating row treatment for readability
  - Responsive: scroll-x-auto on mobile
  - Columns: Test Case ID, Description, Steps, Expected Result, Priority

**Cypress Script Card**:
- Border: border rounded-lg
- Padding: p-6
- Header with title and copy button
- Code block:
  - Background with subtle treatment
  - Padding: p-4
  - Rounded: rounded-md
  - Font: font-mono text-sm
  - Syntax highlighting suggested (use Prism.js or similar)
  - Max height with scroll: max-h-96 overflow-y-auto

### History Page

**Page Structure**:
- Page title: py-8
- Filter/sort controls: mb-8
  - Horizontal flex layout
  - Search input and date filters

**History Cards Grid**:
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Each card:
  - Border: border rounded-lg
  - Padding: p-6
  - Hover state with subtle elevation
  - Content structure:
    - Timestamp badge at top (text-xs)
    - Requirement snippet: 2-3 lines with overflow ellipsis
    - Metadata row: number of test cases generated
    - Action buttons: View Full Results, Delete
    - Spacing between elements: space-y-4

**Empty State** (when no history):
- Center-aligned container
- Icon (document or history icon from Heroicons)
- Heading: "No saved results yet"
- Description text
- CTA button to generate first test

### Modal/Overlay for Full History View
- Full-screen overlay with backdrop
- Centered content card: max-w-5xl
- Close button (top-right)
- Scrollable content area
- Display full test cases table and Cypress script

### Common Components

**Buttons**:
- Primary: px-6 py-2.5, rounded-lg, font-medium
- Secondary: px-6 py-2.5, rounded-lg, border variant
- Icon buttons: p-2, rounded-md
- Loading state: opacity reduction + spinner

**Input Fields**:
- Height: h-11
- Padding: px-4
- Rounded: rounded-lg
- Border with focus ring
- Labels above: mb-2, font-medium, text-sm

**Cards/Panels**:
- Border: border rounded-lg
- Padding: p-6 to p-8
- Subtle shadow on hover for interactive cards

**Loading States**:
- Skeleton screens for table rows
- Spinner with text for form submissions
- Progress indicator if generation takes time

**Icons**: Use Heroicons via CDN
- Consistent size: w-5 h-5 for inline icons, w-6 h-6 for larger icons
- Copy icon, Trash icon, Document icon, Search icon

### Footer
- Simple footer with links
- Padding: py-12
- Border top: border-t
- Center or split layout (logo left, links right)
- Links: About, Documentation, GitHub

## Accessibility & Interactions
- Focus states: ring-2 with offset on all interactive elements
- ARIA labels on icon buttons
- Form validation with inline error messages (text-sm, mt-1)
- Keyboard navigation support throughout
- Responsive text sizes that scale appropriately

## Animations
**Minimal Use Only**:
- Fade-in for results display: transition-opacity duration-300
- Smooth modal appearance: transition-all duration-200
- Button hover states: transition-colors duration-150
- NO scroll-triggered animations
- NO complex page transitions

## Images
This application does **NOT require a large hero image**. It's a utility tool where the interface and functionality take precedence. Focus remains on clean forms, data tables, and code displays.