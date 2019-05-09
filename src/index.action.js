const { Toolkit } = require('actions-toolkit');
const { initJiraAuth } = require('./jira/jira-oauth');
const { handlePullRequestChange } = require('./event-handlers/pull-request-change');

// Run your GitHub Action!
Toolkit.run(async tools => {
    tools.log(JSON.stringify(tools.context.payload));
    const jiraConnector = await initJiraAuth();

    const toolsAdapter = {
        payload: {
            pull_request: tools.context.payload.pull_request.bind(tools.context.payload)
        },
        github: {
            checks: {
                create: tools.github.checks.create.bind(tools.github.checks)
            }
        },
        repo: (obj) => {
            return {
                ...tools.repo,
                ...obj,
            }
        },
    };

    await handlePullRequestChange(jiraConnector)(toolsAdapter);
    tools.exit.success('We did it!');
});
