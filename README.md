# OCR4all Frontend

This repository contains the frontend for the new release of OCR4all.

## Getting Started

### 1. Install packages

```bash
pnpm install
```

### 2. Run

In development mode

```bash
pnpm dev
```

In preview mode

```bash
pnpm preview
```

To build for production

```bash
pnpm build
```

To run tests

```bash
pnpm test
```

To get test coverage

```bash
pnpm coverage
```

To lint code

```bash
pnpm lint
```

To format code

```bash
pnpm format
```

To update dependencies

```bash
pnpm deps:update
```

## Docker

To use Docker for your development environment

```bash
docker-compose -f docker-compose.dev.yaml up
```

To use Docker for your production deployment

```bash
docker-compose -f docker-compose.production.yaml up
```

## Environment Variables

- `VITE_API_BASE_URL`: Points to the URL under which the REST API of an OCR4all backend instance is running (e. g. `https://some-domain.com/api/v1.0`)
- `VITE_LAREX_URL`: Points to the URL under which the `directLibrary` endpoint of the used LAREX instance is located
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
