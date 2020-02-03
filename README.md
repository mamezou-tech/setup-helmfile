# setup-helmfile
This action will setup helmfile with Helm and kubectl.

AWS edition of kubectl will be instaalled.

## Inputs
### `helmfile-version`
helmfile version. Default `"v0.99.3"`.

### `helm-version`
Helmfile version. Default `"v3.0.3"`

### `kubectl-version`
kubectl version. Default `1.14.6`

### `kubectl-release-date`
kubectl release date. Default `2019-08-22`

## Example usage

```yaml
- name: Setup helmfile
  uses: kondoumh/setup-helmfile@master
  with:
    helmfile-version: 'v0.99.2'
- name: Use helmfile
  run: |
    helmfile --version
```
