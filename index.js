#!/usr/bin/env node

/*
 *
 * Copyright (c) 2023 Prosvet Computers. All rights reserved.
 *
 */

/*
 * М О Д У Л И
 */

var fs = require('fs');

/*
 * П Е Р Е М Е Н Н Ы Е 
 */

var htmlFiles = [],
  cssFiles = [], 
  args = [];

var htmlClasses = [],
  cssSelectors = [];

var outputHTML = [],
  outputCSS = [];

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var shortClasses = [];

/* ИНИЦИАЛИЗАЦИЯ */

if (!process.argv[2]) {
  console.error("Флаги не введены! \nПопробуйте добавить флаг --help");
  process.exit(1);
}

let success = true;
for (let i = 2; success; i++) {
  console.log(process.argv[i]);

  if (!process.argv[i]) {
    success = false;
    break;
  }
  args.push(process.argv[i]);
}

/*
 * К О Д 
 */

// Анализ введённых аргументов
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--help':
      console.log("Ты думал здесь оказывают помощь?");
      break;
    
    case '--inputHTML':
      htmlFiles.push(readFile(args[i + 1]));
      i++;
      break;
    
    case '--inputCSS':
      cssFiles.push(readFile(args[i + 1]));
      i++;
      break;
    
    case '--outputHTML':
      outputHTML.push(args[i + 1]);
      i++;
      break;
    
    case '--outputCSS':
      outputCSS.push(args[i + 1]);
      i++;
      break;
    
    default:
      console.error("Введёный флаг не существует.\nВведите --help, чтобы пополнить свои познания");
      process.exit(2);
      break;
  }
}

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
    htmlClasses = htmlClasses.concat(betweenQuot.split(' '));
  }
}

console.log(htmlClasses);

// Генерация сокращённых буквенных сочетаний
for (let i = 0; i < htmlClasses.length; i++) {
  shortClasses.push(encode(i));
}

console.log(shortClasses);

// Замена классов в файлах HTML и CSS 
// Запись этих файлов
for (let i = 0; i < htmlFiles.length; i++) {
  for (let j = 0; j < cssFiles.length; j++) {
    for (let x = 0; x < htmlClasses.length; x++) {
      try {
        htmlFiles[i] = htmlFiles[i].replace(htmlClasses[x], shortClasses[x]);
        cssFiles[j] = cssFiles[j].replace(htmlClasses[x], shortClasses[x]);
      } catch {
        console.error("Всё по пизде");
        process.exit(4);
      }
    }
    writeFile(outputCSS[j], cssFiles[j]);
  }
  writeFile(outputHTML[i], htmlFiles[i]);
}



/*
 * Ф У Н К Ц И И 
 */

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