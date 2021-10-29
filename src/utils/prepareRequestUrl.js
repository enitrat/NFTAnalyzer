
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
        baseURL = URI.split("ipfs://")[1].split("/1")[0];
    }
    else {
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

