# USER API SPECIFICATION

## Register User

Endpoint: POST /api/users

Request Body:

```json
{
  "username": "example",
  "name": "exam",
  "password": "passExam"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "example",
    "name": "exam"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "Username should not be empty"
}
```

## Login User

Endpoint: POST /api/users/login

Request Body:

```json
{
  "username": "example",
  "password": "passExam"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "example",
    "name": "exam",
    "token": "token"
  }
}
```

## Get User

Endpoint: GET /api/users/current

Request Header:

- Authorization: token

Response Body:

```json
{
  "data": {
    "username": "example",
    "name": "exam"
  }
}
```

## Update User

Endpoint: PATCH /api/users/current

Request Header:

- Authorization: token

Request Body:

```json
{
  "name": "change it if you want",
  "password": "change it if you want"
}
```

Response Body:

```json
{
  "data": {
    "username": "example",
    "name": "exam"
  }
}
```

## Logout User

Endpoint: DELETE /api/users/current

Request Header:

- Authorization: token

Response Body:

```json
{
  "data": true
}
```
