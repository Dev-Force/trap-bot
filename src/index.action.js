const { Toolkit } = require('actions-toolkit');
const { initJiraAuth } = require('./jira/jira-oauth');
const { handlePullRequestChange } = require('./event-handlers/pull-request-change');

// Run your GitHub Action!
Toolkit.run(async tools => {
    const jiraConnector = await initJiraAuth();

    await handlePullRequestChange(jiraConnector)(tools.context);
    tools.exit.success('We did it!')
});
