# assemblyscript-template

This project was bootstrapped with [doinkythederp/assemblyscript-template](https://github.com/doinkythederp/assemblyscript-template).

## Project layout

```sh
.
│   # AssemblyScript config file
├── asconfig.json
│   # build output directory
├── build/
│   # Jest Test Runner config file
├── jest.config.cjs
│   # Node.js package manifest and package manager lockfile
├── package.json
├── pnpm-lock.yaml
│   # Source code for build and test scripts
├── scripts/
│   # Your project's source code
├── src
│   │   # Type declarations to make TypeScript
│   │   # play well with AssemblyScript
│   ├── env.d.ts
│   │   # Your project's entry point
│   └── index.ts
│   # Jest unit tests
├── tests
│   │   # Jest runs files that end in ".test.ts"
│   ├── *.test.ts
│   │   # TypeScript config to make type-checked
│   │   # unit tests possible
│   └── tsconfig.json
│   # TypeScript config for in-editor errors
│   # and code completion
├── tsconfig.json
│   # Prettier Code Formatter config file
└── .prettierrc.json
```

## Build and test scripts

You can use the following npm scripts in this directory:

### `pnpm build`

Build the app for debug or release. You can modify `asconfig.json` to change build settings, and/or add or remove the `--release` flag to configure the build target.

```sh
pnpm build
pnpm build --release
```

Run `pnpm build --help` for a list of all command line options.

### `pnpm run test`

Build the app for debug and run Jest unit tests (located in `tests/`). You can configure Jest using `jest.config.cjs`, and/or skip the build step by adding or removing the `--no-build` flag.

```sh
pnpm test
pnpm run test --no-build
```

Run `pnpm run test --help` for a list of all command line options.
