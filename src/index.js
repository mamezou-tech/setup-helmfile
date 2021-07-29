const core = require(`@actions/core`);
const { installKubectl, installVals, installHelm, installHelmPlugins, installHelmfile } = require("./setup");

async function run() {
  try {
    if (core.getInput("install-kubectl") === "yes") {
      installKubectl(core.getInput("kubectl-version"), core.getInput("kubectl-release-date"));
    }
    if (core.getInput("install-vals") === "yes") {
      installVals(core.getInput("vals-version"));
    }
    if (core.getInput("install-helm") === "yes") {
      installHelm(core.getInput("helm-version"));
    }
    if (core.getInput("install-helm-plugins") === "yes") {
      installHelmPlugins([
        'https://github.com/databus23/helm-diff --version master',
        'https://github.com/hypnoglow/helm-s3.git',
      ]);
    }
    const additionalPlugins = core.getInput("additional-helm-plugins")
    if (additionalPlugins !== "") {
      installHelmPlugins(additionalPlugins.split(','));
    }
    installHelmfile(core.getInput("helmfile-version"));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
