// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MockV3Aggregator {
    int256 private price;

    uint8 public decimals;
    string public description;
    uint256 public version;

    constructor(uint8 _decimals, int256 _initialPrice) {
        decimals = _decimals;
        price = _initialPrice;
        description = "MockV3Aggregator";
        version = 1;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, price, 0, 0, 0);
    }
}
