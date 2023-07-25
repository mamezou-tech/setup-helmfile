const tc = require("@actions/tool-cache");
const exec = require("@actions/exec");
const io = require("@actions/io");
const path = require("path");
const os = require("os");
const sp = path.sep;
const { installKubectl, installHelm, installHelmfile, installHelmPlugins } = require("./setup");

describe('Normal', () => {
  let downloadToolMock;
  let cpMock;
  beforeEach(() => {
    downloadToolMock = jest.fn(async (url) => {
      console.log("fake download");
      return "kubectl";
    });
    tc.downloadTool = downloadToolMock
    tc.extractTar = jest.fn(async (path) => {
      return path;
    });
    io.mkdirP = jest.fn(async (dir) => {
      console.log(dir);
    });
    cpMock = jest.fn(async (source, dest) => {
      console.log(source + " : " + dest);
    });
    io.cp = cpMock;
    exec.exec = jest.fn(async (command, param) => {});
    addPathMock = jest.fn(async (path) => {});
  });
  test('Test installKubectl', async () => {
    await installKubectl("1.14.6", "2019-08-22");
    expect(downloadToolMock.mock.calls[0][0]).toBe("https://amazon-eks.s3-us-west-2.amazonaws.com/1.14.6/2019-08-22/bin/linux/amd64/kubectl");
    expect(cpMock.mock.calls[0][1]).toBe(`${os.homedir}${sp}bin${sp}kubectl`);
  });
  test('Test installHelm', async () => {
    await installHelm("v3.0.3");
    expect(downloadToolMock.mock.calls[0][0]).toBe("https://get.helm.sh/helm-v3.0.3-linux-amd64.tar.gz");
    expect(cpMock.mock.calls[0][1]).toBe(`${os.homedir}${sp}bin${sp}helm`);
  });
  test('Test installHelmfile', async () => {
    await installHelmfile("v0.98.3");
    expect(downloadToolMock.mock.calls[0][0]).toBe("https://github.com/roboll/helmfile/releases/download/v0.98.3/helmfile_linux_amd64");
    expect(cpMock.mock.calls[0][1]).toBe(`${os.homedir}${sp}bin${sp}helmfile`);
  });
  test('Test installHelmfile - new version', async () => {
    await installHelmfile("v0.145.0");
    expect(downloadToolMock.mock.calls[0][0]).toBe("https://github.com/helmfile/helmfile/releases/download/v0.145.0/helmfile_0.145.0_linux_amd64.tar.gz");
    expect(cpMock.mock.calls[0][1]).toBe(`${os.homedir}${sp}bin${sp}helmfile`);
  });
  test('Test installHelmfile - new version', async () => {
    await installHelmfile("v0.148.1");
    expect(downloadToolMock.mock.calls[0][0]).toBe("https://github.com/helmfile/helmfile/releases/download/v0.148.1/helmfile_0.148.1_linux_amd64.tar.gz");
    expect(cpMock.mock.calls[0][1]).toBe(`${os.homedir}${sp}bin${sp}helmfile`);
  });
});
