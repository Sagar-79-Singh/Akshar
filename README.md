# Akshar

Akshar is an offline-first desktop workspace for turning photos of handwritten Hindi school exam papers into editable Unicode Hindi. Add pages in order, optionally fill in paper details, and transcribe with Gemini. The Kruti Dev 010 converter works without internet. No account, server, database, or telemetry.

## Download

Download the latest installer from **[Akshar Releases](https://github.com/Sagar-79-Singh/Akshar/releases/latest)**:

| Platform | Download |
| --- | --- |
| Windows | `Akshar Setup *.exe` (NSIS) |
| macOS Intel / Apple Silicon | `Akshar-*-x64.dmg` / `Akshar-*-arm64.dmg` |
| Linux | `Akshar-*.AppImage` or `akshar_*.deb` |

Windows SmartScreen may warn about an unsigned app: choose **More info → Run anyway** if you trust the release. On macOS, the unsigned app may need **right-click → Open** the first time. On Linux, make the AppImage executable with `chmod +x Akshar-*.AppImage` before opening it.

## Get started

1. Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Open **Settings** (top right), paste the key, click **Save key**, optionally **Test key**. Your key is encrypted by Electron safeStorage using the operating system's secure storage; it is not part of settings exports. On Linux a working secret-service/keyring is required.
3. Drag in JPG/PNG/WebP pages, in reading order (or click the drop area / paste an image with Ctrl+V). Select or type any optional paper details, then click **Transcribe**. No school is required.
4. Edit the result, copy it, or save as TXT/DOCX. Use the Converter tab to convert Kruti Dev 010 and Unicode in either direction; apply the Kruti Dev 010 font to legacy text in its destination app.

The app queues Gemini calls, throttles requests, and automatically falls back from Gemini 2.5 Flash to 2.5 Flash Lite to 3.1 Flash Lite on quota or service errors. Gemini model availability and free-tier quotas depend on your account and region. Only transcription needs internet. Settings, school addresses, and the most recent 50 transcripts are saved as JSON in Electron's local `userData` directory. Use **Export all settings** and **Export schools** regularly for backups. History is not included in settings exports.

## Development

Requires Node **24.x** and npm. No native Node addons or local compiler are required.

```sh
npm ci
npm test
npm run build
npm run dev         # start Vite; launch Electron separately: npx electron .
```

For a desktop dev session, run `npm run dev` in one terminal and `npx electron .` in another. Renderer code is in `src/`, privileged filesystem / Gemini work is in `electron/main.cjs`, and only the narrow IPC bridge in `electron/preload.cjs` reaches the renderer. Fonts are bundled. Icons can be regenerated with `npm run icons` (pure JavaScript).

## Releasing

Update the version in `package.json` and lockfile, run `npm ci && npm test && npm run build`, commit, then tag `vX.Y.Z` and push the commit and tag. `.github/workflows/release.yml` builds Windows, macOS (x64 and arm64), and Linux installers using Node 24 and publishes them to GitHub Releases. Installed apps check GitHub Releases for updates. Builds are unsigned; signing requires separate credentials and is not configured. The release workflow needs repository Actions enabled and permission to write contents.

Kruti Dev mapping attribution: [LICENSE-THIRD-PARTY.md](LICENSE-THIRD-PARTY.md).
