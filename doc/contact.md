# CONTACT API SPECIFICATIPN

## Create Contact

Endpoint: POST /api/contacts
Request Header:

- Authorization: token

Request Body:

```json
{
  "first_name": "First Name",
  "last_name": "Last Name",
  "email": "example@example.com",
  "phone": "087777777777"
}
```

Response Body:

```json
{
  "data": {
    "id": 1,
    "first_name": "First Name",
    "last_name": "Last Name",
    "email": "example@example.com",
    "phone": "087777777777"
  }
}
```

## Get Contact

Endpoint: GET /api/contacts/{idContact}

Request Header:

- Authorization: token

Response Body:

```json
{
  "data": {
    "id": 1,
    "first_name": "First Name",
    "last_name": "Last Name",
    "email": "example@example.com",
    "phone": "087777777777"
  }
}
```

## Update Contact

Endpoint: PUT /api/contacts/{idContact}

Request Header:

- Authorization: token

Request Body:

```json
{
  "first_name": "First Name",
  "last_name": "Last Name",
  "email": "example@example.com",
  "phone": "087777777777"
}
```

Response Body:

```json
{
  "data": {
    "id": 1,
    "first_name": "First Name",
    "last_name": "Last Name",
    "email": "example@example.com",
    "phone": "087777777777"
  }
}
```

## Remove Contact

Endpoint: DELETE /api/contacts/{idContact}

Request Header:

- Authorization: token

Response Body:

```json
{
  "data": true
}
```

## Search Contact

Endpoint: GET /api/contacts
Request Header:

- Authorization: token

Query Parameter:

- name: search for first_name or last_name
- email: search for email
- phone: search for phone
- page: 1
- size: 10

Response Body:

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "First Name",
      "last_name": "Last Name",
      "email": "example@example.com",
      "phone": "087777777777"
    },
    {
      "id": 2,
      "first_name": "First Name",
      "last_name": "Last Name",
      "email": "example@example.com",
      "phone": "087777777777"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```
