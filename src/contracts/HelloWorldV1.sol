// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/** A stupid-simple contract that is used for testing proxy patterns */
contract HelloWorldV1 {
  event TextSet(string text);

  string public text = "hello world";

  function setText(string memory _text) public {
    text = _text;
    emit TextSet(_text);
  }
}
