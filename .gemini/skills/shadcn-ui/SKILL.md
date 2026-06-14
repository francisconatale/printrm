---
name: shadcn-ui
description: Unified interface for searching, installing, and managing Shadcn UI components. Use when the user wants to add UI components, browse the Shadcn registry, or manage UI component configuration in a React/Next.js project.
---

# Shadcn UI

This skill integrates Shadcn UI capabilities into Gemini CLI, leveraging the Shadcn MCP server and the `shadcn` CLI.

## Core Capabilities

1. **Component Discovery**: Search the Shadcn registry for components and blocks.
2. **Installation**: Seamlessly add components to your project.
3. **Project Setup**: Initialize Shadcn UI in projects that don't have it yet.

## Working with MCP Tools

The Shadcn MCP server provides several tools that are automatically available in this workspace (after reloading):

- `mcp_shadcn_search_components`: Search for components by keyword.
- `mcp_shadcn_get_component_code`: Retrieve the source code for a specific component.
- `mcp_shadcn_install_component`: Add a component to the current project.

## Workflow: Adding a Component

1. **Search**: If unsure about the component name, use `mcp_shadcn_search_components`.
2. **Review**: Use `mcp_shadcn_get_component_code` if you need to see the implementation before installing.
3. **Install**: Use `mcp_shadcn_install_component` to add it.
4. **Configure**: If the project isn't initialized, you may need to run `npx shadcn@latest init` in the frontend directory.

## Initializing Shadcn UI

If you need to set up Shadcn UI from scratch:

1. Identify the target directory (e.g., `./frontend`).
2. Run `npx shadcn@latest init` in that directory.
3. Follow the interactive prompts (Tailwind, TypeScript, etc.).
