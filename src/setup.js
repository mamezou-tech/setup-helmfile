const core = require(`@actions/core`);
const tc = require(`@actions/tool-cache`);

const baseURL = "https://github.com/roboll/helmfile/releases/download"


async function downloadHelmfile(version) {
  let downloadPath;
  const url = `${baseURL}/${version}/helmfile_linux_amd64`;
  console.log("downloading from : " + url);
  downloadPath = await tc.downloadTool(url);
  console.log("downloaded" + downloadPath);
}

module.exports = {
  downloadHelmfile
}
