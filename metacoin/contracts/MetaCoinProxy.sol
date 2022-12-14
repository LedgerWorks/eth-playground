// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract MetaCoinProxy {
  // Arbitrary slot
  bytes32 private constant delegateSlot =
    0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

  constructor(address delegate) {
    updateContract(delegate);
  }

  function updateContract(address newDelegateAddress) public {
    assembly {
      sstore(delegateSlot, newDelegateAddress)
    }
  }

  function delegateContract() public view returns (address delegateContractAddress) {
    assembly {
      delegateContractAddress := sload(delegateSlot)
    }
  }

  receive() external payable {}

  fallback() external payable {
    assembly {
      let target := sload(delegateSlot)
      calldatacopy(0x0, 0x0, calldatasize())
      let result := delegatecall(gas(), target, 0x0, calldatasize(), 0x0, 0)
      returndatacopy(0x0, 0x0, returndatasize())
      switch result
      case 0 {
        revert(0, 0)
      }
      default {
        return(0, returndatasize())
      }
    }
  }
}
