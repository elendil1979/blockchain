const { ethers } = require("hardhat");

async function main() {
    const [ deployer ] = await ethers.getSigners();

    console.log("Desplegando contrato con la cuenta: ", deployer.address);

    const token = await ethers.deployContract("Token", [1000]);

    console.log("Token address: ", await token.getAddress());
}

main()
.then( () => process.exit(0))
.catch( (error) => {
    console.log(error);
    process.exit(1);
});