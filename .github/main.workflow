workflow "Build on push" {
  resolves = ["build: Build"]
  on = "push"
}

action "build: Install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "build: Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["build: Install"]
  args = "run build"
}

workflow "Publish on release" {
  on = "release"
  resolves = ["publish: Publish"]
}

action "publish: Install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "publish: Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["publish: Install"]
  args = "run build"
}

action "publish: Publish" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["publish: Build"]
  args = "run publish"
  secrets = ["NPM_AUTH_TOKEN"]
}

