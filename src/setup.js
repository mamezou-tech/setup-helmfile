const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const exec = require("@actions/exec");
const io = require("@actions/io");
const path = require("path");
const os = require("os");

const binPath = `${os.homedir}/bin`;

async function installKubectl(version) {
  const baseUrl = `https://dl.k8s.io/release`;
  const downloadPath = await download(`${baseUrl}/${version}/bin/linux/amd64/kubectl`);
  await install(downloadPath, "kubectl");
}

async function installVals(version) {
  const baseUrl = "https://github.com/variantdev/vals/releases/download";
  const downloadPath = await download(`${baseUrl}/v${version}/vals_${version}_linux_amd64.tar.gz`);
  const folder = await extract(downloadPath);
  await install(`${folder}/vals`, "vals");
}

async function installSops(version) {
  const baseUrl = "https://github.com/mozilla/sops/releases/download";
  const downloadPath = await download(`${baseUrl}/${version}/sops-${version}.linux`);
  await install(downloadPath, "sops");
}

async function installHelm(version) {
  const downloadPath = await download(`https://get.helm.sh/helm-${version}-linux-amd64.tar.gz`);
  const folder = await extract(downloadPath);
  await install(`${folder}/linux-amd64/helm`, "helm");
}

async function installHelmPlugins(plugins) {
  for (const plugin of plugins) {
    await exec.exec(`${binPath}/helm plugin install ${plugin}`);
  }
}

async function installHelmfile(version) {
  const baseUrl = "https://github.com/roboll/helmfile/releases/download"
  const downloadPath = await download(`${baseUrl}/${version}/helmfile_linux_amd64`);
  await install(downloadPath, "helmfile");
}

async function download(url) {
  return await tc.downloadTool(url);
}

async function extract(downloadPath) {
  return await tc.extractTar(downloadPath);
}

async function install(downloadPath, filename) {
  await io.mkdirP(binPath);
  await io.cp(downloadPath, path.join(binPath, filename));
  await exec.exec("chmod", ["+x", `${binPath}/${filename}`]);
  core.addPath(binPath);
  console.log (`Installed ${filename} in ${binPath}`);
}

module.exports = {
  installKubectl,
  installVals,
  installSops,
  installHelm,
  installHelmPlugins,
  installHelmfile
}
