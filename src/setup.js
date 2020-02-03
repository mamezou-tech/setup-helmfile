const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const exec = require("@actions/exec");
const io = require("@actions/io");
const path = require("path");

async function installKubectl(version, releaseDate) {
  const baseUrl = "https://amazon-eks.s3-us-west-2.amazonaws.com";
  const downloadPath = await download(`${baseUrl}/${version}/${releaseDate}/bin/linux/amd64/kubectl`);
  await install(downloadPath, "kubectl");
}

async function installHelm(version) {
  const downloadPath = await download(`https://get.helm.sh/helm-${version}-linux-amd64.tar.gz`);
  const folder = await extract(downloadPath);
  console.log(folder);
  await install(`${folder}/linux-amd64/helm`, "helm");
}

async function installHelmfile(version) {
  const baseUrl = "https://github.com/roboll/helmfile/releases/download"
  downloadPath = await download(`${baseUrl}/${version}/helmfile_linux_amd64`);
  await install(downloadPath, "helmfile");
}

async function download(url) {
  let downloadPath;
  console.log("Downloading from : " + url);
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
  installKubectl,
  installHelm,
  installHelmfile
}
