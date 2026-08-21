const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const exec = require("@actions/exec");
const io = require("@actions/io");
const path = require("path");
const os = require("os");
const { compareVersions } = require("compare-versions");

// Aliases accepted for the `helmfile-arch` input, mapped to the architecture
// name used in helmfile's Linux release assets. helmfile only publishes
// linux_amd64, linux_arm64 and linux_386, so nothing else is accepted.
const ARCH_ALIASES = {
  amd64: "amd64",
  x64: "amd64",
  x86_64: "amd64",
  arm64: "arm64",
  aarch64: "arm64",
  "386": "386",
  i386: "386",
  ia32: "386",
  x86: "386",
};

function resolveArch(arch) {
  const requested = (arch || os.arch()).trim().toLowerCase();
  const resolved = ARCH_ALIASES[requested];
  if (!resolved) {
    throw new Error(
      `Unsupported architecture: "${requested}". Supported values are: ${Object.keys(ARCH_ALIASES).join(", ")}.`
    );
  }
  return resolved;
}

async function installKubectl(version, releaseDate) {
  const baseUrl = "https://amazon-eks.s3-us-west-2.amazonaws.com";
  const downloadPath = await download(`${baseUrl}/${version}/${releaseDate}/bin/linux/amd64/kubectl`);
  await install(downloadPath, "kubectl");
}

async function installHelm(version, downloadUrl = "https://get.helm.sh/helm-{version}-linux-amd64.tar.gz") {
  const helmDownloadUrl = downloadUrl.replaceAll("{version}", version);
  const downloadPath = await download(helmDownloadUrl);
  const folder = await extract(downloadPath);
  console.log(folder);
  await install(`${folder}/linux-amd64/helm`, "helm");
}

async function installHelmPlugins(plugins) {
  for (const plugin of plugins) {
    await exec.exec(`helm plugin install ${plugin}`);
  }
}

async function installHelmfile(version, arch) {
  const resolvedArch = resolveArch(arch);
  if (compareVersions(version.replace(/^v/,''), "0.145.0") >= 0) {
    await installHelmfileNew(version, resolvedArch);
  } else {
    await installHelmfileOld(version, resolvedArch);
  }
}

async function installHelmfileOld(version, arch) {
  const baseUrl = "https://github.com/roboll/helmfile/releases/download"
  const downloadPath = await download(`${baseUrl}/${version}/helmfile_linux_${arch}`);
  await install(downloadPath, "helmfile");
}

async function installHelmfileNew(version, arch) {
  const baseUrl = "https://github.com/helmfile/helmfile/releases/download"
  const downloadPath = await download(`${baseUrl}/${version}/helmfile_${version.replace(/^v/,'')}_linux_${arch}.tar.gz`)
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
  installHelmfile,
  resolveArch
}
