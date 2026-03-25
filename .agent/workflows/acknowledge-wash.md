---
description: 
---

# Workflow: Acknowledge Wash

## Goal
Customer confirms wash completion

## Steps
1. Validate:
   - wash belongs to customer
   - status = "done"

2. Update:
   - status → "acknowledged"

3. Update contract usage:
   - increment inside/outside counters

4. Check contract completion:
   IF all quota used → mark contract "completed"

## Output
- Updated wash
- Updated contract