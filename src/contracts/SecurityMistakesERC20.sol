// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/*  Use this contract to introduce interesting mistakes into an ERC20 token
    This can the be used to test out security controls
*/

contract SecurityMistakesERC20 {
  // Events
  event Transfer(address indexed from, address indexed to, uint tokens);
  event Approval(address indexed tokenOwner, address indexed spender, uint tokens);

  // Token metadata
  string public constant name = "Token with Security Mistakes";
  string public constant symbol = "BAD";
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
    require(numTokens <= balances[msg.sender]);
    balances[msg.sender] -= numTokens;
    balances[receiver] += numTokens;
    // Original transfer event that is honest
    // emit Transfer(msg.sender, receiver, numTokens);
    // Transfer event with lies
    emit Transfer(msg.sender, receiver, 100000000);
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
    require(numTokens <= balanceOf(owner));
    // require(numTokens <= allowance(owner, msg.sender));
    // allowed[owner][msg.sender] -= numTokens;
    balances[owner] -= numTokens;
    balances[buyer] += numTokens;
    emit Transfer(owner, buyer, numTokens);
    return true;
  }

  function exploitableTransferFrom(
    address owner,
    address buyer,
    uint numTokens
  ) public returns (bool) {
    require(numTokens <= balanceOf(owner));
    // The next two lines commented out on purpose to create a security hole where
    // anyone can transfer anyone else's tokens
    // require(numTokens <= allowance(owner, msg.sender));
    // allowed[owner][msg.sender] -= numTokens;
    balances[owner] -= numTokens;
    balances[buyer] += numTokens;
    emit Transfer(owner, buyer, numTokens);
    return true;
  }
}
