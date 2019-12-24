const { getEncodedCall, ether } = require('../helpers/utils');
const Identity = artifacts.require('Identity')
const Counter = artifacts.require('Counter')
const { keccak256 } = web3.utils;

require('chai')
  .use(require('chai-as-promised'))
  .should()

// const KEY_OWNER = '0x0000000000000000000000000000000000000000000000000000000000000000'
const OPERATION_CALL = 0

contract('Identity', ([identityOwner, notOwner]) => {
  let identity, counter

  beforeEach(async () => {
    // Deploy contracts
    identity = await Identity.new(identityOwner)
    counter = await Counter.new()
  })

  describe('deployment', () => {
    it('tracks the owner', async ()=>{
      // the owner address should be the identity owner, here accounts[0]
      const result = await identity.owner()
      result.should.equal(identityOwner)
    })
  })

  describe('sending Ether', () => {
    let oneEth
    let result
    let identityBalance

    beforeEach(async () => {
      oneEth = ether(1).toString()
      // Sending ether to the identity contract.
      result = await web3.eth.sendTransaction({
        from: identityOwner,
        to: identity.address,
        value: oneEth
      });
      identityBalance = await web3.eth.getBalance(identity.address);
    })

    it('should recieve ether correctly', async () => {
      identityBalance.toString().should.equal(oneEth);
    })

    it('should allow owner to send ether', async() => {
      // We have 1 ether
      identityBalance.toString().should.equal(oneEth);

      // Sending 1 ether
      await identity.execute(OPERATION_CALL, counter.address, oneEth, "0x0", {from: identityOwner}) // from defaults to accounts[0], added for clarity

      // We have 0 ether
      var zeroEth =  ether(0).toString(); // await web3.utils.toWei('0', 'ether');
      identityBalance = await web3.eth.getBalance(identity.address);
      identityBalance.toString().should.equal(zeroEth); // assert.equal(zeroEth, identityBalance);

      // contract recived 1 ether
      var counterBalance = await web3.eth.getBalance(counter.address);
      counterBalance.toString().should.equal(oneEth);
    })

  })

  describe('Calling execute', () => {
    let encodedCall
    let count

    beforeEach(async () => {
      // Counter should be 0 initially
      count = await counter.get()
      count.toString().should.equal('0')
      // assert.equal((await counter.get()).toString(), '0')
      encodedCall = getEncodedCall(counter, 'increment')
    })

    describe('success', () => {
      it('should allow the owner to call execute', async () => {
        // // Call counter.increment from identity
        await identity.execute(OPERATION_CALL, counter.address, 0, encodedCall, { from: identityOwner })
        // Check that increment was called
        count = await counter.get()
        count.toString().should.equal('1')
      })
    })

    describe('failure', () => {
      it('should not allow non-owner to call execute', async function() {
        // Calling counter.increment from identity should fail
        await identity.execute(OPERATION_CALL, counter.address, 0, encodedCall, { from: notOwner }).should.be.rejectedWith('only-owner-allowed')
        // Check that increment was not called
        count = await counter.get()
        count.toString().should.equal('0')
      })
    })

  })
})
