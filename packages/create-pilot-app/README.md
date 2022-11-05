# Create Pilot App

The easiest way to get started with Pilot.js is by using `create-pilot-app`. This CLI tool enables you to quickly start building a new Pilot.js application, with everything set up for you. You can create a new app using the default Pilot.js template, or by using one of the [official Pilot.js examples](https://github.com/Wave-Play/pilot/tree/main/examples). To get started, use the following command:

### Interactive

You can create a new project interactively by running:

```bash
npx create-pilot-app@latest
# or
yarn create pilot-app
# or
pnpm create pilot-app
```

You will be asked for the name of your project, and then whether you want to
create a TypeScript project:

```bash
✔ Would you like to use TypeScript with this project? … No / Yes
```

Select **Yes** to install the necessary types/dependencies and create a new TS project.

### Non-interactive

You can also pass command line arguments to set up a new project
non-interactively. See `create-pilot-app --help`:

```bash
create-pilot-app <project-directory> [options]

Options:
  -V, --version                      output the version number
  --ts, --typescript

    Initialize as a TypeScript project. (default)

  --js, --javascript

    Initialize as a JavaScript project.

  --use-npm

    Explicitly tell the CLI to bootstrap the app using npm

  --use-pnpm

    Explicitly tell the CLI to bootstrap the app using pnpm

  -e, --example [name]|[github-url]

    An example to bootstrap the app with. You can use an example name
    from the official Pilot.js repo or a GitHub URL. The URL can use
    any branch and/or subdirectory

  --example-path <path-to-example>

    In a rare case, your GitHub URL might contain a branch name with
    a slash (e.g. bug/fix-1) and the path to the example (e.g. foo/bar).
    In this case, you must specify the path to the example separately:
    --example-path foo/bar
```

### Why use Create Pilot App?

`create-pilot-app` allows you to create a new Pilot.js app within seconds. It is officially maintained by the creators of Pilot.js, and includes a number of benefits:

- **Interactive Experience**: Running `npx create-pilot-app@latest` (with no arguments) launches an interactive experience that guides you through setting up a project.
- **Zero Dependencies**: Initializing a project is as quick as one second. Create Pilot App has zero dependencies.
- **Offline Support**: Create Pilot App will automatically detect if you're offline and bootstrap your project using your local package cache.
- **Support for Examples**: Create Pilot App can bootstrap your application using an example from the Pilot.js examples collection (e.g. `npx create-pilot-app --example locales`).

### Forked from Create Next App

This package was forked from [Create Next App](https://github.com/vercel/next.js/blob/canary/packages/create-next-app) and modified to work with Pilot.js.
