# Инструкция по настройке

## 1. Установка зависимостей

```bash
npm install
```

## 2. Настройка сервера

Создайте файл `.env` в корне проекта `SpotimusicNative`:

```env
PORT=4000
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
EXPO_PUBLIC_API_URL=http://localhost:4000
EXPO_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
```

## 3. Запуск сервера

В одном терминале запустите сервер:

```bash
npm run server
```

Сервер будет доступен на `http://localhost:4000`

## 4. Настройка API URL для мобильных устройств

### Для Android эмулятора:
```
EXPO_PUBLIC_API_URL=http://10.0.2.2:4000
```

### Для iOS симулятора:
```
EXPO_PUBLIC_API_URL=http://localhost:4000
```

### Для физического устройства:

1. Узнайте IP адрес вашего компьютера:
   - Windows: `ipconfig` (найдите IPv4 адрес)
   - macOS/Linux: `ifconfig` или `ip addr`

2. Обновите `.env`:
```
EXPO_PUBLIC_API_URL=http://YOUR_IP:4000
```

3. Убедитесь, что устройство и компьютер в одной сети Wi-Fi

4. Перезапустите приложение

## 5. Запуск приложения

В другом терминале:

```bash
npm start
```

Затем выберите платформу или отсканируйте QR-код.

## Функции

- ✅ Нижние табы: Home, Create (с модалкой), Profile
- ✅ Кликабельные плейлисты - открывают страницу плейлиста
- ✅ Поиск треков
- ✅ Воспроизведение музыки
- ✅ Создание и управление плейлистами
- ✅ Аутентификация через сервер
