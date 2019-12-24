const { toBN, keccak256 } = web3.utils;

require('chai')
  .use(require('chai-as-promised'))
  .should()

const KeyManager = artifacts.require('KeyManager');

contract("KeyManager", async ([identityOwner, notOwner]) => {
  const MANAGEMENT_PURPOSE = 1;
  const EXECUTION_PURPOSE = 2;
  const EXECUTION_AND_MANAGEMENT_PURPOSE = 3;
  const ECDSA_TYPE = 1;

  let keyManager;

  beforeEach(async () => {
    keyManager = await KeyManager.new();
    keyManager.initialize({from: identityOwner});
  });

  describe('Deployment', () => {

    it('should create management key for creator', async () => {
      const key = keccak256(identityOwner);
      const { _purposes, _keyType } = await keyManager.getKey(key);
      const hasManagementPurpose = await keyManager.keyHasPurpose(key, MANAGEMENT_PURPOSE);

      _keyType.toNumber().should.equal(ECDSA_TYPE);
      _purposes.toNumber().should.equal(MANAGEMENT_PURPOSE);
      hasManagementPurpose.should.equal(true); // assert.isTrue(hasExecutionPurpose);
    });

  })

  describe('Setting a key', () => {
    const key = "0x0a";

    describe('success', () => {

      it('should be able to create new key', async () => {
        await keyManager.setKey(key, EXECUTION_PURPOSE, ECDSA_TYPE);
        const { _keyType } = await keyManager.getKey(key);
        const hasExecutionPurpose = await keyManager.keyHasPurpose(key, EXECUTION_PURPOSE);
        hasExecutionPurpose.should.equal(true);
        _keyType.toNumber().should.equal(ECDSA_TYPE);
      });

      it('should be able to set multiple purposes to a key', async () => {
        await keyManager.setKey("0x0a", EXECUTION_AND_MANAGEMENT_PURPOSE, ECDSA_TYPE);

        const hasExecutionPurpose = await keyManager.keyHasPurpose("0x0a", EXECUTION_PURPOSE);
        assert.isTrue(hasExecutionPurpose);

        const hasManagementPurpose = await keyManager.keyHasPurpose("0x0a", MANAGEMENT_PURPOSE);
        assert.isTrue(hasManagementPurpose);
      });

      it('should be able to set purposes with extremely high values', async () => {
        const highestPurpose = toBN(2).pow(toBN(255)).toString();
        const secondHighestPurpose = toBN(2).pow(toBN(254)).toString();
        await keyManager.setKey("0x0a", highestPurpose, ECDSA_TYPE);

        let hasPurpose = await keyManager.keyHasPurpose("0x0a", highestPurpose);
        assert.isTrue(hasPurpose);

        hasPurpose = await keyManager.keyHasPurpose("0x0a", secondHighestPurpose);
        assert.isFalse(hasPurpose);

        const allPurposes = toBN(2).pow(toBN(256)).subn(1);
        await keyManager.setKey("0x0a", allPurposes.toString(), ECDSA_TYPE);

        hasPurpose = await keyManager.keyHasPurpose("0x0a", highestPurpose);
        assert.isTrue(hasPurpose);

        hasPurpose = await keyManager.keyHasPurpose("0x0a", secondHighestPurpose);
        assert.isTrue(hasPurpose);

        hasPurpose = await keyManager.keyHasPurpose("0x0a", 1);
        assert.isTrue(hasPurpose);
      });

    })

    describe('failure', () => {

      it('should not be able to create invalid key', async () => {
        await keyManager.setKey('0x00', EXECUTION_PURPOSE, ECDSA_TYPE).should.be.rejectedWith('invalid-key');
      });

      it('should not be able to create key if caller does not have management key', async () => {
        await keyManager.setKey("0x0a", EXECUTION_PURPOSE, ECDSA_TYPE, { from: notOwner }).should.be.rejectedWith('sender-must-have-management-key')
      });

      it('should not be able to pass purpose of not power of 2', async () => {
        await keyManager.setKey("0x0a", EXECUTION_PURPOSE, ECDSA_TYPE);

        await keyManager.keyHasPurpose("0x0a", 0).should.be.rejectedWith('purpose-must-be-power-of-2');
        await keyManager.keyHasPurpose("0x0a", 3).should.be.rejectedWith('purpose-must-be-power-of-2');
        await keyManager.keyHasPurpose("0x0a", 5).should.be.rejectedWith('purpose-must-be-power-of-2');
        await keyManager.keyHasPurpose("0x0a", 6).should.be.rejectedWith('purpose-must-be-power-of-2');
        await keyManager.keyHasPurpose("0x0a", 7).should.be.rejectedWith('purpose-must-be-power-of-2');
      });

    })

  })

  describe('Removing a key', () => {
    const key = "0x0a";

    it('should be able to remove key', async () => {
      await keyManager.setKey(key, EXECUTION_PURPOSE, ECDSA_TYPE);

      let { _keyType } = await keyManager.getKey(key);
      _keyType.toNumber().should.equal(ECDSA_TYPE);

      await keyManager.removeKey(key);
      ({ _keyType } = await keyManager.getKey(key));
      _keyType.toNumber().should.equal(0);
    });

  })

});
