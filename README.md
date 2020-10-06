@mamezou-tech/setup-helmfile
============================

![CI](https://github.com/mamezou-tech/setup-helmfile/workflows/CI/badge.svg)

Setup [helmfile](https://github.com/roboll/helmfile) with Helm and kubectl in GitHub Actions workflow.

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
      uses: mamezou-tech/setup-helmfile@v0.5.0
    - name: Test
      run: |
        helmfile --version
        helm version
        kubectl version --client
```

## Optional Inputs
- `helmfile-version` : helmfile version. Default `"v0.126.2"`.
- `helm-version` : Helm version. Default `"v3.3.1"`
- `kubectl-version` : kubectl version. Default `1.16.13`
- `kubectl-release-date` : kubectl release date. Default `2020-08-04`
- `install-kubectl` : Install kubectl. Default `yes`
- `install-helm` : Install Helm. Default `yes`

> See "[Installing kubectl - Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)" for information how to specify the kubectl version.

Example with optional inputs

```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - name: Setup helmfile
      uses: mamezou-tech/setup-helmfile@v0.5.0
      with:
        helmfile-version: "v0.118.0"
```

If you want use default kubectl / Helm installed in GitHub Runner. you can specify inputs to not install them.

```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - name: Setup helmfile
      uses: mamezou-tech/setup-helmfile@v0.6.0
      with:
        install-kubectl: no
        install-helm: no
```

### Build action (for maintainer)
```
$ npm install
$ npm run package
```
> `dist/index.js` shoud be included in commit.
