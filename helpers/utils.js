function getEncodedCall(instance, method, params = []) {
  const contract = new web3.eth.Contract(instance.abi)
  return contract.methods[method](...params).encodeABI()
}

// replaced by should.be.rejectedWith('only-owner-allowed') of chai library
async function checkErrorRevert(promise, errorMessage) {
  let txError;
  try {
    await promise;
  } catch (err) {
    txError = err;
    if (!txError.reason) {
      const message = txError.toString().split('revert ')[1];
      assert.equal(message, errorMessage);
    } else {
      assert.equal(err.reason, errorMessage);
    }
  }
  assert.exists(txError, "Transaction didn't failed");
}

async function getCoinbase() {
  return new Promise(function (resolve, reject) {
    web3.eth.getCoinbase(function (err, res) {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

const ether = (n) => {
  return new web3.utils.BN(
    web3.utils.toWei(n.toString(), 'ether')
  )
}

module.exports = {
  getEncodedCall,
  getCoinbase,
  checkErrorRevert,
  ether
};
