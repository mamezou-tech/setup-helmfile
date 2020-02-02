const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const exec = require("@actions/exec");
const io = require("@actions/io");
const path = require("path");

const baseURL = "https://github.com/roboll/helmfile/releases/download"

async function downloadHelmfile(version) {
  let downloadPath;
  const url = `${baseURL}/${version}/helmfile_linux_amd64`;
  console.log("downloading from : " + url);
  downloadPath = await tc.downloadTool(url);
  console.log("downloaded : " + downloadPath);
  const binPath = "/home/runner/bin";
  await io.mkdirP(binPath);
  await exec.exec("chmod", ["+x", downloadPath]);
  await io.mv(downloadPath, path.join(binPath, "helmfile"));
}

module.exports = {
  downloadHelmfile
}
