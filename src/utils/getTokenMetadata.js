const ethers = require('ethers');

const WEB3_ENDPOINT = 'https://cloudflare-eth.com';

const handleError = () => {
    return undefined;
};
const getTokenMetadata = async (address) => {
    const abi = [
        'function name() view returns (string name)',
        'function symbol() view returns (string symbol)',
        'function decimals() view returns (uint8 decimals)',
        'function totalSupply() external view returns (uint256)',
        'function tokenURI(uint256 tokenId) view returns (string memory)'
    ];
    const { JsonRpcProvider } = ethers.providers;
    const provider = new JsonRpcProvider(WEB3_ENDPOINT);
    const contract = new ethers.Contract(address, abi, provider);
    const [name, symbol, decimals, totalSupply, tokenURI] = await Promise.all([
        contract.name().catch(handleError),
        contract.symbol().catch(handleError),
        contract.decimals().catch(handleError),
        contract.totalSupply().catch(handleError),
        contract.tokenURI(1).catch(handleError)
    ]);
    return { decimals, name, symbol, totalSupply, tokenURI };
};
module.exports = { getTokenMetadata };