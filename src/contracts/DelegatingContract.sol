// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract CounterContract {
  int private _counter = 0;

  function increment() public payable {
    _counter += 1;
  }

  function getCounter() public view returns (int) {
    return _counter;
  }
}

contract DelegatingContract {
  int private _counter;

  function incrementProxiedCounter(address contractToCall) public payable {
    (bool success, bytes memory returnedData) = contractToCall.delegatecall(
      abi.encodeWithSignature("increment()")
    );
    require(success, "Failed to increment counter");
    _counter = abi.decode(returnedData, (int));
  }

  function getMyCounter() public view returns (int) {
    return _counter;
  }

  function getProxiedCounter(address contractToCall) public returns (int) {
    (bool success, bytes memory returnedData) = contractToCall.delegatecall(
      abi.encodeWithSignature("increment()")
    );
    require(success, "Failed to get proxied counter");
    return abi.decode(returnedData, (int));
  }
}
