@mamezou-tech/setup-helmfile
============================

![CI](https://github.com/mamezou-tech/setup-helmfile/workflows/CI/badge.svg)

Setup [helmfile](https://github.com/roboll/helmfile) with Helm and kubectl in GitHub Actions workflow.

> - The AWS version of kubectl is installed.
> - This action works on Linux.
> - Helm 2.x is not supported.

```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - name: Setup helmfile
      uses: mamezou-tech/setup-helmfile@v0.2.3
    - name: Test
      run: |
        helmfile --version
        helm version
        kubectl version --client
```

## Optional Inputs
- `helmfile-version` : helmfile version. Default `"v0.99.3"`.
- `helm-version` : Helmfile version. Default `"v3.0.3"`
- `kubectl-version` : kubectl version. Default `1.14.6`
- `kubectl-release-date` : kubectl release date. Default `2019-08-22`

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
      uses: mamezou-tech/setup-helmfile@v0.2.3
      with:
        helmfile-version: "v0.99.2"
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
