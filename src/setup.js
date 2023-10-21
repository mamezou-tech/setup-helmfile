const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const exec = require("@actions/exec");
const io = require("@actions/io");
const path = require("path");
const os = require("os");
const { compareVersions } = require("compare-versions");

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

async function installHelmPlugins(plugins) {
  for (const plugin of plugins) {
    await exec.exec(`helm plugin install ${plugin}`);
  }
}

async function installHelmfile(version) {
  if (compareVersions(version.replace(/^v/,''), "0.145.0") >= 0) {
    await installHelmfileNew(version);
  } else {
    await installHelmfileOld(version);
  }
}

async function installHelmfileOld(version) {
  const baseUrl = "https://github.com/roboll/helmfile/releases/download"
  const downloadPath = await download(`${baseUrl}/${version}/helmfile_linux_amd64`);
  await install(downloadPath, "helmfile");
}

async function installHelmfileNew(version) {
  const baseUrl = "https://github.com/helmfile/helmfile/releases/download"
  const downloadPath = await download(`${baseUrl}/${version}/helmfile_${version.replace(/^v/,'')}_linux_amd64.tar.gz`)
  const folder = await extract(downloadPath);
  console.log(folder);
  await install(`${folder}/helmfile`, "helmfile");
}

async function download(url) {
  console.log("Downloading from : " + url);
  const downloadPath = await tc.downloadTool(url);
  console.log("Finish downloading. : " + downloadPath);
  return downloadPath;
}

async function extract(downloadPath) {
  const folder = await tc.extractTar(downloadPath);
  return folder;
}

async function install(downloadPath, filename) {
  const binPath = `${os.homedir}/bin`;
  await io.mkdirP(binPath);
  await io.cp(downloadPath, path.join(binPath, filename));
  await exec.exec("chmod", ["+x", `${binPath}/${filename}`]);
  core.addPath(binPath);
}

module.exports = {
  installKubectl,
  installHelm,
  installHelmPlugins,
  installHelmfile
}
