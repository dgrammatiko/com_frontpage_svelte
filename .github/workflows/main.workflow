workflow "Test ghpages" {
  on = "push"
  resolves = ["maxheld83/ghpages"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "npm run build"
} # action "Write sha" {

action "Setup Node.js for use with actions" {
  uses = "actions/setup-node@7af5963081f4115489390c8e8e31da346136cb37"
  runs = "npm run build"
}

action "maxheld83/ghpages" {
  uses = "maxheld83/ghpages"
  needs = ["Setup Node.js for use with actions"]
  secrets = ["GH_PAT"]
  env = {
    BUILD_DIR = "docs/"
  }
}# action "Write sha" {
#   uses = "actions/bin/sh@db72a46c8ce298e5d2c3a51861e20c455581524f"
#   args = ["echo $GITHUB_SHA >> public/index.html"]
# }
