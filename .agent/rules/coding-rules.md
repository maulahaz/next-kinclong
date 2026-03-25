---
trigger: always_on
---

# Coding Rules

- Use TypeScript strictly (no `any`)
- Use Server Components by default
- Use "use client" only when needed
- Use service layer for business logic
- Never access DB directly from UI

## Naming
- kebab-case: files
- PascalCase: components
- camelCase: variables

## Folder discipline
- API → /app/api
- Logic → /services
- DB → /lib/db