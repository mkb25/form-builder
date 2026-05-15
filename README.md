# WCAG Form Builder

A drag-and-drop form builder for creating accessible form schemas in the browser. The app lets users assemble fields, edit labels and options, resize fields, preview the final form, validate submissions, and export the generated JSON schema.

## Features

- Drag new fields from a grouped element palette onto the builder canvas.
- Reorder fields with `@dnd-kit` sortable drag-and-drop.
- Edit form-level title and description.
- Configure each field's label, help text, required state, placeholder, and choice options where applicable.
- Resize fields from 15% to 100% width for multi-column layouts.
- Preview the form with accessible labels, help text, error messages, and required indicators.
- Validate preview submissions with `react-hook-form`, `zod`, and `@hookform/resolvers`.
- Persist the current schema in `localStorage` under `wcag-form-builder-schema`.
- Export the full form schema as JSON from the header action.
- Deploy as a Cloudflare-backed Vite app using Wrangler.

## Supported Field Types

The builder currently supports:

- Personal information: first name, last name, full name, email, phone, password
- Basic inputs: short text, long text, number, URL, date, time
- Choice fields: dropdown, checkboxes, radio buttons
- Advanced fields: file upload, rating, toggle

## Tech Stack

- React 19
- TypeScript
- Vite
- Cloudflare Vite plugin and Wrangler
- `@dnd-kit` for drag-and-drop
- `react-hook-form` and `zod` for preview validation
- `lucide-react` for icons
- `nanoid` for schema and field IDs
- ESLint 9

## Project Structure

```text
src/
  App.tsx                         App shell, drag/drop orchestration, preview/export modal
  context/BuilderContext.tsx      Shared builder state, localStorage persistence, accessibility announcements
  components/
    Sidebar.tsx                   Draggable field palette
    BuilderCanvas.tsx             Droppable canvas and sortable field list
    SortableField.tsx             Field card, drag handle, resize handle, delete action
    PropertiesPanel.tsx           Form and field editing controls
    FormPreview.tsx               Runtime preview with validation
    fields/FormElement.tsx        Accessible renderer for each field type
  types/index.ts                  Form schema TypeScript types
  utils/schemaGenerator.ts        Zod schema generation from form schema
```

## Getting Started

### Prerequisites

- Node.js 20 or newer is recommended for the current Vite, Wrangler, and TypeScript toolchain.
- npm

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Vite will print the local development URL, usually `http://localhost:5173`.

### Build

```bash
npm run build
```

This runs TypeScript project builds and then creates the production Vite build.

### Lint

```bash
npm run lint
```

### Preview With Wrangler

```bash
npm run preview
```

This builds the app and serves it through `wrangler dev`.

### Deploy

```bash
npm run deploy
```

The deployment uses [wrangler.jsonc](./wrangler.jsonc), including SPA fallback handling via `assets.not_found_handling`.

## Form Schema

The builder stores and exports a schema shaped like this:

```ts
interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  width?: number;
  options?: FieldOption[];
  validation?: ValidationRule[];
}
```

Choice fields use `options`; most fields can be marked as required. Field width is stored as a percentage and defaults to `100` when omitted.

## Accessibility Notes

This project is intentionally accessibility-focused:

- Inputs are rendered with explicit labels.
- Help text and validation errors are connected with `aria-describedby`.
- Invalid fields expose `aria-invalid`.
- Required fields expose `aria-required` and visible/screen-reader indicators.
- Builder actions announce key drag, add, remove, and reorder events through a polite live region.
- Radio and checkbox groups use group semantics with labelled controls.

## Current Limitations

- The export modal displays JSON but does not copy or download it automatically.
- Preview submission logs data to the browser console and shows an alert.
- Additional validation rules are partially scaffolded in the schema generator and can be expanded.
- Form schemas are stored only in browser `localStorage`; there is no backend persistence.
