@mamezou-tech/setup-helmfile
============================

![CI](https://github.com/mamezou-tech/setup-helmfile/workflows/CI/badge.svg)

Setup [helmfile](https://github.com/roboll/helmfile) with Helm and kubectl in GitHub Actions workflow.

> - The AWS version of kubectl is installed.
> - This action works on Linux.
> - Helm 2.x is not supported.
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
      uses: mamezou-tech/setup-helmfile@v0.4.0
    - name: Test
      run: |
        helmfile --version
        helm version
        kubectl version --client
```

## Optional Inputs
- `helmfile-version` : helmfile version. Default `"v0.122.1"`.
- `helm-version` : Helm version. Default `"v3.2.4"`
- `kubectl-version` : kubectl version. Default `1.15.11`
- `kubectl-release-date` : kubectl release date. Default `2020-07-08`

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
      uses: mamezou-tech/setup-helmfile@v0.4.0
      with:
        helmfile-version: "v0.118.0"
    - name: Test
      run: |
        helmfile --version
```

### Build action (for maintainer)
```
$ npm install
$ npm run package
```
> `dist/index.js` shoud be included in commit.
