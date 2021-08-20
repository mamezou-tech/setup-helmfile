const core = require(`@actions/core`);
const { installKubectl, installVals, installSops, installHelm, installHelmPlugins, installHelmfile } = require("./setup");

async function run() {
  try {
    if (core.getInput("install-kubectl") === "yes") {
      await installKubectl(core.getInput("kubectl-version"));
    }
    if (core.getInput("install-vals") === "yes") {
      await installVals(core.getInput("vals-version"));
    }
    if (core.getInput("install-sops") === "yes") {
      await installSops(core.getInput("sops-version"));
    }
    if (core.getInput("install-helm") === "yes") {
      await installHelm(core.getInput("helm-version"));
    }

    const additionalPlugins = core.getMultilineInput("additional-helm-plugins")
    console.log("Additional plugins installed: ", additionalPlugins);
    await installHelmPlugins(additionalPlugins);

    await installHelmfile(core.getInput("helmfile-version"));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
