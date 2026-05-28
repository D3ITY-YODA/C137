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