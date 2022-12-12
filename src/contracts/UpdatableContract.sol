// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/*  Use the proxy contract pattern (e.g. contract that calls another contract).
    This is the way "upgradeable" contracts are implemented on chain. It's all
    a tricky ruse to give the appearance of a contract being updateable. The idea is:
    1. A v1 version of a contract is published
    2. A proxy contract is published that stores the address to v1 of the contract
    3. End users interact only with the proxy contract.
    4. If something needs to be changed, a new contract is published; we'll call that v2
    5. An "upgrade" function is called on the proxy contract to change it's internal pointer
       to the v2 address
    6. To the end user, this looks like an upgrade to the contract
    It's tricky, tricky, tricky!
*/

contract V1Subcontract {
  int private _count = 0;
  string public constant description = "I can increment and decrement by 1";

  function add(int shwiggity) public payable {
    _count += shwiggity;
  }

  function increment() public payable {
    _count += 1;
  }

  function decrement() public payable {
    _count -= 1;
  }

  function getCount() public view returns (int) {
    return _count;
  }
}

contract V2Subcontract {
  int private _count = 0;
  string public constant description = "New and improved! I can increment and decrement by 2";

  function add(int shwiggity) public payable {
    _count += shwiggity;
  }

  function increment() public payable {
    _count += 2;
  }

  function decrement() public payable {
    _count -= 2;
  }

  function getCount() public view returns (int) {
    return _count;
  }
}

contract UpdatableContract {
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

  // separation of receive and fallback is a best-practice, but not necessity
  // see: https://betterprogramming.pub/solidity-0-6-x-features-fallback-and-receive-functions-69895e3ffe
  receive() external payable {}

  fallback() external payable {
    assembly {
      let target := sload(delegateSlot)
      // (1) copy incoming call data
      calldatacopy(0x0, 0x0, calldatasize())
      // (2) forward call to logic contract
      let result := delegatecall(gas(), target, 0x0, calldatasize(), 0x0, 0)
      // (3) retrieve return data
      returndatacopy(0x0, 0x0, returndatasize())
      // (4) forward return data back to caller
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
