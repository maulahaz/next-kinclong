---
trigger: always_on
---

# API Rules

- Use try/catch in all routes
- Return consistent format:

{
  success: boolean,
  data?: any,
  error?: string
}

- No business logic inside route handlers