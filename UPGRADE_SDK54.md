# Upgrade to Expo SDK 54

Проект обновлен до Expo SDK 54. Выполните следующие шаги:

## 1. Удалите node_modules и lock файлы

```bash
rm -rf node_modules
rm package-lock.json
# или для yarn
rm yarn.lock
```

## 2. Установите зависимости

```bash
npm install
```

## 3. Обновите Expo CLI (если нужно)

```bash
npm install -g expo-cli@latest
# или используйте npx
npx expo@latest --version
```

## 4. Очистите кэш и перезапустите

```bash
npx expo start --clear
```

## Основные изменения

### Обновленные версии:
- **Expo**: ~51.0.0 → ~54.0.0
- **React**: 18.2.0 → 18.3.1
- **React Native**: 0.74.5 → 0.76.5
- **expo-av**: ~14.0.0 → ~15.0.1
- **react-native-screens**: ~3.31.1 → ~4.1.0
- **react-native-svg**: 15.2.0 → 15.8.0
- **@react-native-async-storage/async-storage**: 1.23.1 → 2.1.0
- **react-native-gesture-handler**: ~2.16.1 → ~2.20.2
- **react-native-reanimated**: ~3.10.1 → ~3.16.1

### Потенциальные breaking changes:

1. **expo-av**: Могут быть изменения в API. Проверьте документацию.
2. **react-native-screens**: Обновлена до версии 4.x, возможны изменения в навигации.
3. **@react-native-async-storage/async-storage**: Обновлена до версии 2.x, проверьте совместимость.
4. **React Native 0.76**: Новые архитектурные изменения, убедитесь что все зависимости совместимы.

## Проверка после обновления

1. Проверьте что приложение запускается:
   ```bash
   npm start
   ```

2. Протестируйте основные функции:
   - Воспроизведение музыки
   - Навигация
   - Создание плейлистов
   - Поиск треков

3. Если возникли проблемы:
   - Очистите кэш: `npx expo start --clear`
   - Проверьте логи на наличие ошибок
   - Убедитесь что все зависимости установлены правильно

## Дополнительные ресурсы

- [Expo SDK 54 Release Notes](https://expo.dev/changelog/)
- [React Native 0.76 Release Notes](https://reactnative.dev/blog/)
- [Migration Guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)
