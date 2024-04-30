// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract DemoContract{

    string private _name;
    string private _symbol;
    string private _version;

    event EmergencyEvent(address from, string value);

    constructor(string memory name_, string memory symbol_, string memory version_) {
        _name = name_;
        _symbol = symbol_;
        _version = version_;
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function version() public view virtual returns (string memory) {
        return _version;
    }

    function emergencyPause() public {
        emit EmergencyEvent(msg.sender, "emergencyPause");
    }

    function emergencyResume() public {
        emit EmergencyEvent(msg.sender, "emergencyResume");
    }
}