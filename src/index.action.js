const { Toolkit } = require('actions-toolkit');
const { initJiraAuth } = require('./jira/jira-oauth');
const { handlePullRequestChange } = require('./event-handlers/pull-request-change');

// Run your GitHub Action!
Toolkit.run(async tools => {
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

    await handlePullRequestChange(jiraConnector)(toolsAdapter);
    tools.exit.success('We did it!');
});
