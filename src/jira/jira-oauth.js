const jira_connector = require('jira-connector');
const util = require('util');

exports.initJiraAuth = () => {
    const { 
        JIRA_HOST: host, 
        JIRA_USERNAME: username,
        JIRA_PASSWORD: password
        // jira_consumer_key, 
        // jira_private_key 
    } = process.env;
    // const getAuthorizeURL = util.promisify(
    //     jira_connector.oauth_util.getAuthorizeURL
    // ).bind(jira_connector.oauth_util);

    return new jira_connector({
        host,
        basic_auth: {
            username,
            password,
        },
        // oauth: {
        //     consumer_key,
        //     private_key, 
        // }
    });
}
