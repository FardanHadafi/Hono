# ADDRESS API SPECIFICATION

## Create Address

Endpoint: POST /api/contacts/{idContact}/addresses

Request Header:

- Authorization: token

Request Body:

```json
{
  "street": "street",
  "city": "city",
  "province": "province",
  "country": "country",
  "postal_code": "666666"
}
```

Response Body:

```json
{
  "data": {
    "id": 1,
    "street": "street",
    "city": "city",
    "province": "province",
    "country": "country",
    "postal_code": "666666"
  }
}
```

## Get Address

Endpoint: GET /api/contacts/{idContact}/addresses/{idAddress}

Request Header:

- Authorization: token

Response Body:

```json
{
  "data": {
    "id": 1,
    "street": "street",
    "city": "city",
    "province": "province",
    "country": "country",
    "postal_code": "666666"
  }
}
```

## Update Address

Endpoint: PUT /api/contacts/{idContact}/addresses/{idAddress}

Request Header:

- Authorization: token

Request Body:

```json
{
  "street": "street",
  "city": "city",
  "province": "province",
  "country": "country",
  "postal_code": "666666"
}
```

Response Body:

```json
{
  "data": {
    "id": 1,
    "street": "street",
    "city": "city",
    "province": "province",
    "country": "country",
    "postal_code": "666666"
  }
}
```

## Remove Address

Endpoint: DELETE /api/contacts/{idContact}/addresses/{idAddress}

Request Header:

- Authorization: token

Response Body:

```json
{
  "data": true
}
```

## List Addresses

Endpoint: GET /api/contacts/{idContact}/addresses

Request Header:

- Authorization: token

Response Body:

```json
{
  "data": [
    {
      "id": 1,
      "street": "street",
      "city": "city",
      "province": "province",
      "country": "country",
      "postal_code": "666666"
    },
    {
      "id": 2,
      "street": "street",
      "city": "city",
      "province": "province",
      "country": "country",
      "postal_code": "666666"
    }
  ]
}
```
