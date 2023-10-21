const core = require(`@actions/core`);
const { installKubectl, installHelm, installHelmPlugins, installHelmfile } = require("./setup");

async function run() {
  try {
    if (core.getInput("install-kubectl") === "yes") {
      installKubectl(core.getInput("kubectl-version"), core.getInput("kubectl-release-date"));
    }
    if (core.getInput("install-helm") === "yes") {
      await installHelm(core.getInput("helm-version"));
    }
    if (core.getInput("install-helm-plugins") === "yes") {
      installHelmPlugins([
        'https://github.com/databus23/helm-diff --version ' + core.getInput("helm-diff-plugin-version"),
        'https://github.com/hypnoglow/helm-s3.git --version ' + core.getInput("helm-s3-plugin-version"),
      ]);
    }
    const additionalPlugins = core.getInput("additional-helm-plugins")
    if (additionalPlugins !== "") {
      installHelmPlugins(additionalPlugins.split(',').map(str => str.trim()));
    }
    installHelmfile(core.getInput("helmfile-version"));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
