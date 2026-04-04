# EcomSys
# Схема проекта "Sokoban". Самописная простая игра на React Create App + Tailwind

checkers/
├── .npm/
│   ├── fonts.js          # конвертацияя шрифтов в woff2
│   ├── svg.js            # создание спрайтов svg
│   └── webp.js           # конвертация из png в webp
│
├── node_modules           # зависимости npm
│     └── ...
│
├── public/
│   ├── fonts           # шрифты
│   ├── icons           # иконки
│   ├── audio           # звуки
│   ├── images          # изображения
│   ├── .htaccess       # настройки для apache
│   ├── favicon.ico     # фавикон
│   └── ...             
│
├── src/              
│   ├── app              # провайдер, роутер и обвертка для анимации
│   ├── components       # layouts, sections
│   ├── pages            # страницы
│   ├── hooks            # хуки
│   ├── stores           # хук для взаимодействия с воркером
│   ├── types            # swiper.d.ts, types.ts
│   ├── styles           # стили
│   ├── ui               # мелкие елементы интерфейса
│   ├── main.tsx         # точка входа
│   └── ...
│
├── .gitignore           # игнор для git
├── index.html           # главный файл 
├── tailwind.config.js   # настройки tailwind
├── package.json         # зависимости
├── convert.php          # конвертер rem/px всех файлов проекта
├── vite.config.ts       # конфиг для vite  
└── ...


# Список обязательных условий для организации игрового портала со вложенностью на сервере Apache

# 1
В провайдере для роутера нужно указать basename, чтобы пути не ломались
```javascript
 return (
    <BrowserRouter basename="/games/sokoban">
      ...
    </BrowserRouter>
  );
```

# 2
В vite.config.ts обязательно чтобы пути чанков у билда не ломались

```javascript
export default defineConfig({
  base: "/games/sokoban/",
  ...
```


# 3
Чтобы пути к ресурсам не ломались бери из переменной vite
```javascript
<img src={`${import.meta.env.BASE_URL}images/image.png`} alt="image" />

<svg className="w-[55px] h-[55px]">
    <use xlinkHref={`${import.meta.env.BASE_URL}/sprite/sprite.svg#back`} />
</svg>
```

# 4
Для apache нужен вот такой .htaccess

```bash
RewriteEngine On

# Игнорируем реальные файлы и папки
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Игнорируем статические ассеты Vite
RewriteCond %{REQUEST_URI} !^/games/sokoban/assets/
RewriteCond %{REQUEST_URI} !^/games/sokoban/static/

# Всё остальное → index.html (SPA fallback)
RewriteRule ^ /games/sokoban/index.html [L]
```