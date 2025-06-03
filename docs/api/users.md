# Users API Documentation

This document describes the Users API endpoints available in the La Apuestada application.

## Base URL

All API endpoints are relative to your application's base URL.

```
/api/users
```

## Authentication

Currently, these endpoints do not require authentication. In a production environment, you should implement proper authentication and authorization.

## Endpoints

### Get All Users

Retrieve a paginated list of all users.

```http
GET /api/users
```

#### Query Parameters

| Parameter | Type   | Default | Description                                    |
|-----------|--------|---------|------------------------------------------------|
| `limit`   | number | 10      | Number of users to return (max: 100)          |
| `offset`  | number | 0       | Number of users to skip for pagination        |
| `name`    | string | -       | Filter users by name (case-insensitive search)|

#### Response

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Wargios",
        "createdAt": "2025-06-03T10:00:00.000Z",
        "updatedAt": "2025-06-03T10:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Gonpar",
        "createdAt": "2025-06-03T10:00:00.000Z",
        "updatedAt": "2025-06-03T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 2,
      "limit": 10,
      "offset": 0,
      "page": 1,
      "totalPages": 1
    }
  }
}
```

#### Example Requests

```bash
# Get first 10 users
curl "http://localhost:4321/api/users"

# Get users with pagination
curl "http://localhost:4321/api/users?limit=5&offset=10"

# Search users by name
curl "http://localhost:4321/api/users?name=war"

# Combined filters
curl "http://localhost:4321/api/users?name=war&limit=5"
```

### Get User by ID

Retrieve a specific user by their ID.

```http
GET /api/users/{id}
```

#### Path Parameters

| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| `id`      | number | Yes      | The unique user ID    |

#### Response

**Success (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Wargios",
      "createdAt": "2025-06-03T10:00:00.000Z",
      "updatedAt": "2025-06-03T10:00:00.000Z"
    }
  }
}
```

**User Not Found (404):**
```json
{
  "success": false,
  "error": "User not found",
  "message": "No user found with ID 999"
}
```

**Invalid ID (400):**
```json
{
  "success": false,
  "error": "Invalid user ID",
  "message": "User ID must be a valid number"
}
```

#### Example Requests

```bash
# Get user with ID 1
curl "http://localhost:4321/api/users/1"

# Get user with ID 2
curl "http://localhost:4321/api/users/2"

# Invalid ID (returns 400)
curl "http://localhost:4321/api/users/abc"

# Non-existent user (returns 404)
curl "http://localhost:4321/api/users/999"
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (user doesn't exist)
- `500` - Internal Server Error

## Data Models

### User Object

| Field       | Type   | Description                    |
|-------------|--------|--------------------------------|
| `id`        | number | Unique user identifier         |
| `name`      | string | User's display name            |
| `createdAt` | string | ISO 8601 timestamp of creation|
| `updatedAt` | string | ISO 8601 timestamp of last update|

**Note:** The `hashed_password` field is never included in API responses for security reasons.

### Pagination Object

| Field        | Type   | Description                          |
|--------------|--------|--------------------------------------|
| `total`      | number | Total number of items                |
| `limit`      | number | Number of items per page             |
| `offset`     | number | Number of items skipped              |
| `page`       | number | Current page number (1-based)        |
| `totalPages` | number | Total number of pages                |

## Testing the API

You can test these endpoints using curl, Postman, or any HTTP client. Make sure your Astro development server is running:

```bash
npm run dev
```

The API will be available at `http://localhost:4321/api/users`.

## Security Considerations

⚠️ **Important for Production:**

1. **Authentication**: Implement proper authentication for all endpoints
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Input Validation**: Add more comprehensive input validation
4. **CORS**: Configure CORS properly for cross-origin requests
5. **Logging**: Implement proper logging and monitoring
6. **Database Optimization**: Use proper database queries with indexes for better performance
