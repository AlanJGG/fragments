# fragments

BTI525NBB - Lab 01

## Running the Server

The following npm scripts are available for running and working with the server.

### Start

Run the server normally:

```bash
npm start
```

This starts the server using `src/server.js`.

### Development

Run the server in development mode:

```bash
npm run dev
```

This loads the environment variables from `.env.debug` and automatically restarts the server when changes are made to the source files.

### Debug

Run the server with the Node.js debugger enabled:

```bash
npm run debug
```

This loads the environment variables from `.env.debug`, watches for file changes, and enables the Node.js debugger.

### Lint

Check the source code for linting errors:

```bash
npm run lint
```

This runs ESLint on the JavaScript files inside `src/`.

## TODO

- [ ] Add `nodemon` for development server auto-reloading.
