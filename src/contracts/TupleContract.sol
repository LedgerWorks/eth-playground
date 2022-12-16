// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract TupleContract {
    struct Store {
        string name;
        int availableCash;
        string[] items;
    }

    struct Item {
        int quantity;
    }

    Store public _tupleStore;
    string[] public _items;
    uint public _itemCount;
    int public _availableCash;
    string public _name;

    address owner;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(Store memory tupleStore) {
        owner = msg.sender;
        
        _tupleStore = tupleStore;
        _items = tupleStore.items;
        _itemCount = tupleStore.items.length;
        _availableCash = tupleStore.availableCash;
        _name = tupleStore.name;
    }

    function addItem(string memory item) public onlyOwner {
        _tupleStore.items.push(item);
        _items = _tupleStore.items;
        _itemCount = _tupleStore.items.length;
    }

    // function getItemQuantity() public {
    //      Item[] storage setItems = _tupleStore.items;
    //     for(uint256 i = 0; i < _tupleStore.items.length; i++) {
    //         _quantity += _tupleStore.items[i].quantity + _quantity;
    //     }
    // }
}