# Spotimusic Native

Mobile version of Spotimusic built with **React Native** using **Expo**.

## Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

Create a `.env` file in the root of the project:

```env
PORT=4000
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
EXPO_PUBLIC_API_URL=http://localhost:4000
EXPO_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
```

> **Important for mobile devices:**
>
> - For the **Android emulator** use: `http://10.0.2.2:4000`
> - For the **iOS simulator** use: `http://localhost:4000`
> - For a **physical device** use your computer's IP address: `http://YOUR_IP:4000`

3. **Start the server:**

```bash
npm run server
```

4. **Start the application:**

```bash
npm start
```

Then select the platform (iOS / Android / Web) or scan the QR code using **Expo Go**.

## Project Structure

- `src/types/` — TypeScript types
- `src/store/` — Redux store and slices
- `src/components/` — React Native components
- `src/api/` — API functions for interacting with the backend
- `src/pages/` — Application pages
- `server.ts` — Express server for authentication

## Main Features

- ✅ Bottom tab navigation (Home, Create, Profile)
- ✅ Track search
- ✅ Music playback
- ✅ Playlist creation
- ✅ Add tracks to favorites
- ✅ Playlist page with management controls
- ✅ Authentication via server

## Running the Server

The server must run on port **4000** (or the port specified in `.env`):

```bash
npm run server
```

## Configuring API URL for Physical Devices

1. Find your computer's IP address:
   - **Windows:** `ipconfig`
   - **macOS / Linux:** `ifconfig` or `ip addr`

2. Update `.env`:

```env
EXPO_PUBLIC_API_URL=http://YOUR_IP:4000
```

3. Restart the application.

## Dependencies

- **Expo SDK** ~54.0.0
- **React Native** 0.76.5
- **React** 18.3.1
- **Redux Toolkit** for state management
- **React Navigation** for navigation
- **expo-av** for audio playback
- **AsyncStorage** for local storage
- **Express** for the authentication server
