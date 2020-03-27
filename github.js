const config = require("./config.json");
const GraphQLClient = require('graphql-request').GraphQLClient;

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


module.exports = {
    getDataFromGithub
}