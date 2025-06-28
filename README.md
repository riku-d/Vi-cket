# 🎟️ Vi-cket – Blockchain-Powered Ticketing Platform

**Vi-cket** is a next-generation event ticketing platform designed to tackle the widespread issues of fraud, fake tickets, black marketing, and lack of transparency in the current ticketing ecosystem—especially for high-demand events like IPL matches, concerts, and festivals.

### 🎯 The Problem with Traditional Ticketing:
Fake or duplicated tickets can be easily circulated, leading to revenue loss for organizers and bad experiences for attendees.

Scalpers exploit centralized systems to hoard and resell tickets at inflated prices (black marketing).

Buyers often have no verifiable proof of ticket authenticity.

Existing platforms rely heavily on manual verification, lacking a decentralized, tamper-proof solution.

### 💡 The Vi-cket Solution:
Vi-cket combines traditional web technologies with blockchain to solve these challenges by:

✅ Providing an interactive, transparent seat booking experience.  
✅ Integrating Civic Identity for robust user verification, reducing fake account-based exploitation.  
✅ Allowing secure INR payments via Razorpay, ensuring accessibility for Indian users.  
✅ Minting every ticket as a tamper-proof NFT on the blockchain, making each ticket uniquely verifiable and impossible to counterfeit.  
✅ Laying the foundation for real-time QR-based ticket validation and multi-chain support (Aptos, Starknet) in the future.  

Vi-cket empowers event organizers with better control over ticket distribution and ensures attendees have a secure, fraud-resistant, and seamless ticketing experience.

---

## 🚀 Live Demo

🎥 [Watch on YouTube](https://www.youtube.com/watch?v=2yg2NUGDqd8)

---

## 🧹 Tech Stack Overview

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| Frontend       | React.js (Vite) + TailwindCSS                |
| Backend        | Node.js + Express.js                         |
| Database       | MongoDB + Mongoose                           |
| Authentication | Civic Identity (Google + Wallet)             |
| Payments       | Razorpay (INR)                               |
| Blockchain     | Ethereum (Local Hardhat Network for Testing) |

---

## 💡 Features

✅ Civic Identity Login (Google + Wallet)  
✅ Interactive Stadium Seat Selector  
✅ Razorpay INR Payment Integration  
✅ Secure Booking Storage via MongoDB  
✅ NFT Ticket Minting (Local Hardhat Network)  
✅ Future QR Code Ticket Verification System  
✅ Designed for scalability with Aptos/Starknet roadmap  

---


## 🖥️ Full Setup Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/vi-cket.git
cd vi-cket
```

---

### 2️⃣ Frontend Setup

```bash
cd client
npm install
```

**Start Frontend**

```bash
npm run dev
```

Access Frontend at [http://localhost:5173](http://localhost:5173)

---

### 3️⃣ Backend Setup

```bash
cd ../server
npm install
```

**Start Backend**

```bash
npm run server
```

Backend runs at [http://localhost:5000](http://localhost:5000)

---

### 4️⃣ Smart Contract (NFT) Setup

```bash
cd ../nft-ticketing
npm install
```

**Compile Contracts**

```bash
npx hardhat compile
```

**Mock Deploy Price Feeds on Hardhat Local Network**

```bash
npx hardhat run scripts/mock-deploy.js
```

✅ Copy the deployed mock addresses printed in the terminal, example:

```js
// Replace with actual deployed mock addresses if using mocks
const inrUsdAddress = "0x........................................";
const ethUsdAddress = "0x........................................";
```

Update these addresses in your `deploy.js` script.

**Deploy Main Contract on Hardhat Local Network**

```bash
npx hardhat run scripts/deploy.js
```

✅ Copy the deployed contract address printed in the terminal.

**Update Occasion Listing Script**

In `scripts/occasion-list.js`

```js
const tokenMasterAddress = "0x..................................."; // ✅ Your deployed contract address
```

Run the listing script:

```bash
npx hardhat run scripts/occasion-list.js
```

**Update Backend Contract Config**

In `server/contract/TokenMaster.json`

update the Json file from nft-ticketing/artifacts/contracts/TokenMaster.sol/TokenMaster.json

---

## 🔑 Environment Variables Setup

### `client/.env.example`

```env
VITE_CIVIC_PUBLISHABLE_KEY=your-civic-public-key
VITE_RAZORPAY_KEY=your-razorpay-key
```

### `server/.env.example`

```env
MONGODB_URI=your-mongodb-connection-string
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
PRIVATE_KEY=your-wallet-private-key
CONTRACT_ADDRESS=your-deployed-contract-address
RPC_URL=http://127.0.0.1:8545
```

---

## 🔒 Prerequisites

* Node.js (v18+ recommended)
* Hardhat globally installed
* MongoDB Database running
* Civic Developer Account
* Razorpay Test Account
* MetaMask (for testing NFT interaction)

---

## ⚙️ Roadmap & Future Improvements

* [ ] Dynamic QR Code for Real-Time Ticket Validation
* [ ] Full NFT Metadata Display in MetaMask
* [ ] Improved UI/UX for mobile devices
* [ ] Admin dashboard for event organizers

---

## 🤝 Contributing

All contributions are welcome! Please fork the repo, make your changes, and submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License**.

