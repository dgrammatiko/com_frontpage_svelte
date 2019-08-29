workflow "New workflow" {
  resolves = ["terminal"]
  on = "push"
}

action "terminal" {
  uses = "termi"
  runs = "./copy.sh"
  secrets = ["GH_PAT"]
}
