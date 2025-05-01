# Coin Your Idea

A playful onchain app that allows users to coin their ideas, powered by Base Smart Wallet and Zora SDK.

## Overview

Coin Your Idea is a playful application that demonstrates the power of blockchains by allowing users to:
- Input any idea
- Generate a coin name and metadata using OpenAI API
- Generate a unique Coin through Zora SDK
- Mint the coin as an NFT using Zora's protocol
- View and share their idea coins

## Technologies Used

- [**Base Smart Wallet**](https://docs.base.org/identity/smart-wallet/quickstart): For seamless onchain identity management
- [**Zora SDK**](https://docs.zora.co/coins): For coining content
- [**Wagmi**](https://wagmi.sh/): For building the onchain app
- **OpenAI API**: For generating coin params from ideas
- **TypeScript**: For type-safe development

## Key Components

### CoinButton Component
The `CoinButton` component is a reusable UI element that handles:
- User input for ideas
- Coin generation process
- Smart wallet connection
- Coining content
- Transaction status display

### Page Component
The main page (`page.tsx`) provides:
- A clean, intuitive interface for idea input
- Visual feedback during coin generation
- Display of generated coin details
- Integration with the Smart Wallet for authentication
- Connection to Zora's coining protocol

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
- You can use the `.env.example` to know how the structure of your `.env` should look like
- Copy .env.example, name it `.env` and set up your variables

   ```
   ENV=local or prod
   NEXT_PUBLIC_URL=your_deployment_url (http://localhost:3000 for local development)
   OPENAI_API_KEY=your_openai_api_key
   NEXT_TELEMETRY_DISABLED=1
   ```
4. Run the development server:
   ```bash
   pnpm run dev
   ```

## How It Works

1. User enters an idea
2. The application uses OpenAI to generate coin parameters (name and symbol)
3. A unique coin ID is generated
4. Coin metadata is stored and associated with the ID
5. The coin is deployed using Zora SDK

## Environment Configuration

The application supports both local and production environments:
- Local: Uses hardcoded image URLs and localhost endpoints
- Production: Uses the deployed API endpoints and dynamic image generation

## Contributing

Feel free to submit issues and enhancement requests!
# CoinSpark

A playful onchain app that allows users to transform their ideas into digital coins, powered by Base Smart Wallet and Zora SDK.

## Overview

CoinSpark is a creative application that demonstrates the power of blockchains by allowing users to:
- Input any idea
- Generate a coin name and metadata using OpenAI API
- Generate a unique Coin through Zora SDK
- Mint the coin as an NFT using Zora's protocol
- View and share their idea coins

## Technologies Used

- [**Base Smart Wallet**](https://docs.base.org/identity/smart-wallet/quickstart): For seamless onchain identity management
- [**Zora SDK**](https://docs.zora.co/coins): For coining content
- [**Wagmi**](https://wagmi.sh/): For building the onchain app
- **OpenAI API**: For generating coin params from ideas
- **TypeScript**: For type-safe development

## Key Components

### CoinButton Component
The `CoinButton` component is a reusable UI element that handles:
- User input for ideas
- Coin generation process
- Smart wallet connection
- Coining content
- Transaction status display

### Page Component
The main page (`page.tsx`) provides:
- A clean, intuitive interface for idea input
- Visual feedback during coin generation
- Display of generated coin details
- Integration with the Smart Wallet for authentication
- Connection to Zora's coining protocol

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
- You can use the `.env.example` to know how the structure of your `.env` should look like
- Copy .env.example, name it `.env` and set up your variables

   ```
   ENV=local or prod
   NEXT_PUBLIC_URL=your_deployment_url (http://localhost:3000 for local development)
   OPENAI_API_KEY=your_openai_api_key
   NEXT_TELEMETRY_DISABLED=1
   ```
4. Run the development server:
   ```bash
   pnpm run dev
   ```

## How It Works

1. User enters an idea
2. CoinSpark uses OpenAI to generate coin parameters (name and symbol)
3. A unique coin ID is generated
4. Coin metadata is stored and associated with the ID
5. The coin is deployed using Zora SDK

## Environment Configuration

CoinSpark supports both local and production environments:
- Local: Uses hardcoded image URLs and localhost endpoints
- Production: Uses the deployed API endpoints and dynamic image generation

## Contributing

Feel free to submit issues and enhancement requests to help make CoinSpark even better!