# 🎟️ Vi-cket – Blockchain-Powered Ticketing Platform

**Vi-cket** is a next-generation IPL, concert, and event ticket booking platform combining traditional web technologies with blockchain. It enables secure seat booking, identity verification, payments in INR, and NFT-based ticket issuance, ensuring transparency, preventing fraud, and creating a tamper-proof ticketing experience.

---

## 🚀 Live Demo

🎥 [Watch on YouTube](https://www.youtube.com/watch?v=2yg2NUGDqd8)

---

## 📸 Screenshots

| Booking Flow Example                     | NFT Ticket Example                        | Seat Selection UI                               |
| ---------------------------------------- | ----------------------------------------- | ----------------------------------------------- |
| ![Booking Flow](screenshots/booking.png) | ![NFT Ticket](screenshots/nft-ticket.png) | ![Seat Selector](screenshots/seat-selector.png) |



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

## 📁 Project Structure

```
vi-cket/
├── client/           # Frontend (React + Vite)
│   ├── src/
│   ├── public/
│   ├── .env
│   └── package.json
│
├── server/           # Backend (Node + Express)
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── .env
│   └── package.json
│
├── nft-ticketing/    # NFT Smart Contracts (Hardhat)
│   ├── contracts/
│   ├── scripts/
│   ├── hardhat.config.js
│   └── package.json
│
├── screenshots/      # Screenshots for README/demo
├── README.md
└── .gitignore
```

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
const inrUsdAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ethUsdAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
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
const tokenMasterAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // ✅ Your deployed contract address
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
PORT=5000
MONGO_URI=your-mongodb-uri
CIVIC_PRIVATE_KEY=your-civic-private-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
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

