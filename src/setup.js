const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const exec = require("@actions/exec");
const io = require("@actions/io");
const path = require("path");
const os = require("os");

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

async function installHelmPlugins() {
  await exec.exec("helm plugin install https://github.com/databus23/helm-diff --version master");
  await exec.exec("helm plugin install https://github.com/hypnoglow/helm-s3.git");
}

async function installHelmfile(version) {
  const baseUrl = "https://github.com/roboll/helmfile/releases/download"
  const downloadPath = await download(`${baseUrl}/${version}/helmfile_linux_amd64`);
  return await install(downloadPath, "helmfile");
}

async function installHelmfileWrapper(pathToCLI) {
  let source, target;

  // If we're on Windows, then the executable ends with .exe
  const exeSuffix = os.platform().startsWith('win') ? '.exe' : '';

  // Rename helmfile(.exe) to helmfile-bin(.exe)
  try {
    source = [pathToCLI, `helmfile${exeSuffix}`].join(path.sep);
    target = [pathToCLI, `helmfile-bin${exeSuffix}`].join(path.sep);
    core.debug(`Moving ${source} to ${target}.`);
    await io.mv(source, target);
  } catch (e) {
    core.error(`Unable to move ${source} to ${target}.`);
    throw e;
  }

  // Install our wrapper as helmfile
  try {
    source = path.resolve([__dirname, '..', 'wrapper', 'dist', 'index.js'].join(path.sep));
    target = [pathToCLI, 'helmfile'].join(path.sep);
    core.debug(`Copying ${source} to ${target}.`);
    await io.cp(source, target);
  } catch (e) {
    core.error(`Unable to copy ${source} to ${target}.`);
    throw e;
  }

  // Export a new environment variable, so our wrapper can locate the binary
  core.exportVariable('HELMFILE_CLI_PATH', pathToCLI);
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
  const dstPath = path.join(binPath, filename);
  await io.mkdirP(binPath);
  await io.cp(downloadPath, dstPath);
  await exec.exec("chmod", ["+x", dstPath]);
  core.addPath(binPath);
  return binPath;
}

module.exports = {
  installKubectl,
  installHelm,
  installHelmPlugins,
  installHelmfile,
  installHelmfileWrapper
}
