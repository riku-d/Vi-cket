const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "TokenMaster";
const SYMBOL = "TM";

const OCCASION_NAME = "ETH India";
const OCCASION_COST_INR = 1000; // Cost in INR
const OCCASION_MAX_TICKETS = 100;
const OCCASION_DATE = "Apr 27";
const OCCASION_TIME = "10:00AM IST";
const OCCASION_LOCATION = "Bangalore";

describe("TokenMaster", () => {
  let tokenMaster, inrUsdMock, ethUsdMock;
  let deployer, buyer;

  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners();

    // Deploy mocks for Chainlink price feeds
    const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");

    // INR/USD = 0.012 (1 INR = 0.012 USD → 1200000 with 8 decimals)
    inrUsdMock = await MockV3Aggregator.deploy(1200000);

    // ETH/USD = 3000 USD (→ 3000 * 10^8)
    ethUsdMock = await MockV3Aggregator.deploy(300000000000);

    // Deploy TokenMaster
    const TokenMaster = await ethers.getContractFactory("TokenMaster");
    tokenMaster = await TokenMaster.deploy(
      inrUsdMock.address,
      ethUsdMock.address,
      NAME,
      SYMBOL
    );

    await tokenMaster.connect(deployer).list(
      OCCASION_NAME,
      OCCASION_COST_INR,
      OCCASION_MAX_TICKETS,
      OCCASION_DATE,
      OCCASION_TIME,
      OCCASION_LOCATION
    );
  });

  describe("Deployment", () => {
    it("Sets the name", async () => {
      expect(await tokenMaster.name()).to.equal(NAME);
    });

    it("Sets the symbol", async () => {
      expect(await tokenMaster.symbol()).to.equal(SYMBOL);
    });

    it("Sets the owner", async () => {
      expect(await tokenMaster.owner()).to.equal(deployer.address);
    });
  });

  describe("Occasions", () => {
    it("Updates occasions count", async () => {
      const totalOccasions = await tokenMaster.totalOccasions();
      expect(totalOccasions).to.equal(1);
    });

    it("Returns occasions attributes", async () => {
      const occasion = await tokenMaster.getOccasion(1);
      expect(occasion.id).to.equal(1);
      expect(occasion.name).to.equal(OCCASION_NAME);
      expect(occasion.costINR).to.equal(OCCASION_COST_INR);
      expect(occasion.tickets).to.equal(OCCASION_MAX_TICKETS);
      expect(occasion.date).to.equal(OCCASION_DATE);
      expect(occasion.time).to.equal(OCCASION_TIME);
      expect(occasion.location).to.equal(OCCASION_LOCATION);
    });
  });

  describe("Minting", () => {
    const ID = 1;
    const SEAT = 50;
    let requiredETH;

    beforeEach(async () => {
      requiredETH = await tokenMaster.getCostInETH(ID);
      console.log("💰 INR to ETH:", ethers.utils.formatEther(requiredETH));

      const tx = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: requiredETH });
      await tx.wait();
    });

    it("Decrements ticket count", async () => {
      const occasion = await tokenMaster.getOccasion(ID);
      expect(occasion.tickets).to.equal(OCCASION_MAX_TICKETS - 1);
    });

    it("NFT is owned by buyer", async () => {
      const owner = await tokenMaster.ownerOf(1);
      expect(owner).to.equal(buyer.address);
    });

    it("Contract balance increases", async () => {
      const balance = await ethers.provider.getBalance(tokenMaster.address);
      expect(balance).to.equal(requiredETH);
    });

    it("Buyer marked as has bought", async () => {
      const bought = await tokenMaster.hasBought(ID, buyer.address);
      expect(bought).to.equal(true);
    });

    it("Seat is marked as taken", async () => {
      const seatOwner = await tokenMaster.seatTaken(ID, SEAT);
      expect(seatOwner).to.equal(buyer.address);
    });

    it("Seat list updated", async () => {
      const seats = await tokenMaster.getSeatsTaken(ID);
      expect(seats).to.deep.equal([SEAT]);
    });
  });

  describe("Withdraw", () => {
    const ID = 1;
    const SEAT = 50;
    let requiredETH;

    beforeEach(async () => {
      requiredETH = await tokenMaster.getCostInETH(ID);
      await tokenMaster.connect(buyer).mint(ID, SEAT, { value: requiredETH });
    });

    it("Withdraws funds to owner", async () => {
      const balanceBefore = await ethers.provider.getBalance(deployer.address);

      const tx = await tokenMaster.connect(deployer).withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.closeTo(balanceBefore.add(requiredETH).sub(gasUsed), ethers.utils.parseEther("0.01")); // Allow gas diff
    });

    it("Contract balance is zero after withdraw", async () => {
      await tokenMaster.connect(deployer).withdraw();
      const balance = await ethers.provider.getBalance(tokenMaster.address);
      expect(balance).to.equal(0);
    });
  });
});
