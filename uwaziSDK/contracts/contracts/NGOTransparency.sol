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

    /// @notice Beneficiary confirms they received an allocation
    function confirmReceipt(uint256 allocationId) external {
        require(allocationId < allocations.length, "Invalid allocation id");

        Allocation storage allocation = allocations[allocationId];
        require(msg.sender == allocation.beneficiary, "Only beneficiary");
        require(!allocation.confirmed, "Already confirmed");

        allocation.confirmed = true;
        emit ReceiptConfirmed(allocationId, msg.sender);
    }

    function donationsCount() external view returns (uint256) {
        return donations.length;
    }

    function allocationsCount() external view returns (uint256) {
        return allocations.length;
    }
}
