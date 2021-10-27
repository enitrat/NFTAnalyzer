import './index.css'
function CollectionInfo({ contractAddress, name, symbol, tokenURI }) {

    return (
        <div>
            <div className="centeredContent">

                <h1 className="infoHeader">{name}</h1>
            </div>
            <div className="centeredContent">
                <h1 className="infoHeader">${symbol}</h1>

            </div>
        </div>
    )
}

export default CollectionInfo;