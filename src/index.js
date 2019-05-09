const { handlePullRequestChangeProbot } = require('./event-handlers/pull-request-change');
const { initJiraAuth } = require('./jira/jira-oauth');

module.exports = async (app) => {
  // Auth steps
  // on app start perform jira auth
  const jiraConnector = await initJiraAuth();

  // Register event listeners
  app.on(
    [
      'pull_request.opened',
      'pull_request.edited',
      'pull_request.reopened',
      'pull_request.synchronize',
      // 'check_run.rerequested', ???
    ], handlePullRequestChangeProbot
  );
}
