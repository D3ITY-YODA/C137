// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title NGOTransparency — minimal donation tracking for NGOs
/// @notice Accepts donations, lets admin allocate to beneficiaries, beneficiaries confirm receipt
contract NGOTransparency {
    address public admin;

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    struct Allocation {
        address beneficiary;
        uint256 amount;
        uint256 timestamp;
        bool confirmed;
    }

     Donation[] public donations;
    Allocation[] public allocations;

    event DonationMade(address indexed donor, uint256 amount, uint256 timestamp);
    event FundsAllocated(
        address indexed beneficiary,
        uint256 amount,
        uint256 indexed allocationId
    );
    event ReceiptConfirmed(
        uint256 indexed allocationId,
        address indexed beneficiary
    );

        constructor() {
        admin = msg.sender;
    }

    /// @notice Accept a donation in native currency (ETH/MATIC)
    function donate() external payable {
        require(msg.value > 0, "Amount must be greater than zero");

        donations.push(
            Donation({
                donor: msg.sender,
                amount: msg.value,
                timestamp: block.timestamp
            })
        );

        emit DonationMade(msg.sender, msg.value, block.timestamp);
    }
