// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract PointlessCurrencyERC20 {
  // Events
  event Transfer(address indexed from, address indexed to, uint tokens);
  event Approval(address indexed tokenOwner, address indexed spender, uint tokens);

  // Token metadata
  string public constant name = "Pointless currency with a vulnerability";
  string public constant symbol = "PNTLS";
  uint8 public constant decimals = 2;
  mapping(address => uint256) balances;
  mapping(address => mapping(address => uint256)) allowed;
  uint256 totalSupply_;

  // Functions
  constructor(uint256 total) {
    totalSupply_ = total;
    balances[msg.sender] = totalSupply_;
  }

  function balanceOf(address tokenOwner) public view returns (uint) {
    return balances[tokenOwner];
  }

  function transfer(address receiver, uint numTokens) public returns (bool) {
    require(numTokens <= balances[msg.sender], "Insufficient balance for this transfer operation");
    balances[msg.sender] -= numTokens;
    balances[receiver] += numTokens;
    emit Transfer(msg.sender, receiver, numTokens);
    return true;
  }

  function approve(address delegate, uint numTokens) public returns (bool) {
    allowed[msg.sender][delegate] = numTokens;
    emit Approval(msg.sender, delegate, numTokens);
    return true;
  }

  function allowance(address owner, address delegate) public view returns (uint) {
    return allowed[owner][delegate];
  }

  function transferFrom(address owner, address buyer, uint numTokens) public returns (bool) {
    require(numTokens <= balanceOf(owner), "Insufficient balance for this transfer operation");
    require(
      numTokens <= allowance(owner, msg.sender),
      "Insufficient allowance for this transfer operation"
    );
    balances[owner] -= numTokens;
    allowed[owner][msg.sender] -= numTokens;
    balances[buyer] += numTokens;
    emit Transfer(owner, buyer, numTokens);
    return true;
  }

  /**
   * This function exists to demo an exploit where the developer forgot to require
   * that transferFrom calls only be made when an explicit allowance is given
   */
  function specialTransferFrom(address owner, address buyer, uint numTokens) public returns (bool) {
    require(numTokens <= balanceOf(owner), "Insufficient balance for this transfer operation");
    // Missing the "require" statement that prevents anyone from transferring
    // on behalf of someone else
    balances[owner] -= numTokens;
    balances[buyer] += numTokens;
    emit Transfer(owner, buyer, numTokens);
    return true;
  }

  function totalSupply() public view returns (uint256) {
    return totalSupply_;
  }
}
