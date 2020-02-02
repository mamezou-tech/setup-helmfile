const core = require(`@actions/core`);
const tc = require(`@actions/tool-cache`);

const baseURL = "https://github.com/roboll/helmfile/releases/download"


async function downloadHelmfile(version) {
  let downloadPath;
  downloadPath = await tc.downloadTool(`${baseURL}/${version}/helmfile_linux_amd64`);
  console.log(downloadPath);
}

module.exports = {
  downloadHelmfile
}
