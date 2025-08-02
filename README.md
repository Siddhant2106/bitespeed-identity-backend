# Bitespeed Identity Reconciliation Backend

A Node.js backend service that consolidates user identities based on email and phone number inputs. This service exposes an API to handle contact linking using a relational database.

## Features

- Identity reconciliation by linking contacts via email and/or phone number
- Primary and secondary contacts with linking precedence
- REST API built with Express.js and Sequelize ORM
- SQLite database (easy to set up, switchable to PostgreSQL/MySQL)
- Ready for cloud deployment (e.g., Render.com)
- JSON request body support

## Getting Started

### Prerequisites

- Node.js (v12+ recommended)
- npm (comes with Node.js)
- Git

### Installation

1. Clone the repo:
`git clone https://github.com/Siddhant2106/bitespeed-identity-backend.git`
`cd bitespeed-identity-backend`

2. Install dependencies:
`npm install`

3. Start the server locally:
`npm start`

4. 
4. The server will run on `http://localhost:3000` (or the port specified by your environment).

---

## API Usage

### POST `/identify`

Consolidate and link contacts based on input email and/or phone number.

- **Request Body:** (application/json)
```json
{
"email": "user@example.com",
"phoneNumber": "1234567890"
}
```
- **Note:** At least one of `email` or `phoneNumber` is required.

- **Response:**
```json
{
"contact": {
"primaryContactId": 1,
"emails": ["user@example.com", "secondary@example.com"],
"phoneNumbers": ["1234567890", "0987654321"],
"secondaryContactIds": [27]
}
```

### GET `/contacts`

(Optional) Retrieve all contacts stored in the database (used for debugging or review).

- **Response:**
```json
[
{
"id": 1,
"email": "user@example.com",
"phoneNumber": "1234567890",
"linkedId": null,
"linkPrecedence": "primary",
"createdAt": "2025-08-02T10:00:00Z",
"updatedAt": "2025-08-02T10:00:00Z"
}
]
```

---

## Deployment

This project is ready to deploy to cloud providers like [Render.com](https://render.com).

### Important

- The app listens on the port defined by environment variable `PORT`, fallback to `3000`.
- Use JSON body for POST requests (not form-data).

---

## Development

- Sequelize ORM powers SQLite database interactions.
- Database schema defined in `/models/contact.js`.
- API logic resides in `/index.js`.

---

## Contributing

Feel free to submit issues or pull requests to improve the project.


---

**Deployed Endpoint:**  
(Replace the example URL with your real deployed URL after deployment)

