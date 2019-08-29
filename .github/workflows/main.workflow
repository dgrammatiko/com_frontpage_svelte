workflow "Test ghpages" {
  on = "push"
  resolves = ["Deploy to GitHub Pages"]
}


action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "npm run build"
} # action "Write sha" {

action "Deploy to GitHub Pages" {
  uses = "./"
  needs = "Write sha"
  env = {
    BUILD_DIR = "public/"
  }
  secrets = ["GH_PAT"]
}

# action "Write sha" {
#   uses = "actions/bin/sh@db72a46c8ce298e5d2c3a51861e20c455581524f"
#   args = ["echo $GITHUB_SHA >> public/index.html"]
# }
