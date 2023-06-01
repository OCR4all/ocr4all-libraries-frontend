# OCR4all Frontend

This repository contains the frontend for the new release of OCR4all.

## Getting Started

### 1. Install packages

```bash
yarn
```

### 2. Run

In development mode

```bash
yarn dev
```

In preview mode

```bash
yarn preview
```

To build for production

```bash
yarn build
```

To run tests

```bash
yarn test
```

To get test coverage

```bash
yarn coverage
```

To lint code

```bash
yarn lint
```

To format code

```bash
yarn format
```

To update dependencies

```bash
yarn deps:update
```

## Environment Variables

- `VITE_API_URL`: Points to the URL under which the REST API of an OCR4all backend instance is running (e. g. `https://some-domain.com/api/v1.0`)
- `VITE_MODE`: Whether the OCR4all backend is running in `Desktop` or `Server` mode

## Build with

- 🛠[Vue 3](https://github.com/vuejs/)
- ⚡️[Vite](https://github.com/vitejs/vite)
- 🦾[Typescript](https://github.com/microsoft/TypeScript)
- 📦[Components auto importing](https://github.com/antfu/unplugin-vue-components)
- 🌍[vue-i18n](https://github.com/kazupon/vue-i18n)
- 🍍[State Management via Pinia](https://github.com/vuejs/pinia)
- 🤖[PrimeVue](https://github.com/primefaces/primevue)
- 🎨[Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)
- 🎉[Baklavajs v2](https://github.com/newcat/baklavajs)
- 🎀[Prettier](https://prettier.io)
- and many more
