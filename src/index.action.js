const { Toolkit } = require('actions-toolkit');
const { handlePullRequestChangeGithubAction } = require('./event-handlers/pull-request-change');

// Run your GitHub Action!
Toolkit.run(handlePullRequestChangeGithubAction);
