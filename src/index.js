const core = require(`@actions/core`);
const github = require(`@actions/github`);
const {downloadHelmfile} = require("./setup");

async function run() {
  try {
    const kubeconfig = core.getInput('kubeconfig');
    console.log(kubeconfig);
    const helmfileVersion = "v0.98.2";
  
    console.log('Downloading helmfile...');
    downloadHelmfile(helmfileVersion);
  
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
