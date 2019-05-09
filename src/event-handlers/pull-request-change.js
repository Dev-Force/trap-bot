const _ = require('lodash');
const util = require('util');

exports.handlePullRequestChange = (jiraClient) => async (context) => {
    const githubApi = context.github ? context.github : context;
    const getIssue = util.promisify(jiraClient.issue.getIssue).bind(jiraClient.issue);


    console.log('githubapi:', githubApi);
    
    // 1. get pull request title
    const { title, head: { sha } } = context.payload.pull_request;
    
    // 2. split the title and get the first part of the title (PB-XXXX)
    const issueKey = _.get(title.split(' '), [0]);

    const sharedCheckOptions = {
        name: "Trap-Bot",
        head_sha: sha,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
    };

    try {
        if (issueKey == null) {
            throw new Error('Cannot split PR title');
        }

        // 3. Verify that issue exists in jira
        const issue = await getIssue({
            issueKey,
        });

        const status = _.get(issue, "fields.status.name");
        if(status==="Closed" || status==="Resolved"){
            throw new Exception("Issue is old and "+status);
        }

        // 4. return completed status
        return githubApi.checks.create(context.repo({
            ...sharedCheckOptions,
            output: {
                // title and summary must be different based on the outcome of the flow actions
                title: `Correct PR title`,
                summary: `PR title contains a jira issue`,
                text: `By default, trap-bot only checks the pull request title for JIRA issues.`
            },
            // Check docs https://developer.github.com/v3/checks/runs/#parameters
            conclusion: 'success',
        }));
    } catch (e) {
        // 4. return failed status
        return githubApi.checks.create(context.repo({
            ...sharedCheckOptions,
            output: {
                // title and summary must be different based on the outcome of the flow actions
                title: `Incorrect PR title`,
                summary: `PR title should contain a jira issue (PB-XXXX - PR_TITLE_HERE)`,
                text: `By default, trap-bot only checks the pull request title for JIRA issues.`
            },
            // Check docs https://developer.github.com/v3/checks/runs/#parameters
            conclusion: 'failure',
        }));
    }

}
