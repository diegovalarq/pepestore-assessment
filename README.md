# Pepestore - Technical Assessment

This is a MVP implementation of Pepestore, a simple e-commerce application that integrates Fintoc Payments.

## Architecture

The solution is divided into two parts:

1.  **Backend (`pepestore-backend`)**: A NestJS application that handles:
    *   Product catalog management.
    *   Payment session creation using Fintoc API.
    *   Webhook handling for payment confirmation.
2.  **Frontend (`pepestore-frontend`)**: A React (Vite) application that provides:
    *   Product catalog UI.
    *   Shopping cart functionality.
    *   Checkout process using the Fintoc Widget.

### Tech Stack

*   **Backend**: Node.js, NestJS, TypeScript.
*   **Frontend**: React, Vite, TypeScript.
*   **Integration**: Fintoc API (Payment Initiation).

## UI-UX Flow

1.  Open the deployed frontend in your browser.
2.  Browse the catalog.
3.  Add items to your cart.
4.  Go to the Cart view and click "Pay with Fintoc".
5.  The Fintoc Widget will open.
6.  Follow the instructions in the widget (use test credentials provided in Fintoc docs).
7.  Upon success, you will see a success message and the cart will be cleared.

## Technical Decisions

*   **Monorepo**: Backend and frontend in the same repo for easier review, though they are independent projects.
*   **NestJS**: Robust structure, opinionated and TypeScript support, making it easy to scale if needed.
*   **React + Vite**: Speed of development and modern tooling.
*   **Fintoc Integration**:
    *   **Backend**: Handles the sensitive `sk_test_` key to create checkout sessions. This prevents exposing the secret key on the client.
    *   **Frontend**: Uses the `session_token` returned by the backend to initialize the widget with the public key.
*   **Webhooks**: A webhook endpoint is set up at `/payments/webhook` to listen for `checkout_session.finished`. In a production environment, this would be used to fulfill orders securely. For local testing, you would need to use a tool like `ngrok` to expose localhost to the internet and register the URL in the Fintoc Dashboard.

## Room for Improvement:

- Full implementation of Webhooks for graceful event handling
- Full implementation of databases (eg. Postgres, Apache Cassandra)
- Architecture improvement for Scalability: Apache Hadoop, Elastic Search, Kafka, AWS S3, etc.)
- Load Balancers to handle large number of concurrent interactions
