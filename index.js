var cron = require('node-cron');
const request = require("./await-request");
const config = require("./config.json");

var mqtt = require('mqtt')
var client = mqtt.connect(config.mqttURL);


cron.schedule('* * * * *', async ()=> {
    console.log('Running this every minute');
    x = await getSubCountForYT('UC_vcKmg67vjMP7ciLnSxSHQ');
    console.log(x);
    var yt_data = JSON.parse(x);
    console.log(yt_data.items);
    console.log(yt_data.items[0].statistics.subscriberCount);
    if (x && yt_data.items) {
        sendUpdateToMqtt('digitalicon/amit/count', yt_data.items[0].statistics.subscriberCount);
    }
});


async function getSubCountForYT(channel_id) {
    
    return await request({
        method: 'get',
        url: `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channel_id}&key=${config.yt_key}`
    });

}


function sendUpdateToMqtt(topic, value) {
    client.publish(topic, value.toString());
    console.log(topic);
    console.log(value);
}


client.on('connect', function () {
    client.subscribe('digitalicon/updates', function (err) {
        if (!err) {
            client.publish('presence', 'Hello mqtt')
        }
    });
});

client.on('message', function (topic, message) {

    console.log(topic);
    console.log(message.toString())

});

