const { ConcurrencyManager } = require("axios-concurrency");
const axios = require("axios");



// a concurrency parameter of 1 makes all api requests secuential
const MAX_CONCURRENT_REQUESTS = 30;



async function sendRequests(requestURL, batchTokenIds) {
    console.log(batchTokenIds);
    let new_data = [];
    let api = axios.create({
        baseURL: requestURL
    });
    const manager = ConcurrencyManager(api, MAX_CONCURRENT_REQUESTS);
    // requests will be sent in batches determined by MAX_CONCURRENT_REQUESTS
    try {
        const results = await Promise.allSettled(batchTokenIds.map(id => api.get(`/${id}`)))
        //Remove failed requests
        const validResults = results.filter(result => !(result.status == "rejected"));

        //Get value field from response
        let values = validResults.map(a => a.value);


        values.forEach((value) => {
            value.data["id"] = value.config.url.split('/').pop();
            new_data.push(value.data);
        })
        console.log(new_data);
    } catch (err) { console.log(err); }

    manager.detach()
    return new_data;
}


module.exports = { sendRequests };