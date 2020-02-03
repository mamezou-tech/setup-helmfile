const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const exec = require("@actions/exec");
const io = require("@actions/io");
const path = require("path");

async function installHelmfile(version) {
  const baseURL = "https://github.com/roboll/helmfile/releases/download"
  install(`${baseURL}/${version}/helmfile_linux_amd64`, "helmfile");
}

async function install(url, filename) {
  let downloadPath;
  console.log(`Downloading ${filename} from : ` + url);
  downloadPath = await tc.downloadTool(url);
  console.log("Finish downloading. : " + downloadPath);
  const binPath = "/home/runner/bin";
  await io.mkdirP(binPath);
  await exec.exec("chmod", ["+x", downloadPath]);
  await io.mv(downloadPath, path.join(binPath, filename));
  core.addPath(binPath);
}

module.exports = {
  installHelmfile
}
