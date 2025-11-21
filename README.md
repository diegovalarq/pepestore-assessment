# Pepestore - Fintoc Technical Assessment

This is a MVP implementation of the Pepestore, a simple e-commerce application that integrates Fintoc Payments.

## Architecture

The solution is divided into two parts:

1.  **Backend (`pepestore-backend`)**: A NestJS application that handles:
    *   Product catalog management (hardcoded for simplicity).
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

## Prerequisites

*   Node.js (v16+)
*   npm or yarn
*   Fintoc Account (Test Mode) with API Keys (`pk_test_...` and `sk_test_...`).

## Setup Instructions

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd pepestore-backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    *   Copy `.env.example` to `.env`.
    *   Add your Fintoc Secret Key (`sk_test_...`).
    ```bash
    cp .env.example .env
    # Edit .env and set FINTOC_SECRET_KEY
    ```
4.  Start the server:
    ```bash
    npm run start:dev
    ```
    The backend will run on `http://localhost:3000`.

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd pepestore-frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    *   Copy `.env.example` to `.env`.
    *   Add your Fintoc Public Key (`pk_test_...`).
    ```bash
    cp .env.example .env
    # Edit .env and set VITE_FINTOC_PUBLIC_KEY
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will run on `http://localhost:3001` (or similar).

## Usage Flow

1.  Open the frontend URL in your browser.
2.  Browse the catalog of snacks and drinks.
3.  Add items to your cart.
4.  Go to the Cart view and click "Pay with Fintoc".
5.  The Fintoc Widget will open.
6.  Follow the instructions in the widget (use test credentials provided in Fintoc docs).
7.  Upon success, you will see a success message and the cart will be cleared.

## Technical Decisions

*   **Monorepo-ish Structure**: Kept backend and frontend in the same repo for easier review, though they are independent projects.
*   **NestJS**: Chosen for its robust structure and TypeScript support, making it easy to scale if needed.
*   **React + Vite**: Chosen for speed of development and modern tooling.
*   **Fintoc Integration**:
    *   **Backend**: Handles the sensitive `sk_test_` key to create checkout sessions. This prevents exposing the secret key on the client.
    *   **Frontend**: Uses the `session_token` returned by the backend to initialize the widget with the public key.
*   **Webhooks**: A webhook endpoint is set up at `/payments/webhook` to listen for `checkout_session.finished`. In a production environment, this would be used to fulfill orders securely. For local testing, you would need to use a tool like `ngrok` to expose localhost to the internet and register the URL in the Fintoc Dashboard.

## Deployment

To deploy this application:

1.  **Backend**: Deploy to a service like Render, Railway, or Heroku. Set the `FINTOC_SECRET_KEY` env var.
2.  **Frontend**: Build using `npm run build` and deploy the `dist` folder to Vercel, Netlify, or AWS S3. Configure the API URL to point to your deployed backend.

## Testing Webhooks Locally

To test webhooks locally:
1.  Install `ngrok`.
2.  Run `ngrok http 3000`.
3.  Copy the https URL (e.g., `https://xyz.ngrok.io`).
4.  Go to Fintoc Dashboard > Webhooks.
5.  Add a new webhook pointing to `https://xyz.ngrok.io/payments/webhook`.
6.  Trigger a payment and check the backend logs.