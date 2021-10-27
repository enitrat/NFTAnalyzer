
function CollectionInfo( {contractAddress, name, symbol, tokenURI} ){

    return(
        <div>
            <p>Contract address{contractAddress}</p>
            <p>Token URI {tokenURI}</p>
            <p>Name {name}</p>
            <p>Symbol {symbol}</p>
        </div>
    )
}

export default CollectionInfo;