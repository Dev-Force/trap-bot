module.exports = (app) => {
  // Your code here
  app.log('Yay, the app was loaded!')

  // app.on('issues.opened', async (context) => {
  //   const issueComment = context.issue(
  //     { body: 'Thanks for opening this issue!' })
  //   return context.github.issues.createComment(issueComment)
  // })

  app.on([
    'pull_request.opened',
    'pull_request.edited',
    'pull_request.reopened',
    'pull_request.synchronize'
  ],async (context)=>{
    const pullRequest = context.payload.pull_request;
    const name = "Trap-Bot";
    const checkOptions = {
      name: name,
      head_branch: '', // workaround for https://github.com/octokit/rest.js/issues/874
      head_sha: pullRequest.head.sha,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      output: {
        title: `Title contains TEST`,
        summary: `The title "${pullRequest.title}" contains "TEST".`,
        text: `By default, trap-bot only checks the pull request title for the terms "[PB-XXXX]", "[BECH-XXXX]".`
      }
    }
    return context.github.checks.create(context.repo(checkOptions))
    console.log("OMG!!!!!!");
    app.log("OMG!!!");
  })
  //], handlePullRequestChange.bind(null,app));




  // async function handlePullRequestChange(app,context){
  //   const { action, pull_request: pr, repository: repo } = context.payload;
  //   const timeStart = Date.now();
  //   let log = context.log;
  //   const issueComment = context.issue(
  //     { body: 'Thanks for opening this issue!' })
  //   return context.github.pull_request.createComment(issueComment)

  // }

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
