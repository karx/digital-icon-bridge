var cron = require('node-cron');
const request = require("./await-request");
const config = require("./config.json");

var mqtt = require('mqtt');
var client = mqtt.connect(config.mqttURL);


const { getSubCountForYT } = require("./youtube");
const { getDataFromGithub } = require("./github");
const { getStatsFromWaka } = require("./waka-data");
const { post_log_message } = require("./discord-log");

cron.schedule('* * * * *', async ()=> {
    console.log('Running this every minute');
    updateAboutFlutterArsenal();
    updateAboutBadana();
    updateAboutOfficialKrat();
    updateAboutKaaroCode();
});

async function updateAboutBadana() {
    x = await getSubCountForYT('UC_vcKmg67vjMP7ciLnSxSHQ');
    // console.log(x);
    var yt_data = JSON.parse(x);
    if (x && yt_data.items) {
        sendUpdateToMqtt('digitalicon/amit/count', yt_data.items[0].statistics.subscriberCount);
    }
}

async function updateAboutOfficialKrat() {
    x = await getSubCountForYT('UCdc3jIaoro5JMNRxTf3ttrQ');
    // console.log(x);
    var yt_data = JSON.parse(x);
    if (x && yt_data.items) {
        sendUpdateToMqtt('digitalicon/officialkrat/count', yt_data.items[0].statistics.subscriberCount);
    }
}

async function updateAboutFlutterArsenal() {
    var github_data_raw = await getDataFromGithub('flutterarsenal','FlutterArsenal');   
    console.log(github_data_raw);

    if (github_data_raw) {
        sendUpdateToMqtt('digitalicon/flutter_arsenal/count', github_data_raw.repository.ref.target.history.totalCount);
    }
}

async function updateAboutKaaroCode() {
    var waka_data_raw = await getStatsFromWaka('karx');
    let waka_stats = JSON.parse(waka_data_raw);

    let mins = parseInt(waka_stats.data.total_seconds / 60);
    console.log(mins);
    if (waka_stats) {
        sendUpdateToMqtt('digitalicon/discordakcount/count', mins);
    }
}
function sendUpdateToMqtt(topic, value) {
    client.publish(topic, value.toString());
    // post_log_message(topic, value.toString());
}


client.on('connect', function () {
    client.subscribe('digitalicon/updates', function (err) {
        if (!err) {
            client.publish('Kento/presence', 'CREAM Bridge Server')
        }
    });
    client.subscribe('digitalicon', function (err) {
        if (!err) {
            // client.publish('presence', 'Hello mqtt')
        }
    });
});

client.on('message', function (topic, message) {

    console.log(topic);
    console.log(message.toString())
    post_log_message(topic,{message});

    if (topic == "digitalicon" && message == "Ready!") {
        updateAboutBadana();
    }
});
