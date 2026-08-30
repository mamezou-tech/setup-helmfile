const tc = require("@actions/tool-cache");
const exec = require("@actions/exec");
const io = require("@actions/io");
const path = require("path");
const os = require("os");
const sp = path.sep;
const { installKubectl, installHelm, installHelmfile, resolveArch } = require("./setup");

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
  test('Test installHelm from Huawei', async () => {
    await installHelm("v3.0.3", "https://repo.huaweicloud.com/helm/{version}/helm-{version}-linux-amd64.tar.gz");
    expect(downloadToolMock.mock.calls[0][0]).toBe("https://repo.huaweicloud.com/helm/v3.0.3/helm-v3.0.3-linux-amd64.tar.gz");
    expect(cpMock.mock.calls[0][1]).toBe(`${os.homedir}${sp}bin${sp}helm`);
  });
  test('Test installHelmfile', async () => {
    await installHelmfile("v0.98.3", "amd64");
    expect(downloadToolMock.mock.calls[0][0]).toBe("https://github.com/roboll/helmfile/releases/download/v0.98.3/helmfile_linux_amd64");
    expect(cpMock.mock.calls[0][1]).toBe(`${os.homedir}${sp}bin${sp}helmfile`);
  });
  test('Test installHelmfile - new version (v0.145.0)', async () => {
    await installHelmfile("v0.145.0", "amd64");
    expect(downloadToolMock.mock.calls[0][0]).toBe("https://github.com/helmfile/helmfile/releases/download/v0.145.0/helmfile_0.145.0_linux_amd64.tar.gz");
    expect(cpMock.mock.calls[0][1]).toBe(`${os.homedir}${sp}bin${sp}helmfile`);
  });
  test('Test installHelmfile - new version (v0.148.1)', async () => {
    await installHelmfile("v0.148.1", "amd64");
    expect(downloadToolMock.mock.calls[0][0]).toBe("https://github.com/helmfile/helmfile/releases/download/v0.148.1/helmfile_0.148.1_linux_amd64.tar.gz");
    expect(cpMock.mock.calls[0][1]).toBe(`${os.homedir}${sp}bin${sp}helmfile`);
  });
  test('Test installHelmfile - explicit arch', async () => {
    await installHelmfile("v1.2.3", "arm64");
    expect(downloadToolMock.mock.calls[0][0]).toBe("https://github.com/helmfile/helmfile/releases/download/v1.2.3/helmfile_1.2.3_linux_arm64.tar.gz");
    expect(cpMock.mock.calls[0][1]).toBe(`${os.homedir}${sp}bin${sp}helmfile`);
  });
  test('Test installHelmfile - old version with explicit arch', async () => {
    await installHelmfile("v0.98.3", "386");
    expect(downloadToolMock.mock.calls[0][0]).toBe("https://github.com/roboll/helmfile/releases/download/v0.98.3/helmfile_linux_386");
    expect(cpMock.mock.calls[0][1]).toBe(`${os.homedir}${sp}bin${sp}helmfile`);
  });
  test('Test installHelmfile - arch alias is normalized', async () => {
    await installHelmfile("v1.2.3", " AArch64 ");
    expect(downloadToolMock.mock.calls[0][0]).toBe("https://github.com/helmfile/helmfile/releases/download/v1.2.3/helmfile_1.2.3_linux_arm64.tar.gz");
  });
  test('Test installHelmfile - 386 arch', async () => {
    await installHelmfile("v1.2.3", "i386");
    expect(downloadToolMock.mock.calls[0][0]).toBe("https://github.com/helmfile/helmfile/releases/download/v1.2.3/helmfile_1.2.3_linux_386.tar.gz");
  });
  test('Test installHelmfile - empty arch falls back to runner arch', async () => {
    await installHelmfile("v1.2.3", "");
    expect(downloadToolMock.mock.calls[0][0]).toBe(`https://github.com/helmfile/helmfile/releases/download/v1.2.3/helmfile_1.2.3_linux_${resolveArch(os.arch())}.tar.gz`);
  });
  test('Test installHelmfile - unsupported arch fails without downloading', async () => {
    await expect(installHelmfile("v1.2.3", "sparc")).rejects.toThrow(/Unsupported architecture: "sparc"/);
    expect(downloadToolMock).not.toHaveBeenCalled();
  });
});

describe('resolveArch', () => {
  test.each([
    ["amd64", "amd64"],
    ["x64", "amd64"],
    ["x86_64", "amd64"],
    ["arm64", "arm64"],
    ["aarch64", "arm64"],
    ["x86", "386"],
    ["386", "386"],
    ["ia32", "386"],
  ])('maps %s to %s', (input, expected) => {
    expect(resolveArch(input)).toBe(expected);
  });
  test('defaults to the current runner architecture', () => {
    expect(resolveArch()).toBe(resolveArch(os.arch()));
  });
  test('throws on an unknown architecture', () => {
    expect(() => resolveArch("mips")).toThrow(/Unsupported architecture/);
  });
  test('throws on 32-bit arm, which helmfile does not publish', () => {
    expect(() => resolveArch("armv7l")).toThrow(/Unsupported architecture/);
  });
});
