// const { assert } = require("console");
const { cursorTo } = require("readline");
const { default: Web3 } = require("web3");

const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require("chai").use(require("chai-as-promised")).should();

contract("DecentralBank", (accounts) => {
  function tokens(number) {
    return web3.utils.toWei(number, "ether");
  }
  describe("DecentralBank Deployment", async () => {
    it("Matches name successfully", async () => {
      let tether = await Tether.new();
      let rwd = await RWD.new();
      let decentralBank = await DecentralBank.new(rwd.address, tether.address);

      // transfer 1 million rewards to central bank
      await rwd.transfer(decentralBank.address, tokens("100000"));
      // give customer some 100 tethers to buy something
      // account[0] => admin
      // account[1] => customer
      await tether.transfer(accounts[1], tokens("100"), { from: accounts[0] });
    });
  });

  describe("Mock Tether Deployment", async () => {
    it("Matches name successfully", async () => {
      let tether = await Tether.new();
      const name = await tether.name();
      assert.equal(name, "Tokens");
    });
  });

  describe("Reward Token Deployment", async () => {
    it("Matches name successfully", async () => {
      let rwd = await RWD.new();
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });

  // describe("Yield Farming", async () => {
  //   it("rewards tokens for staking", async () => {
  //     let result;
  //     let tether = await Tether.new();
  //     let rwd = await RWD.new();
  //     let decentralBank = await DecentralBank.new(rwd.address, tether.address);

  //     // transfer 1 million rewards to central bank
  //     await rwd.transfer(decentralBank.address, tokens("100000"));

  //     // give 100 tether tokens to customer from owner
  //     // owner (Tether) -> to -> customer
  //     await tether.transfer(accounts[1], tokens("100"), { from: accounts[0] });

  //     result = await tether.balanceOf(accounts[1]);
  //     assert.equal(result.toString(), tokens("100"));

  //     // customer to decenralised bank
  //     await tether.approve(decentralBank.address, tokens("100"), {
  //       from: accounts[1],
  //     });

  //     // deposit => transfer from customer to bank
  //     await decentralBank.depositTokens(tokens("100"), { from: accounts[1] });
  //     result = await tether.balanceOf(accounts[1]);
  //     assert.equal(result.toString(), tokens("0"));
  //     /*
  //     // only owner can issue tokens
  //     await decentralBank.issueTokens({ from: accounts[0] });
  //     // only owner can issue tokens
  //     await decentralBank.issueTokens({ from: accounts[1] }).should.be.rejected;

  //     // withdraw our money
  //     await decentralBank.unstakeTokens({ from: accounts[1] });

  //     result = await tether.balanceOf(accounts[1]);
  //     assert.equal(result.toString(), tokens("100"));

  //     result = await tether.balanceOf(decentralBank.address);
  //     assert.equal(result.toString(), tokens("0"));
  //   */
  //   });
  // });

  describe("Checking assignment of tokens", async () => {
    it("rewards tokens for staking", async () => {
      let result;
      let tether = await Tether.new();
      let rwd = await RWD.new();
      let decentralBank = await DecentralBank.new(rwd.address, tether.address);

      await rwd.transfer(decentralBank.address, tokens("100000"));
      let bank_reward = await rwd.balanceOf(decentralBank.address);
      assert.equal(bank_reward.toString(), tokens("100000"));

      await tether.transfer(accounts[1], tokens("1000"), { from: accounts[0] });
      let custo_balance = await tether.balanceOf(accounts[1]);
      assert.equal(custo_balance.toString(), tokens("1000"));

      await tether.approve(decentralBank.address, tokens("1000"), {
        from: accounts[1],
      });
    
      
      // await decentralBank.depositTokens("10",{from:accounts[0]});
      // custo_balance = await tether.balanceOf(accounts[1]);
      // console.log(custo_balance);
      // assert.equal(custo_balance.toString(),"10");

      // let custo_rwd = await rwd.balanceOf(accounts[1]);
      // assert.equal(custo_rwd.toString(), tokens("100"));

      

      // await tether.transfer(accounts[1], tokens("100"), { from: accounts[0] });

      // await decentralBank.depositTokens(tokens("100"), { from: accounts[1] });

      // rem_amount_custo = await tether.balanceOf(accounts[1]);
      // assert.equal(rem_amount_custo.toString(), "0");

      // // transfer 1 million rewards to central bank
      // await rwd.transfer(decentralBank.address, tokens("100000"));

      // // give 100 tether tokens to customer from owner
      // // owner (Tether) -> to -> customer
      // await tether.transfer(accounts[1], tokens("100"), { from: accounts[0] });

      // result = await tether.balanceOf(accounts[1]);
      // assert.equal(result.toString(), tokens("100"));

      // // customer to decenralised bank
      // await tether.approve(decentralBank.address, tokens("100"), {
      //   from: accounts[1],
      // });

      // // deposit => transfer from customer to bank
      // await decentralBank.depositTokens(tokens("100"), { from: accounts[1] });
      // result = await tether.balanceOf(accounts[1]);
      // assert.equal(result.toString(), tokens("0"));

      // // only owner can issue tokens
      // await decentralBank.issueTokens({ from: accounts[0] });
      // // only owner can issue tokens
      // await decentralBank.issueTokens({ from: accounts[1] }).should.be.rejected;

      // // withdraw our money
      // await decentralBank.unstakeTokens({ from: accounts[1] });

      // result = await tether.balanceOf(accounts[1]);
      // assert.equal(result.toString(), tokens("100"));

      // result = await tether.balanceOf(decentralBank.address);
      // assert.equal(result.toString(), tokens("0"));
    });
  });
});
