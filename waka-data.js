require("tls").DEFAULT_ECDH_CURVE = "auto"
const request = require("./await-request");
const config = require("./config.json");

async function getStatsFromWaka(user_id) {
    let headers = { 'Authorization': `Basic ${config.wakaAPISecretB64}` };
    
    return await request({
        method: 'get',
        url: `https://wakatime.com/api/v1/users/${user_id}/stats/last_7_days`,
        headers: headers
    });

}


module.exports = {
    getStatsFromWaka
}