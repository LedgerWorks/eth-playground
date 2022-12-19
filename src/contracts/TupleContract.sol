// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract TupleContract {

    struct Store {
        string name;
        int availableCash;
    }

    struct Item {
        string name;
        int quantity;
    }

    Store public _tupleStore;
    Item[] public _items;
    uint public _itemCount;
    int public _availableCash;
    string public _name;

    address owner;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(Store memory tupleStore, Item[] memory tupleItems) {
        owner = msg.sender;
        
        _tupleStore = tupleStore;
        for (uint i = 0; i < tupleItems.length; i++) {
            _items.push(Item({
                name: tupleItems[i].name,
                quantity: tupleItems[i].quantity
            }));
        }
        _itemCount = _items.length;
        _availableCash = tupleStore.availableCash;
        _name = tupleStore.name;
    }

    function addItem(Item calldata item) public onlyOwner {
        _items.push(Item({name: item.name, quantity: item.quantity}));
        _itemCount = _items.length;
    }

    function getAllItemsQuantity() public view returns(int) {
        int total;
        for(uint256 i = 0; i < _items.length; i++) {
            total += _items[i].quantity;
        }

        return total;
    }
}