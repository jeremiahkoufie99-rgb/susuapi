# Susu Circle API

Express API for the Susu Circle app. Data is stored in memory
and resets when the server restarts.

## Run

    yarn install
    yarn dev

Server runs on http://localhost:5000

## Endpoints

### Groups
- GET /groups: list all groups (200)
- GET /groups/:id: get one group (200, 404)
- POST /groups: create a group, body { name, amount } (201, 400)
- DELETE /groups/:id: delete a group and its members and contributions (204, 404)

### Members
- GET /members?groupId=1: list members, optionally by group (200)
- POST /members: add a member, body { name, groupId } (201, 400, 404)
- PATCH /members/:id: update status, body { status: "paid" | "pending" } (200, 400, 404)
- DELETE /members/:id: delete a member (204, 404)

### Contributions
- GET /contributions?groupId=1: list contributions, optionally by group (200)
- POST /contributions: record one, body { groupId, memberId, amount } (201, 400, 404)

## Validation
- name is required (400)
- amount must be greater than 0 (400)
- unknown ids return 404