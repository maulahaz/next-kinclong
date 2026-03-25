---
description: 
---

# Workflow: Upload Evidence

## Goal
Attach image proof after wash completion

## Steps
1. Validate:
   - washId exists
   - image file provided

2. Upload image to storage (Supabase)

3. Update wash:
   - imageUrl
   - status → "done"
   - performedBy

4. Trigger UI feedback:
   - Toast success

## Constraints
- Reject if already acknowledged
- Allow re-upload only if status != acknowledged

## Output
- Updated wash record