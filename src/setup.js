const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const exec = require("@actions/exec");
const io = require("@actions/io");
const path = require("path");

async function installHelm(version) {
  const downloadPath = await download(`https://get.helm.sh/helm-${version}-linux-amd64.tar.gz`, "helm");
  const folder = await extract(downloadPath);
  console.log(folder);
  await install(`${folder}/linux-amd64/helm`, "helm");
}

async function installHelmfile(version) {
  const baseUrl = "https://github.com/roboll/helmfile/releases/download"
  downloadPath = await download(`${baseUrl}/${version}/helmfile_linux_amd64`, "helmfile");
  await install(downloadPath, "helmfile");
}

async function download(url, filename) {
  let downloadPath;
  console.log(`Downloading ${filename} from : ` + url);
  downloadPath = await tc.downloadTool(url);
  console.log("Finish downloading. : " + downloadPath);
  return downloadPath;
}

async function extract(downloadPath) {
  const folder = await tc.extractTar(downloadPath);
  return folder;
}

async function install(downloadPath, filename) {
  const binPath = "/home/runner/bin";
  await io.mkdirP(binPath);
  await exec.exec("chmod", ["+x", downloadPath]);
  await io.mv(downloadPath, path.join(binPath, filename));
  core.addPath(binPath);
}

module.exports = {
  installHelm,
  installHelmfile
}
