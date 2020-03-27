
const request = require("./await-request");
const config = require("./config.json");

async function getSubCountForYT(channel_id) {
    
    return await request({
        method: 'get',
        url: `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channel_id}&key=${config.yt_key}`
    });

}


module.exports = {
    getSubCountForYT
}