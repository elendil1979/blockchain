/** @type import('hardhat/config').HardhatUserConfig */


require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


module.exports = {
  solidity: "0.8.19",
  etherscan: {
    apiKey: process.env.ETHERSCAN_APY_KEY,
  },
  sourcify: {
    enabled: true
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY]
    }
  }
};