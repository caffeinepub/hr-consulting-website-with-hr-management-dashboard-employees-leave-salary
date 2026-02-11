# Building and Deploying the HR Solutions Application

This guide covers the complete build, deployment, and verification process for the HR Solutions application.

## Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- DFX (Internet Computer SDK)

## Environment Setup

1. Ensure you have a `.env` file in the project root with the following variables:
   ```
   INTERNET_IDENTITY_URL=https://identity.ic0.app
   ```

2. For local development, you may use:
   ```
   INTERNET_IDENTITY_URL=http://localhost:4943/?canisterId=<local-ii-canister-id>
   ```

## Build Commands

### Full Setup (First Time)
