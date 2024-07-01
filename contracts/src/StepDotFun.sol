// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * ----------------------------------------------------------------------------------------------------------------
 * ---------██████╗ ██╗   ██╗██╗██╗     ██████╗        ██████╗ ███╗   ██╗ ██████╗██╗  ██╗ █████╗ ██╗███╗   ██╗-----
 * ---------██╔══██╗██║   ██║██║██║     ██╔══██╗      ██╔═══██╗████╗  ██║██╔════╝██║  ██║██╔══██╗██║████╗  ██║-----
 * ---------██████╔╝██║   ██║██║██║     ██║  ██║█████╗██║   ██║██╔██╗ ██║██║     ███████║███████║██║██╔██╗ ██║-----
 * ---------██╔══██╗██║   ██║██║██║     ██║  ██║╚════╝██║   ██║██║╚██╗██║██║     ██╔══██║██╔══██║██║██║╚██╗██║-----
 * ---------██████╔╝╚██████╔╝██║███████╗██████╔╝      ╚██████╔╝██║ ╚████║╚██████╗██║  ██║██║  ██║██║██║ ╚████║-----
 * ---------╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝        ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝-----
 * ----------------------------------------------------------------------------------------------------------------
 * 
 * this was very hastily written in an hour by a frontend dev trying to submit a project in 8 hours - not intended for production use
 * 
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

struct Player {
    address playerAddress;
    string playerName;
}

struct Competition {
    string name;
    string bannerImageUrl;
    address[] playerAddresses;
    uint256 startTime;
    uint256 endTime;
    uint256 entryFeeUSD;
    uint256 totalBalance;
}

contract StepDotFun {
    address public owner;
    IERC20 public usdcToken;

    uint256 public competitionCount;
    mapping(uint256 => Competition) public competitions;
    mapping(uint256 => mapping(address => bool)) public hasJoined;

    event CompetitionCreated(uint256 indexed competitionId, uint256 startTime, uint256 endTime, uint256 entryFeeUSD);
    event PlayerJoined(uint256 indexed competitionId, address indexed playerAddress, string playerName);
    event PrizeClaimed(uint256 indexed competitionId, address indexed winnerAddress, uint256 prizeAmount);

    error OnlyOwner();
    error CompetitionNotActive();
    error AlreadyJoined();
    error InvalidCompetition();

    constructor() {
        owner = msg.sender;
        usdcToken = IERC20(0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert OnlyOwner();
        }
        _;
    }   

    function createCompetition(uint256 competitionId, string memory name, string memory bannerImageUrl, uint256 startTime, uint256 endTime, uint256 entryFeeUSD) public {
        Competition storage newCompetition = competitions[competitionId];
        newCompetition.name = name;
        newCompetition.bannerImageUrl = bannerImageUrl;
        newCompetition.startTime = startTime;
        newCompetition.endTime = endTime;
        newCompetition.entryFeeUSD = entryFeeUSD;
        newCompetition.totalBalance = 0;

        competitionCount++; // Increment the competition count

        emit CompetitionCreated(competitionId, startTime, endTime, entryFeeUSD);
    }

    // TODO: need to check for USDC approval for the transferFrom to work
    function joinCompetition(uint256 competitionId, string calldata playerName) public {
        Competition storage competition = competitions[competitionId];
        if (block.timestamp < competition.startTime || block.timestamp > competition.endTime) {
            revert CompetitionNotActive();
        }
        if (hasJoined[competitionId][msg.sender]) {
            revert AlreadyJoined();
        }

        // USDC has 6 decimals
        usdcToken.transferFrom(msg.sender, address(this), competition.entryFeeUSD * (10 ** 6));
        competition.playerAddresses.push(msg.sender); // Add player's address to the array

        competition.totalBalance += competition.entryFeeUSD;
        hasJoined[competitionId][msg.sender] = true;

        emit PlayerJoined(competitionId, msg.sender, playerName);
    }

    function claimPrize(uint256 competitionId, address winnerAddress) public onlyOwner {
        Competition storage competition = competitions[competitionId];
        uint256 prizeAmount = competition.totalBalance;
        competition.totalBalance = 0;

        usdcToken.transfer(winnerAddress, prizeAmount);
        emit PrizeClaimed(competitionId, winnerAddress, prizeAmount);
    }

    // Update the getCompetitions function to return an array of Competition structs in memory
    function getCompetitions() public view returns (Competition[] memory) {
        Competition[] memory allCompetitions = new Competition[](competitionCount);

        for (uint256 i = 0; i < competitionCount; i++) {
            allCompetitions[i] = competitions[i];
        }

        return allCompetitions;
    }

    function getCompetition(uint256 competitionId) public view returns (Competition memory, address[] memory) {
        Competition memory competition = competitions[competitionId];
        return (competition, competition.playerAddresses);
    }
}