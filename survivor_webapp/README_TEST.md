# Test environment

This project includes a "test" configuration that targets the remote test host and backend at `85.235.148.177`.

Files added/changed:
- `proxy.test.conf.json` — proxy that forwards `/api`, `/admin`, `/first` to `http://85.235.148.177:8389`
- `src/environments/environment.test.ts` — environment values for test
- `angular.json` — added `test` build configuration with `fileReplacements` replacing `environment.ts`
- `package.json` — added scripts `start:test` and `build:test`

Commands

Start dev server bound to the test IP (dev + proxy + environment.test):

```cmd
cd c:\1\survivor\survivor_webapp
npm run start:test
```

Build using the `test` environment replacements:

```cmd
cd c:\1\survivor\survivor_webapp
npm run build:test
```

Notes

- `start:test` uses `--host 85.235.148.177`. If binding to that IP fails, use `--host 0.0.0.0` and access the app from `http://85.235.148.177:4200` if that IP is assigned to the machine.
- Ensure the backend is reachable at `http://85.235.148.177:8389`. If the backend runs elsewhere, update `proxy.test.conf.json` and `src/environments/environment.test.ts` accordingly.
- If you want HTTPS or different ports, tell me and I'll add those options.
