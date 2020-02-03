const core = require(`@actions/core`);
const { installHelm, installHelmfile } = require("./setup");

async function run() {
  try {
    installHelm(core.getInput("helm-version"));
    installHelmfile(core.getInput("helmfile-version"));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
