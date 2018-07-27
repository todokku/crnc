'use strict'
const Token = artifacts.require('./CurrentToken.sol');
const expectRevert = require('./exceptionUtil');

contract('CurrentToken', ([owner, communityAddress, presaleAddress, gibraltarAddress, distributorAddress]) => {

    let tokenContract;

    const communityTokens = 100000000 * Math.pow(10, 18);
    const presaleTokens = 350000000 * Math.pow(10, 18);
    const gibraltarTokens = 550000000 * Math.pow(10, 18);
    const totalSupply = 1000000000 * Math.pow(10, 18);

    beforeEach(async () => {
        tokenContract = await Token.new(communityTokens, presaleTokens, gibraltarTokens, communityAddress, presaleAddress, gibraltarAddress, distributorAddress);
    });

    describe('Verify Token Construction', () => {
        it('Should verify decimals', async () => {
            let actual = await tokenContract.decimals.call();
            assert.equal(actual, 18, 'Decimals do not match');
        });
    
        it('Should verify total supply', async () => {
            let actual = await tokenContract.totalSupply.call();
            assert.equal(actual, totalSupply, 'Total supply is incorrect');
        });
    
        it('Should verify token symbol', async () => {
            let actual = await tokenContract.symbol.call();
            assert.equal(actual, 'CRNC', 'Token symbol is incorrect');
        })
    
        it('Should verify token name', async () => {
            let actual = await tokenContract.name.call();
            assert.equal(actual, 'Current', 'Token name is incorrect');
        })
    
        it('Should verify default max batch size', async () => {
            let actual = await tokenContract.maxBatchSize.call();
            assert.equal(actual, 50, 'Default max batch size is incorrect');
        })
    
        it('Should verify an airdrop allocation address', async () => {
            let actual = await tokenContract.communityAddress.call();
            assert.equal(actual, communityAddress, 'communityTokens allocation address is incorrect')
        });
    
        it('Should verify an airdrop allocation address balance', async () => {
            let actual =  await tokenContract.balanceOf.call(communityAddress);
            assert.equal(actual, communityTokens, 'communityTokens allocation balance is incorrect');
        });
    
        it('Should verify a presale allocation address', async () => {
            let actual = await tokenContract.presaleAddress.call();
            assert.equal(actual, presaleAddress, 'Presale allocation address is incorrect');
        });
    
        it('Should verify a presale allocation address balance', async () => {
            let actual = await tokenContract.balanceOf.call(presaleAddress);
            assert.equal(actual, presaleTokens,'Presale allocation address balance is incorrect');
        });
    
        it('Should verify the foundation reserve address', async () => {
            let actual = await tokenContract.gibraltarAddress.call();
            assert.equal(actual, gibraltarAddress, 'Foundation reserve address is incorrect');
        });
    
        it('Should verify the foundation reserve balance', async () => {
            let balance = await tokenContract.balanceOf.call(gibraltarAddress);
            assert.equal(balance, gibraltarTokens,'Foundation reserve balance is incorrect');
        });

        it('incorrect supplies should revert contract deployment', async () => {
            await expectRevert(Token.new)(100000000, 700000000, 100000000, communityAddress, presaleAddress, gibraltarAddress, distributorAddress);
        })
    })
 
    describe('Max Batch Size', ()=> {
        it('Non-Owner attempting to set maxBatchSize Reverts', async () => {
            await expectRevert(tokenContract.setMaxBatchSize)(2, {from:gibraltarAddress});
        });
    
        it('Setting maxBatchSize to zero Reverts', async () => {
            await expectRevert(tokenContract.setMaxBatchSize)(0);
        });
    
        it('Setting maxBatchSize greater than 255 passes with wrapping if value is not equal to zero', async () => {
            await tokenContract.setMaxBatchSize(257);
            assert.equal(await tokenContract.maxBatchSize(), 1);
    
        });

        it('Owner setting maxBatchSize should yield Setter value', async () => {
            await tokenContract.setMaxBatchSize(150);
            assert.equal(await tokenContract.maxBatchSize(), 150);
         });
    })
});
