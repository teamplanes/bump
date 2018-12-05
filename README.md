# bump

`bump` any semver version in any JSON file via a simple and basic CLI.

### install

```sh
$ yarn global add bump-json-file
$ npm i -g bump-json-file
```

### example

Bump will by default bump `version` in `package.json`. 

```sh
$ bump

Current version: 0.0.1-rc.0

? Update version to (Use arrow keys)
❯ Prerelease:  0.0.1-rc.1
  Patch:       0.0.1
  Minor:       0.1.0
  Major:       1.0.0
  Don't update.
```

But you can also pass in a `--file` and/or a `--key` arg.

```sh
$ bump --file=./app.json --key=expo.version
```

---

Handy as commit hook with `husky`.