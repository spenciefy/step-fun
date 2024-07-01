// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console2} from "forge-std/Script.sol";
import "../src/StepDotFun.sol";

contract StepDotFunScript is Script {
    function setUp() public {}

    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        StepDotFun localStepDotFun = new StepDotFun();
        vm.stopBroadcast();
        localStepDotFun.createCompetition(1, "Walk the Base", "https://unblock.net/wp-content/uploads/2021/11/nouns-dao-review-650x325.png", 1719809677, 1720328075, 1 /* entry fee*/);
    }
}
// https://base.org/images/ocs/buildersummer_og.png

// Nouns Walk Club,https://unblock.net/wp-content/uploads/2021/11/nouns-dao-review-650x325.png,,1720068875,1720673675,5,0