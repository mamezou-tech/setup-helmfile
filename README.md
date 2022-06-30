@mamezou-tech/setup-helmfile
============================

![CI](https://github.com/mamezou-tech/setup-helmfile/workflows/CI/badge.svg)

Setup [helmfile](https://github.com/helmfile/helmfile) with Helm and kubectl in GitHub Actions workflow.

> - This action works on Linux.
> - The AWS version of kubectl will be installed.
> - Following Helm plugins will be installed
>   - helm-diff
>   - helm-s3

```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - name: Setup helmfile
      uses: mamezou-tech/setup-helmfile@v1
    - name: Test
      run: |
        helmfile --version
        helm version
        kubectl version --client
```

## Optional Inputs
- `helmfile-version` : helmfile version. Default `"v0.145.0"`.
- `helm-version` : Helm version. Default `"v3.7.2"`
- `kubectl-version` : kubectl version. Default `1.22.9`
- `kubectl-release-date` : kubectl release date. Default `2022-06-03`
- `install-kubectl` : Install kubectl. Default `yes`
- `install-helm` : Install Helm. Default `yes`
- `install-helm-plugins` : Install Helm plugins. Default `yes`
- `helm-diff-plugin-version` : Plugin version to install. Default `master`
- `helm-s3-plugin-version` : Plugin version to install. Default `master`
- `additional-helm-plugins` : A comma separated list of additional helm plugins to install. Should be a valid argument after `helm plugin install`.

> See "[Installing kubectl - Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)" for information how to specify the kubectl version.

Example with optional inputs

```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Setup helmfile
      uses: mamezou-tech/setup-helmfile@v1
      with:
        helmfile-version: "v0.135.0"
```

If you are not particular about the version of kubectl / Helm and you can use the versions pre-installed on GitHub Actions runner, you can specify inputs not to install them.

> Notice: Helm plugins will be installed in this case.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Setup helmfile
      uses: mamezou-tech/setup-helmfile@v1
      with:
        install-kubectl: no
        install-helm: no
```

If you want to install certain plugins other than the default plugins, use `additional-helm-plugins`, which accepts a comma separated list of additional plugins to install, accepting anything that can be passed to `helm plugin install`.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Setup helmfile
      uses: mamezou-tech/setup-helmfile@v1
      with:
        additional-helm-plugins: https://github.com/aslafy-z/helm-git --version 0.10.0
```

If you don't want helm plugins installed, specify `no` for `install-helm-plugins`.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Setup helmfile
      uses: mamezou-tech/setup-helmfile@v1
      with:
        install-helm-plugins: no
```

### Build action (for maintainer)
```
$ npm install
$ npm run package
```
> `dist/index.js` shoud be included in commit.
