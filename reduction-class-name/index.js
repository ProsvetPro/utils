#!/usr/bin/env node

/*
 *
 * Copyright (c) 2023 Prosvet Computers.
 * e-mail: prosvet.dev@ya.ru
 *
 */

/*
 * М О Д У Л И
 */

var fs = require('fs'),
  path = require('path');

/*
 * П Е Р Е М Е Н Н Ы Е 
 */

var htmlFiles = [],
  cssFiles = [];

var htmlClasses = [],
  cssSelectors = [];

var outputHTML = [],
  outputCSS = [];

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var shortClasses = [];

/* ИНИЦИАЛИЗАЦИЯ */

// var allfiles = fs.readdirSync("./", {withFileTypes: true})
//   .filter(d => d.isFile())
//   .map(d => d.name);

console.log(getDir('./'));

// Проверка на наличие введённых данных
if (!process.argv[2]) {
  console.error("Комманда введена без флагов!\nПопробуйте добавить --help");
  process.exit(1);
}

// Анализ введённых аргументов
for (let i = 2; i < process.argv.length; i++) {
  switch (process.argv[i]) {
    case '--help':
      console.log("Ты думал здесь оказывают помощь?");
      break;
    
    case '--inputHTML':
      htmlFiles.push(readFile(process.argv[i + 1]));
      i++;
      break;
    
    case '--inputCSS':
      cssFiles.push(readFile(process.argv[i + 1]));
      i++;
      break;
    
    case '--outputHTML':
      outputHTML.push(process.argv[i + 1]);
      i++;
      break;
    
    case '--outputCSS':
      outputCSS.push(process.argv[i + 1]);
      i++;
      break;
    
    default:
      console.error("Какой-то из флагов введён некорректно\nВведите --help, чтобы преисполнится в своём познании");
      process.exit(2);
      break;
  }
}


/*
 * К О Д 
 */


// Получение путей файлов в директории


// Добавление путей выходных файлов в случае их отсутсвия
if (!outputHTML.length) {
  for (let i = 0; i < htmlFiles.length; i++) {
    outputHTML.push(encode(i) + ".output.html");
  }
} 

if (!outputCSS.length) {
  for (let i = 0; i < cssFiles.length; i++) {
    outputCSS.push(encode(i) + ".output.css");
  }
}

console.log(outputCSS);

// Поиск и добавление классов HTML файлов в массив
for (let i = 0; i < htmlFiles.length; i++) {
  let pos = -1;

  while ((pos = htmlFiles[i].indexOf('class=', pos + 1)) != -1) {
    let quot = htmlFiles[i][pos + 6];
    
    let start = htmlFiles[i].indexOf(quot, pos) + 1;
    let end = htmlFiles[i].indexOf(quot, pos + 7);
    
    let betweenQuot = htmlFiles[i].slice(start, end);
    betweenQuot = betweenQuot.split(' ');
    for (let j = 0; j < betweenQuot.length; j++) {
      if (!htmlClasses.find(item => item === betweenQuot[j])) {
        htmlClasses.push(betweenQuot[j]);
      }
    }
  }
}

console.log(htmlClasses);

// Генерация сокращённых буквенных сочетаний
for (let i = 0; i < htmlClasses.length; i++) {
  shortClasses.push(encode(i));
}

console.log(shortClasses);

// Замена классов в HTML файлах
// Запись этих файлов
for (let i = 0; i < htmlFiles.length; i++) {

  for (let j = 0; j < htmlClasses; j++) {
    try {
      htmlFiles[i] = htmlFiles[i].replaceAll(htmlClasses[j], shortClasses[j]);
    } catch {
      console.error("Ошибка записи замены классов");
      process.exit(4);
    }
  }

  writeFile(outputHTML[i], htmlFiles[i]);
}

// Замена селекторов в CSS файлах
// Запись файлов
for (let i = 0; i < cssFiles.length; i++) {

  for (let j = 0; j < htmlClasses; j++) {
    try {
      cssFiles[i] = cssFiles[i].replaceAll(htmlClasses[j], shortClasses[j]);
    } catch {
      console.error("Ошибка записи замены классов");
      process.exit(4);
    }
  }

  writeFile(outputCSS[i], cssFiles[i]);
}

/*
 * Ф У Н К Ц И И 
 */

function getDir(path) {
  let folderContent = fs.readdirSync(path, {withFileTypes: true});

  let folders = folderContent
    .filter(obj => obj.isDirectory())
    .map(obj => obj.name);

  console.log(folders);

  let files = folderContent
      .filter(obj => obj.isFile())
      .map(obj => obj.name);

  if (folders.length) {
    for (let i = 0; i < folders.length; i++) {
      return getDir(path + '/' + folders[i]).concat(files); 
    }
  } else {
    return files;
  }
}

/**
 * Чтение файлов
 */
function readFile(path) {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch {
    console.error("Введённый Вами путь некорректен");
    process.exit(3);
  }
}

/**
 * Запись файлов
 */
function writeFile(path, file) {
  fs.writeFileSync(path, file);
}

/**
 * Рекурсивная функция 
 */
function encode(ordinal) {
  if (ordinal >= alphabet.length) {
    return encode(Math.floor(ordinal / alphabet.length) - 1) + alphabet[ordinal % alphabet.length];
  } else {
    return alphabet[ordinal];
  }
}