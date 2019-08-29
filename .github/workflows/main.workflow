workflow "New workflow" {
  resolves = ["terminal"]
  on = "push"
}

action "Deploy to GitHub Pages" {
  uses = "./"
  needs = "Write sha"
  env = {
    BUILD_DIR = "public/"
  }
  secrets = ["GH_PAT"]
}
