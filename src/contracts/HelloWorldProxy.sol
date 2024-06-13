// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract HelloWorldProxy is ERC1967Proxy {
  constructor(address _logic) ERC1967Proxy(_logic, "") {}

  receive() external payable {}
}
