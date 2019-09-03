var cron = require('node-cron');
const request = require("./await-request");
const config = require("./config.json");

var mqtt = require('mqtt');
var client = mqtt.connect(config.mqttURL);
const GraphQLClient = require('graphql-request').GraphQLClient;


cron.schedule('* * * * *', async ()=> {
    console.log('Running this every minute');
    updateAboutFlutterArsenal();
    updateAboutBadana();
});

async function updateAboutBadana() {
    x = await getSubCountForYT('UC_vcKmg67vjMP7ciLnSxSHQ');
    // console.log(x);
    var yt_data = JSON.parse(x);
    if (x && yt_data.items) {
        sendUpdateToMqtt('digitalicon/amit/count', yt_data.items[0].statistics.subscriberCount);
    }
}

async function updateAboutFlutterArsenal() {
    var github_data_raw = await getDataFromGithub('flutterarsenal','FlutterArsenal');   
    console.log(github_data_raw);
    

    console.log(github_data_raw);

    if (github_data_raw) {
        sendUpdateToMqtt('digitalicon/flutter_arsenal/count', github_data_raw.repository.ref.target.history.totalCount);
    }
}

async function getSubCountForYT(channel_id) {
    
    return await request({
        method: 'get',
        url: `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channel_id}&key=${config.yt_key}`
    });

}

async function getDataFromGithub(user, repo) {
    
    let headers = {
        'Authorization': 'token ' + config.github_token,
        'User-Agent': 'flutterArsenal-cli'
    };

    var github_graph_url = "https://api.github.com/graphql";

    const g_client = new GraphQLClient(github_graph_url, {
        headers: headers
    })
    const FLUTTER_ARSENAL_GITHUB_PATH = "flutterarsenal/FlutterArsenal";
    var dataToFetch =
        `{
    repository(owner: "${user}", name: "${repo}") {
      name
      updatedAt
      assignableUsers{
        totalCount
      }
      stargazers {
        totalCount
      }
      watchers{
        totalCount
      }
      commitComments {
        totalCount
      }
      forkCount  
      ref(qualifiedName: "master") {
        target {
          ... on Commit {
            history {
              totalCount
            }
          }
        }
      }
    }
  }`;

    try {
        var data = await g_client.request(dataToFetch);
        return data;

    } catch (error) {
        console.log(error);
        return null;
    }
    return data;

}

function sendUpdateToMqtt(topic, value) {
    client.publish(topic, value.toString());
    // post_log_message(topic, value.toString());
    // console.log(topic);
    // sconsole.log(value);
}


client.on('connect', function () {
    client.subscribe('digitalicon/updates', function (err) {
        if (!err) {
            client.publish('presence', 'Hello mqtt')
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