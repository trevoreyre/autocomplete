workflow "Publish" {
  on = "push"
  resolves = ["Install"]
}

action "Master" {
  uses = "actions/bin/filter@b2bea0749eed6beb495a8fa194c071847af60ea1"
  args = "branch master"
}

action "Install" {
  uses = "actions/npm@e7aaefed7c9f2e83d493ff810f17fa5ccd7ed437"
  needs = ["Master"]
}
