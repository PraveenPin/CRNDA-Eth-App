/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv/config");

const { HARDHAT_PORT } = process.env;

module.exports = {
  solidity: "0.7.3",
  networks: {
    localhost: { url: `http://127.0.0.1:${HARDHAT_PORT}` },
    hardhat: {
      accounts: [{"privateKey":"0xf8df96a2e17680bd3f55d67b621c64057003858b11933c8df6a97c9ff84332ce","balance":"1000000000000000000000"},{"privateKey":"0x75c83539b21a8c71247ca45e615d11dc3ba4278e2310ca57b9de37f7d1760f41","balance":"1000000000000000000000"},{"privateKey":"0x2f9984025606ccd92d345ff0f12f756326804584253008c920afc5cdf4db4b72","balance":"1000000000000000000000"},{"privateKey":"0x33d9574572f2b65bf30bca9403444642884f9424e6657bbf5da93bccbb4ad572","balance":"1000000000000000000000"},{"privateKey":"0x6ba2cd80ae068f5e5ce965809fba3ff86325e37e6d3a5d84ca45b556e9c75f24","balance":"1000000000000000000000"},{"privateKey":"0x6e105c571fb5aaff79bac9edce109c975ab56762498fdf93986a533352787798","balance":"1000000000000000000000"},{"privateKey":"0x5fe0c06f35a131316d9888fc45f672228d17bd9936fb07d288419069a5d70659","balance":"1000000000000000000000"},{"privateKey":"0x2183689f1fd9180e4df48dc627c0c8c644dd2c5634fec0ae38e6cb7edda28642","balance":"1000000000000000000000"},{"privateKey":"0x025da21d4aea696bd8b7f33e048b2338ec53c8e1a31765b1fdc61b04299e0793","balance":"1000000000000000000000"},{"privateKey":"0xa6fe029a221efdb086781af4580d835e588258aa82856bb720b3f49473cad546","balance":"1000000000000000000000"}]
    },
  },
  paths: {
    sources: './contracts',
    tests: './__tests__/contracts',
    cache: './cache',
    artifacts: './artifacts',
  },
};