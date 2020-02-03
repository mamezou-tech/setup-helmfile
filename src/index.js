const core = require(`@actions/core`);
const { installHelmfile } = require("./setup");

async function run() {
  try {
    const helmfileVersion = core.getInput("helmfile-version");
    installHelmfile(helmfileVersion);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
