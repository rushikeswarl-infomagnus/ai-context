# API Reference

## Base URL
`http://localhost:4000`

## Response Shape (all endpoints)
```json
{ "success": true,  "data": T }
{ "success": false, "error": "message" }
```

## Endpoints

### Health
| Method | Path | Response |
|--------|------|----------|
| GET | `/health` | `{ status: "ok" }` |

### Users
| Method | Path | Body | Status | Response |
|--------|------|------|--------|----------|
| GET | `/api/users` | — | 200 | `{ success, data: User[] }` |
| POST | `/api/users` | `{ email, name? }` | 201 | `{ success, data: User }` |

**POST /api/users validation:**
```typescript
z.object({
  email: z.string().email(),       // required, valid email
  name: z.string().min(1).optional() // optional, min 1 char
})
```

### Posts
| Method | Path | Body | Status | Response |
|--------|------|------|--------|----------|
| GET | `/api/posts` | — | 200 | `{ success, data: Post[] }` (includes author) |
| POST | `/api/posts` | `{ title, content?, authorId }` | 201 | `{ success, data: Post }` |

**POST /api/posts validation:**
```typescript
z.object({
  title: z.string().min(1),       // required, min 1 char
  content: z.string().optional(),  // optional
  authorId: z.string().cuid()      // required, valid cuid
})
```

## Error Responses
| Status | Meaning | When |
|--------|---------|------|
| 400 | Validation error | Zod parse failure on request body |
| 500 | Server error | Database failure or internal error |

## Middleware Stack
Applied in this order to every request:
1. `helmet()` — security headers
2. `cors()` — cross-origin support
3. `express.json()` — JSON body parser
4. Route handlers

## REST Conventions
- Resource routes: `/api/{resource}` (plural nouns)
- `GET /api/{resource}` — list all
- `GET /api/{resource}/:id` — get single
- `POST /api/{resource}` — create
- `PATCH /api/{resource}/:id` — partial update
- `DELETE /api/{resource}/:id` — delete
