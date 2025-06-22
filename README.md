# 🎟️ Vi-cket – Blockchain-Powered Ticketing Platform

**Vi-cket** is a modern IPL/concert ticket booking platform built with a Web2 frontend (React + Razorpay) and Web3 backend (Civic ID + NFT ticketing). Users can book seats, verify identity, pay in INR, and (soon) mint tickets as NFTs on Aptos or Starknet.

---

## 🧩 Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | React.js (Vite) + TailwindCSS  |
| Backend     | Node.js + Express.js           |
| Database    | MongoDB + Mongoose             |
| Auth        | Civic Identity                 |
| Payments    | Razorpay (INR)                 |
| Blockchain  | Ethereum |

---

## 📁 Folder Structure

```
vi-cket/
├── client/              # Frontend (React + Vite)
│   ├── src/
│   ├── .env
│   ├── .env.example
│   └── package.json
|
|-- nft-ticketing        # NFT Generation (Here contains the Smart Contract)
|    
├── server/              # Backend (Node + Express)
│   ├── routes/
│   ├── models/
│   ├── .env
│   ├── .env.example
│   └── package.json
├── .gitignore
├── README.md
```

---

## 🧑‍💻 Local Development Setup

### 🔽 Clone the Repository

```bash
git clone https://github.com/yourusername/vi-cket.git
cd vi-cket
```

---

## 🖥️ Frontend Setup (`client/`)

```bash
cd client
npm install
```


### ▶️ Start the frontend

```bash
npm run dev
```

Frontend will run at: [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Backend Setup (`server/`)

```bash
cd ../server
npm install
```


### ▶️ Start the backend

```bash
npm run server
```

Backend will run at: [http://localhost:5000](http://localhost:5000)

---


## 📖 `.env.example` Files

### client/.env.example

```env
VITE_CIVIC_PUBLISHABLE_KEY=your-civic-public-key
VITE_RAZORPAY_KEY=your-razorpay-key
```

### server/.env.example

```env
PORT=5000
MONGO_URI=your-mongodb-uri
CIVIC_PRIVATE_KEY=your-civic-private-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```


## 🧱 Features

- ✅ Civic Login (Google + Wallet)
- ✅ Stadium seat selector UI
- ✅ Razorpay INR payments
- ✅ MongoDB bookings and match storage
- 🔜 NFT minting (Ethereum)
- 🔜 QR code ticket verification

---


## 🚀 Smart Contract Deployment Workflow (Sepolia – Vi-cket Project)

This section outlines the step-by-step commands to compile, mock deploy, modify, and push your smart contract to the **Sepolia testnet** for the Vi-cket platform.

---

### 1️⃣ Compile Contract

```bash
npx hardhat compile
```

---

### 2️⃣ Mock Deploy on Local Hardhat Network

This helps you test that your constructor and contract logic works as expected.

```bash
npx hardhat run scripts/deploy.js
```

> Make sure `scripts/deploy.js` does **not** have `--network` specified. It uses the local in-memory Hardhat chain.

---

### 3️⃣ Modify `deploy.js`

Update `scripts/deploy.js` to use required constructor arguments or initialization values. Example:

```js
async function main() {
  const ViTicket = await ethers.getContractFactory("ViTicket");

  const viTicket = await ViTicket.deploy("Vi-cket", "VKT");
  await viTicket.deployed();

  console.log("Contract deployed to:", viTicket.address);
}
```

---

### 4️⃣ Deploy to Sepolia Network

Now deploy your updated contract to Sepolia:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

✅ Save the deployed contract address printed in the terminal.

---

### 5️⃣ Call Contract Functions (e.g., listOccasion)

If you have a script like `scripts/listOccasion.js`, run it:

```bash
npx hardhat run scripts/listOccasion.js --network sepolia
```

Or use Hardhat console:

```bash
npx hardhat console --network sepolia
```

```js
const contract = await ethers.getContractAt("ViTicket", "0xYourSepoliaContractAddress");
await contract.listOccasion();
```

---

### 6️⃣ Update Frontend & Backend

Paste the new Sepolia contract address and ABI into your app:

**client/src/constants.js**
```js
export const CONTRACT_ADDRESS = "0xYourSepoliaContractAddress";
export const CONTRACT_ABI = [/* ABI from artifacts */];
```

Also update in your backend if it's interacting via `ethers.js`.

---

### ✅ You're Live!

You now have a deployed smart contract on Sepolia, fully integrated with your Vi-cket frontend and backend, ready to test ticket minting and booking features.

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first.

---

## 📄 License

This project is licensed under the MIT License.


