
export const prepareRequestURL = async (URI) => {
    console.log(URI);
    const { useIPFS, baseURL } = unwrapURLorHash(URI);
    const requestURL = prepareURL(baseURL, useIPFS);
    return requestURL;

};


function unwrapURLorHash(URI) {
    var useIPFS = false;
    var baseURL;
    if (URI.includes("ipfs://")) {
        useIPFS = true;
        // ipfs://QwhmlzzjrnlqkJEFkn/1
        // => [ipfs://QwhmlzzjrnlqkJEFkn/1] => [QwhmlzzjrnlqkJEFkn/1] => QwhmlzzjrnlqkJEFkn
        baseURL = URI.split("ipfs://")[1].split("/1")[0];
    }
    else {
        //We'll always look for token number 1 in collection
        //So the base URL without the accessed ressource will be without the /1
        baseURL = URI.split("/1")[0];
    }
    return { useIPFS, baseURL };
};

const prepareURL = (baseURL, useIPFS) => {
    let requestURL;
    if (!useIPFS) {
        requestURL = `${baseURL}`
    }
    else {
        requestURL = `https://ipfs.io/ipfs/${baseURL}`
    }
    return requestURL;
};

