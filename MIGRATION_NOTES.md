# Заметки по миграции

## Выполненные изменения

### 1. Структура проекта
- Создана структура Expo проекта
- Настроен TypeScript
- Добавлены необходимые зависимости

### 2. Redux Store
- Мигрированы все slices (tracks, playlists, favorites, player, ui)
- localStorage заменён на AsyncStorage
- Добавлена инициализация данных из AsyncStorage

### 3. Компоненты
- **SoundDriver**: Переписан для использования expo-av вместо HTML5 Audio
- **IconButton**: Переписан с использованием react-native-svg
- **TrackCard**: Адаптирован для React Native
- **Player**: Полностью переписан с использованием expo-av
- **ControlPanel**: Адаптирован для React Native
- **MainScreen**: Переписан с использованием ScrollView и React Native компонентов

### 4. Навигация
- React Router заменён на React Navigation
- Использован Bottom Tab Navigator

### 5. API
- Адаптирован для использования AsyncStorage вместо localStorage
- Сохранена логика refresh токенов

## Что нужно доработать

1. **Модальные окна**: Для создания плейлистов нужен полноценный модальный компонент (сейчас используется простое имя по умолчанию)

2. **Иконки табов**: Добавить иконки для навигационных табов

3. **Стилизация**: Возможно потребуется дополнительная стилизация для разных размеров экранов

4. **Обработка ошибок**: Добавить более детальную обработку ошибок загрузки аудио

5. **Производительность**: Оптимизировать рендеринг списков треков

## Запуск

```bash
cd SpotimusicNative
npm install
npm start
```

Затем выберите платформу или отсканируйте QR-код в Expo Go.

## Зависимости

Все необходимые зависимости указаны в package.json. Основные:
- expo ~51.0.0
- react-native 0.74.5
- @reduxjs/toolkit
- @react-navigation/native
- expo-av
- @react-native-async-storage/async-storage
