const { ConcurrencyManager } = require("axios-concurrency");
const axios = require("axios");
const {getTokenImageURL} = require("./imageURL");



// a concurrency parameter of 1 makes all api requests secuential
const MAX_CONCURRENT_REQUESTS = 30;



async function sendRequests(requestURL, batchTokenIds) {
    let new_data = [];
    let api = axios.create({
        baseURL: requestURL
    });
    let failedInRequest=0;
    const manager = ConcurrencyManager(api, MAX_CONCURRENT_REQUESTS);
    // requests will be sent in batches determined by MAX_CONCURRENT_REQUESTS
    try {
        const results = await Promise.allSettled(batchTokenIds.map(id => api.get(`/${id}`)))
        //Count failed requests
        failedInRequest = results.filter(result => (result.status==="rejected")).length
        //Remove failed requests
        const validResults = results.filter(result => !(result.status === "rejected"));
        
        //Get value field from response
        let values = validResults.map(a => a.value);

        values.forEach((value) => {
            value.data["id"] = value.config.url.split('/').pop();
            value.data.image=getTokenImageURL(value.data.image);
            new_data.push(value.data);
        })
    } catch (err) { console.log(err); }

    manager.detach()
    return {new_data, failedInRequest};
}



module.exports = { sendRequests };