// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/*  Creating a contract that takes in lots of different data types to make sure
    all types behave correctly when we parse them */

struct Crustacean {
  bool isAClam;
  string name;
  string[] diet;
}

enum OriginalTlcMember {
  TBoz,
  LeftEye
}

contract TypesPlinking {
  event TypesTaken(
    uint pantSize,
    bool areBirdsReal,
    int[2] listOTwoNums,
    Crustacean[] crustaceans,
    address papaJohnsAddress,
    OriginalTlcMember tlcMember,
    bytes1 oneByter,
    bytes dynamicByter,
    bytes[] arrayOBytes
  );

  function iTakeLotsOfTypes(
    uint pantSize,
    bool areBirdsReal,
    int[2] calldata listOTwoNums,
    Crustacean[] calldata crustaceans,
    address papaJohnsAddress,
    OriginalTlcMember tlcMember,
    bytes1 oneByter,
    bytes calldata dynamicByter,
    bytes[] memory arrayOBytes
  ) public payable returns (bool) {
    emit TypesTaken(
      pantSize,
      areBirdsReal,
      listOTwoNums,
      crustaceans,
      papaJohnsAddress,
      tlcMember,
      oneByter,
      dynamicByter,
      arrayOBytes
    );
    return true;
  }
}
