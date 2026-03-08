# Spotimusic Native

Мобильная версия Spotimusic на React Native с Expo.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Настройте переменные окружения:
Создайте файл `.env` в корне проекта:
```
PORT=4000
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
EXPO_PUBLIC_API_URL=http://localhost:4000
EXPO_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
```

**Важно для мобильных устройств:**
- Для Android эмулятора используйте: `http://10.0.2.2:4000`
- Для iOS симулятора используйте: `http://localhost:4000`
- Для физического устройства используйте IP адрес вашего компьютера: `http://YOUR_IP:4000`

3. Запустите сервер:
```bash
npm run server
```

4. Запустите приложение:
```bash
npm start
```

Затем выберите платформу (iOS/Android/Web) или отсканируйте QR-код в Expo Go.

## Структура проекта

- `src/types/` - TypeScript типы
- `src/store/` - Redux store и slices
- `src/components/` - React Native компоненты
- `src/api/` - API функции для работы с бэкендом
- `src/pages/` - Страницы приложения
- `server.ts` - Express сервер для аутентификации

## Основные функции

- ✅ Навигация через нижние табы (Home, Create, Profile)
- ✅ Поиск треков
- ✅ Воспроизведение музыки
- ✅ Создание плейлистов
- ✅ Добавление треков в избранное
- ✅ Страница плейлиста с управлением
- ✅ Аутентификация через сервер

## Запуск сервера

Сервер должен быть запущен на порту 4000 (или указанном в .env):
```bash
npm run server
```

## Настройка API URL для физических устройств

1. Узнайте IP адрес вашего компьютера:
   - Windows: `ipconfig`
   - macOS/Linux: `ifconfig` или `ip addr`

2. Обновите `.env`:
```
EXPO_PUBLIC_API_URL=http://YOUR_IP:4000
```

3. Перезапустите приложение

## Зависимости

- Expo SDK ~54.0.0
- React Native 0.76.5
- React 18.3.1
- Redux Toolkit для управления состоянием
- React Navigation для навигации
- expo-av для воспроизведения аудио
- AsyncStorage для локального хранения
- Express для сервера аутентификации

## Обновление до SDK 54

Проект обновлен до Expo SDK 54. См. [UPGRADE_SDK54.md](./UPGRADE_SDK54.md) для деталей обновления.
