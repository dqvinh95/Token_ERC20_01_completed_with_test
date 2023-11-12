const { loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { NomicLabsHardhatPluginError } = require("hardhat/plugins");

describe("Token Contract", function () {
    async function deployTokenFixture() {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const hardhatToken = await ethers.deployContract("Token");
        await hardhatToken.waitForDeployment();
        return { hardhatToken, owner, addr1, addr2 };
    }
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
            expect(await hardhatToken.owner()).to.equal(owner.address);
        })
        it("Should assign total supply of token to owner", async function () {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        })
    })
    describe("Transaction", function () {
        it("Should transfer tokens between accounts", async function () {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

            //Send 50 tokens from owner to address 1
            await expect(hardhatToken.transfer(addr1.address, 50)).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

            //Send 50 tokens from address 1 to address 2
            await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50)).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
        });
        it("Should emit Transfer event", async function () {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

            //Transfer 50 tokens from owner to address 1
            await expect(hardhatToken.transfer(addr1.address, 50)).to.emit(hardhatToken, "Transfer").withArgs(owner.address, addr1.address, 50);

            //Transfer 50 tokens from address 1 to address 2
            await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50)).to.emit(hardhatToken, "Transfer").withArgs(addr1.address, addr2.address, 50);
        });
        it("Should fail if account does not have enough token", async function () {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

            //Try to send 1 token from account 1 to owner
            await expect(hardhatToken.connect(addr1).transfer(owner.address, 1)).to.be.rejectedWith("Not enough tokens");

            //Check owner balance
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });


    });

});


















// it("Deployment should assign the total supply of tokens to the Owner", async function () {
//     const [owner] = await ethers.getSigners();

//     const hardhatToken = await ethers.deployContract("Token");

//     const ownerBalance = await hardhatToken.balanceOf(owner.address);

//     expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
// });

// it("Should transfer tokens between accounts", async function () {
//     const [owner, addr1, addr2] = await ethers.getSigners();

//     const hardhatToken = await ethers.deployContract("Token");

//     //Transfer 100 tokens from owner to address 1
//     await hardhatToken.transfer(addr1.address, 100);
//     expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100);

//     //Transfer 150 tokens from address 1 to address 2
//     await hardhatToken.connect(addr1).transfer(addr2, 150);
//     expect(await hardhatToken.balanceOf(addr2.address)).to.equal(150);

// })
// });