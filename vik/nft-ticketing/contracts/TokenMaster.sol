// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TokenMaster is ERC721URIStorage {
    using Strings for uint256;

    address public owner;
    uint256 public totalOccasions;
    uint256 public totalSupply;

    AggregatorV3Interface internal inrUsdPriceFeed;
    AggregatorV3Interface internal ethUsdPriceFeed;

    string public baseTokenURI;

    struct Occasion {
        uint256 id;
        string name;
        uint256 costINR;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    mapping(uint256 => Occasion) public occasions;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => mapping(bytes32 => address)) public seatTaken;
    mapping(uint256 => string[]) public seatsTaken;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    constructor(
        address _inrUsdPriceFeed,
        address _ethUsdPriceFeed,
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
        inrUsdPriceFeed = AggregatorV3Interface(_inrUsdPriceFeed);
        ethUsdPriceFeed = AggregatorV3Interface(_ethUsdPriceFeed);
    }

    function setBaseURI(string memory _uri) public onlyOwner {
        baseTokenURI = _uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function list(
        string memory _name,
        uint256 _costINR,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
        totalOccasions++;
        occasions[totalOccasions] = Occasion(
            totalOccasions,
            _name,
            _costINR,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location
        );
    }

    function convertINRtoETH(uint256 inrAmount) public view returns (uint256) {
        (, int256 inrUsd,,,) = inrUsdPriceFeed.latestRoundData();
        (, int256 ethUsd,,,) = ethUsdPriceFeed.latestRoundData();
        require(inrUsd > 0 && ethUsd > 0, "Invalid price feed");

        uint256 inrUsdAdjusted = uint256(inrUsd);
        uint256 ethUsdAdjusted = uint256(ethUsd);

        return (inrAmount * inrUsdAdjusted * 1e18) / ethUsdAdjusted;
    }

    function mint(uint256 _id, string memory seatLabel, uint256 seatPriceINR) public payable {
        require(_id > 0 && _id <= totalOccasions, "Invalid occasion ID");

        bytes32 seatKey = keccak256(abi.encodePacked(seatLabel));
        require(seatTaken[_id][seatKey] == address(0), "Seat already taken");

        uint256 requiredETH = convertINRtoETH(seatPriceINR);
        require(msg.value >= requiredETH, "Insufficient ETH sent");

        require(occasions[_id].tickets > 0, "No tickets left");
        occasions[_id].tickets -= 1;

        hasBought[_id][msg.sender] = true;
        seatTaken[_id][seatKey] = msg.sender;
        seatsTaken[_id].push(seatLabel);

        totalSupply++;

        _safeMint(msg.sender, totalSupply);
        _setTokenURI(totalSupply, string(abi.encodePacked(baseTokenURI, totalSupply.toString(), ".json")));
    }

    function getOccasion(uint256 _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    function getSeatsTaken(uint256 _id) public view returns (string[] memory) {
        return seatsTaken[_id];
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}
