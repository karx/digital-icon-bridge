const request = require('./await-request');
var config = require("./config.json");

async function post_log_message(title, desc) {
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    console.log('------------------');
    var msg = await request({
        method: 'post',
        url: config.discord_webhook,
        form : JSON.stringify({
            "content" : "digital-icon-bridge",
            "embeds" : [{
                "title" : title,
                "description" : JSON.stringify(desc)
            }]
        }),
        headers: headers
        // json: true
    });
    console.log(msg);
    console.log('------------------');
}

module.exports = {
    post_log_message
}

