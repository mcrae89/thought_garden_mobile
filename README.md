# Thought Garden — Mobile (React Native + Expo)

Mobile client for Thought Garden built with **React Native (Expo)** and **Apollo Client** for GraphQL.

## Features (MVP)
- Auth (login/register) with JWT
- Journal entry CRUD
- Basic garden visualization
- Local notifications (daily reminders)

## Getting Started (Local Dev)
### Prereqs
- Node 18+ and npm or yarn
- Expo CLI (`npm i -g expo` or use `npx expo`)
- iOS Simulator (Xcode) and/or Android Emulator (Android Studio)

### 1) Configure environment
Create `.env.local` at repo root:
```env
API_URL=https://localhost:5001/graphql
```
Ensure your backend is running and accessible from device/emulator (use LAN/IP or tunnel).

### 2) Install & Run
```bash
npm install
npm run start        # starts Expo dev server
# or: npx expo start
```
Press `i` for iOS simulator, `a` for Android, or scan QR with the Expo Go app.

## Project Structure (suggested)
```
app/
  (auth)/             # login/register screens
  (journal)/          # entry list/form screens
  (garden)/           # garden visualization screens
lib/
  api/                # Apollo client, hooks
  storage/            # secure storage helpers for JWT
tests/                # jest tests
```

## CI
Minimal CI runs typecheck/tests on PRs — see `.github/workflows/mobile-ci.yml`.

## Security Notes
- Store JWT in secure storage; avoid AsyncStorage if possible (or encrypt it).
- Never log sensitive data in release builds.
