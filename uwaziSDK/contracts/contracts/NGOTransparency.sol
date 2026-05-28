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

    /// @notice Admin allocates contract balance to a beneficiary
    function allocateFunds(address beneficiary, uint256 amount) external {
        require(msg.sender == admin, "Only admin");
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be greater than zero");
        require(address(this).balance >= amount, "Insufficient balance");

        uint256 allocationId = allocations.length;
        allocations.push(
            Allocation({
                beneficiary: beneficiary,
                amount: amount,
                timestamp: block.timestamp,
                confirmed: false
            })
        );

        (bool success, ) = beneficiary.call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsAllocated(beneficiary, amount, allocationId);
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
}
