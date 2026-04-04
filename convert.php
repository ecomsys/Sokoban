<?php
// Конфигурация
$directory = './src'; // папка
$extraFiles = [
    './tailwind.config.js' // сюда добавляем любые одиночные файлы
];

$rootFontSize = 16;
$mode = 'toRem'; // 'toRem' или 'toPx'

// Рекурсивная функция
function scanDirRecursively($dir) {
    $files = [];
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach ($iterator as $file) {
        if ($file->isFile() && preg_match('/\.(js|jsx|ts|tsx|html|css)$/', $file->getFilename())) {
            $files[] = $file->getPathname();
        }
    }
    return $files;
}

// px → rem
function pxToRem($content, $rootFontSize) {
    return preg_replace_callback('/(-?\d+(\.\d+)?)px/', function($matches) use ($rootFontSize) {
        $pxValue = floatval($matches[1]);
        $remValue = round($pxValue / $rootFontSize, 4);
        return $remValue . 'rem';
    }, $content);
}

// rem → px
function remToPx($content, $rootFontSize) {
    return preg_replace_callback('/(-?\d+(\.\d+)?)rem/', function($matches) use ($rootFontSize) {
        $remValue = floatval($matches[1]);
        $pxValue = round($remValue * $rootFontSize, 2);
        return $pxValue . 'px';
    }, $content);
}

// 📁 файлы из папки
$files = scanDirRecursively($directory);

// ➕ добавляем одиночные файлы
foreach ($extraFiles as $file) {
    if (file_exists($file)) {
        $files[] = $file;
    }
}

//  убираем дубликаты
$files = array_unique($files);

// Обработка
foreach ($files as $file) {
    $content = file_get_contents($file);

    if ($mode === 'toRem') {
        $newContent = pxToRem($content, $rootFontSize);
    } else {
        $newContent = remToPx($content, $rootFontSize);
    }

    if ($newContent !== $content) {
        file_put_contents($file, $newContent);
        echo "Обработан файл: $file\n";
    }
}

echo "Готово! Режим: $mode\n";