const core = require(`@actions/core`);
const { installKubectl, installHelm, installHelmfile } = require("./setup");

async function run() {
  try {
    installKubectl(core.getInput("kubectl-version"), core.getInput("kubectl-release-date"));
    installHelm(core.getInput("helm-version"));
    installHelmfile(core.getInput("helmfile-version"));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
