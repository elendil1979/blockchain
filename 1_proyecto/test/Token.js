const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Token contract", function() {
    const SUPPLY = 1000

    async function deployTokenFixture() {
        const [ owner, addr1, addr2 ] = await ethers.getSigners();

        const tokenContract = await ethers.deployContract("Token", [SUPPLY]);

        await tokenContract.waitForDeployment();

        return { tokenContract, owner, addr1, addr2 };
    }

    describe("Despliegue", async function () {
        it("Al desplegar se debe asignar el total disponible al propietario", async function() {
            const { tokenContract, owner } = await loadFixture(deployTokenFixture);
            const ownerBalance = await tokenContract.balanceOf(owner.address);
            expect(await tokenContract.totalSupply()).to.equal(ownerBalance);
            expect(await tokenContract.totalSupply()).to.equal(SUPPLY);
        });

        it("Se debe setear al propietario correctamente", async function () {
            const { tokenContract, owner } = await loadFixture(deployTokenFixture);
            expect(await tokenContract.owner()).to.equal(owner.address);
        });
    });

    describe("Transacciones", async function () {
        it("Se puede transferir tokens entre cuentas", async function () {
            const { tokenContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
            await tokenContract.transfer(addr1.address, SUPPLY / 2);
            expect(await tokenContract.balanceOf(addr1.address)).to.equal(SUPPLY/2);
            expect(await tokenContract.balanceOf(owner.address)).to.equal(SUPPLY/2);

            await tokenContract.connect(addr1).transfer(addr2.address, SUPPLY / 2);
            expect(await tokenContract.balanceOf(addr1.address)).to.equal(0);
            expect(await tokenContract.balanceOf(addr2.address)).to.equal(SUPPLY/2);
        });

        it("Se deben emitir eventos Transfer", async function () {
            const { tokenContract, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
            await expect(tokenContract.transfer(addr1.address, SUPPLY))
                .to.emit(tokenContract, "Transfer")
                .withArgs(owner.address, addr1.address, SUPPLY);

            await expect(tokenContract.connect(addr1).transfer(addr2.address, SUPPLY))
                .to.emit(tokenContract, "Transfer")
                .withArgs(addr1.address, addr2.address, SUPPLY);
        });

        it("Debe fallar si el enviador no tiene suficientes tokens", async function () {
            const { tokenContract, owner, addr1} = await loadFixture(deployTokenFixture);
            const initialBalance = await tokenContract.balanceOf(owner.address);

            await expect(
                tokenContract.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("No tienes suficientes tokens");

            expect(await tokenContract.balanceOf(owner.address)).to.equal(initialBalance);
        });
    });
});