## Project Configuration

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Add-ons**: prettier, eslint, tailwindcss, sveltekit-adapter, mcp

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## UI design skill precedence

Use `emil-design-eng` as the primary authority for:

- whether an interaction should animate;
- animation frequency, duration, easing and motion personality;
- gesture behavior;
- performance;
- accessibility;
- component behavior.

Use `make-interfaces-feel-better` as a complementary visual-polish checklist for:

- typography;
- optical alignment;
- concentric radii;
- surface treatment;
- image outlines;
- tabular numbers;
- hit areas;
- small visual details.

When the skills disagree:

1. Product consistency and the existing design system take priority.
2. Accessibility and reduced-motion requirements take priority.
3. `emil-design-eng` decides whether and why something animates.
4. Values such as scale, duration and bounce are defaults, not immutable constants.
5. Do not add animation merely because a polish checklist recommends one.
