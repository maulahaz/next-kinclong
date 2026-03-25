# Workflow: Create Contract

## Goal
Create a new contract and automatically generate wash records.

## Steps
1. Validate input:
   - customerId
   - carId
   - packageType

2. Determine package logic:
   - Monthly → 4 outside + 1 inside
   - By Request → 1 wash only

3. Insert contract into database

4. Generate washes:
   - Create wash records based on quota
   - Set status = "pending"

5. Return contract with washes

## Constraints
- Do NOT allow duplicate active contract for same car
- Must use service layer (no direct DB in API)

## Output
- Contract object
- List of generated washes