const core = require(`@actions/core`);
const { installKubectl, installHelm, installHelmPlugins, installHelmfile, installHelmfileWrapper } = require("./setup");

async function run() {
  try {
    const [pathToCLI] = await Promise.all([
      installHelmfile(core.getInput("helmfile-version")),
      core.getInput("install-kubectl") === "yes"
        ? installKubectl(core.getInput("kubectl-version"), core.getInput("kubectl-release-date"))
        : undefined,
      core.getInput("install-helm") === "yes"
        ? installHelm(core.getInput("helm-version"))
        : undefined,
    ]);
    await Promise.all([
      core.getInput("install-helm-plugins") === "yes"
        ? installHelmPlugins()
        : undefined,
      core.getInput("install-wrapper") === "yes"
        ? installHelmfileWrapper(pathToCLI)
        : undefined,
    ]);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
