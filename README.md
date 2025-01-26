# Setup Neovim - GitHub Action

Setup Neovim on Github Actions.

## Usage

See [action.yml](./action.yml)

**Default (stable release):**

```yml
steps:
  - uses: actions/checkout@v4
  - uses: davidbloss/setup-neovim@v1
  - run: |
      nvim --version
```

**Specific Tag:**

```yml
steps:
  - uses: actions/checkout@v4
  - uses: davidbloss/setup-neovim@v1
    with:
      neovim-version: nightly
  - run: |
      nvim --version
```

For list of available tags, check: [Neovim Tags](https://github.com/neovim/neovim/tags)

## License

Licensed under the MIT License. Check the [LICENSE](./LICENSE) file for details.
