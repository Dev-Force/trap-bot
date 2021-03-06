workflow "Check for Jira Issues in Pull Request Titles" {
  on = "pull_request"
  resolves = ["debug", "trap-bot"]
}

action "debug" {
  uses = "actions/bin/debug@master"
}

action "trap-bot" {
  uses = "Dev-Force/trap-bot@develop"
  secrets = [
    "JIRA_PASSWORD",
    "JIRA_USERNAME",
    "PRIVATE_KEY",
    "WEBHOOK_SECRET",
    "GITHUB_TOKEN",
  ]
  env = {
    JIRA_HOST = "jira.taxibeat.com"
    APP_ID = "30148"
    WEBHOOK_PROXY_URL = "https://smee.io/8P8I1pHCDixbYuN"
    LOG_LEVEL = "trace"
  }
}
