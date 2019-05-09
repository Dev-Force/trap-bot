const _ = require('lodash');
const util = require('util');
const { initJiraAuth } = require('../jira/jira-oauth');

const handlePullRequestChange = async (jiraClient, pr_title) => {
    const getIssue = util.promisify(jiraClient.issue.getIssue).bind(jiraClient.issue);
    
    // 1. split the title and get the first part of the title (PB-XXXX)
    const issueKey = _.get(pr_title.split(' '), [0]);

    try {
        if (issueKey == null) {
            throw new Error('Cannot split PR title');
        }

        // 2. Verify that issue exists in jira
        const issue = await getIssue({
            issueKey,
        });

        const status = _.get(issue, "fields.status.name");
        if(status==="Closed" || status==="Resolved") {
            throw new Exception("Issue is old and "+status);
        }

        // 3. return completed status
        return true;
    } catch (e) {
        // 3. return failed status
        return false;
    }

}

exports.handlePullRequestChangeProbot = (context) => {
    const { title, head: { sha } } = context.payload.pull_request;
    const sharedCheckOptions = {
        name: "trap-bot",
        head_sha: sha,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
    };
    const result = handlePullRequestChange(jiraConnector, title);


    if (result) {
        return context.github.checks.create(context.repo({
            ...sharedCheckOptions,
            output: {
                // title and summary must be different based on the outcome of the flow actions
                title: `Valid PR title`,
                summary: `PR title contains a jira issue`,
                text: `By default, trap-bot only checks the pull request title for JIRA issues.`
            },
            // Check docs https://developer.github.com/v3/checks/runs/#parameters
            conclusion: 'success',
        }));
    }

    return context.github.checks.create(context.repo({
        ...sharedCheckOptions,
        output: {
            // title and summary must be different based on the outcome of the flow actions
            title: `Invalid PR title`,
            summary: `PR title should contain a jira issue (PB-XXXX - PR_TITLE_HERE)`,
            text: `By default, trap-bot only checks the pull request title for JIRA issues.`
        },
        // Check docs https://developer.github.com/v3/checks/runs/#parameters
        conclusion: 'failure',
    }));
};

exports.handlePullRequestChangeGithubAction = async (tools) => {
    const jiraConnector = await initJiraAuth();

    const toolsAdapter = {
        payload: {
            pull_request: tools.context.payload.pull_request
        },
        github: {
            checks: {
                create: (obj) => {
                    return tools.github.checks.create(obj);
                }
            }
        },
        repo: (obj) => {
            return {
                ...tools.context.repo,
                ...obj,
            }
        },
    };

    const result = await handlePullRequestChange(jiraConnector, tools.context.payload.pull_request.title);

    if (result) {
        return tools.exit.success('hihi');
    } 

    return tools.exit.failure('lulu');

}
