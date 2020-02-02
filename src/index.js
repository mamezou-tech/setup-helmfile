const core = require(`@actions/core`);
const {downloadHelmfile} = require("./setup");

async function run() {
  try {
    const helmfileVersion = core.getInput("helmfile-version");
    downloadHelmfile(helmfileVersion);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
