
export const getTokenImageURL = (imageData) => {
    if (imageData.includes('ipfs://')) {
    return `https://ipfs.io/ipfs/${imageData.split('ipfs://')[1]}`;
  }
  return imageData;
}
