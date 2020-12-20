const core = require(`@actions/core`);
const { installKubectl, installHelm, installHelmPlugins, installHelmfile } = require("./setup");

async function run() {
  try {
    if (core.getInput("install-kubectl") === "yes") {
      installKubectl(core.getInput("kubectl-version"), core.getInput("kubectl-release-date"));
    }
    if (core.getInput("install-helm") === "yes") {
      installHelm(core.getInput("helm-version"));
    }
    if (core.getInput("install-helm-plugins") === "yes") {
      installHelmPlugins();
    }
    installHelmfile(core.getInput("helmfile-version"));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
