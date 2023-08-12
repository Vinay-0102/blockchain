// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers; // customers who deposited money in my bank
    mapping(address => uint) public stakingBalance; //amount deposited in bank
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public {
        owner = msg.sender;
        rwd = _rwd;
        tether = _tether;
    }

    // bank get some amount of tether from the customer

    // *****************************************************************************************
    // remember to give reward at the time depositing tokens
    function depositTokens(uint _amount) public {
        require(_amount > 0, "amount cannot be 0");
        // we transfer amount form any customer/caller
        // of the function to the our decentral bank

        tether.TransferFrom(msg.sender, address(this), _amount);

        // update deposited amount
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // update staking balance
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;

        // // reward assignment
        uint coins_alloted = (_amount / 10);
        // f(amount)
        rwd.transfer(msg.sender, coins_alloted);
    }

    // take the deposited money form bank account to myaccount

    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "staking balance cannot be less than zero");
        tether.transfer(msg.sender, balance);

        stakingBalance[msg.sender] = 0;

        isStaking[msg.sender] = false;
    }

    // only once we should give rewards
    // according to deposited money we distribute rewards

    // *** eleminate this ****
    // function issueTokens() public {
    //     require(msg.sender == owner, "caller must be owner");
    //     for (uint i = 0; i < stakers.length; i++) {
    //         address recipient = stakers[i];
    //         uint balance = stakingBalance[recipient] / 9;
    //         if (balance > 0) {
    //             rwd.transfer(recipient, balance);
    //         }
    //     }
    // }
}
