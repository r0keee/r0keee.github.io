const output = document.querySelector('textarea');
const button = document.querySelector('button');
const header_card = document.getElementById('header_card');
const word_handler = document.getElementById('word');
const ans_text = document.getElementById('ans');
const main_button = document.getElementById('main-button');
const progress = document.getElementById('progress');
const bar = document.getElementById('bar');

let data = '';
let wordArray = [];
let resWords = {};
let current_index = 0;
let correct = 0;
let wordFinish = false;
let incorrectWords = '';

fetch("js/stresses.txt")
  .then((res) => res.text())
  .then((text) => {
        // console.log(text);
        data = text.normalize();
        wordArray = text.split('\n');
   })
  .catch((e) => console.error(e));
normalizeAll();
function normalizeAll() {
    for (let i = 0; i < wordArray.length; i++) {
        wordArray[i] = wordArray[i].normalize();
    }
}

function findStress(line) {
    for (let i = 0; i < line.length; i++) {
        if (line[i] == line[i].toUpperCase()) {
            return i;
        }
    }
}

function generateRes() {
    normalizeAll();
    for (let i = 0; i < wordArray.length; i++) {
        let index = findStress(wordArray[i]);
        resWords[wordArray[i]] = index;
    }
    shuffle();
    console.log(resWords);
}

function shuffle() {
    for (let i = wordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
}

function setWord(index) {
    if (wordArray[index].length > 11) {
        word_handler.setAttribute("small", '');
    }
    else {
        word_handler.removeAttribute("small");
    }
    let s = '';
    let vowels = ['а', 'о', 'у', 'э', 'ы', 'я', 'ё', 'е', 'ю', 'и'];
    for (let i = 0; i < wordArray[index].length; i++) {
        if (!vowels.includes(wordArray[index][i].normalize().toLowerCase())) {
            s += wordArray[index][i].toUpperCase();
            console.log(s);
            if (i == wordArray[index].length-1) {
                console.log("test");
                let newP = document.createElement("p");
                newP.innerHTML = s;
                word_handler.appendChild(newP);
                s = '';
            }
        }
        else {
            let newA = document.createElement("p");
            let newP = document.createElement("p");
            newA.innerHTML = wordArray[index][i].normalize().toUpperCase();
            newP.innerHTML = s;
            newA.setAttribute('onclick', 'checkStress('+i.toString()+');');
            newA.setAttribute('class', 'vowel-button');
            word_handler.appendChild(newP);
            word_handler.appendChild(newA);
            s = '';
        }
    }
}

function checkStress(ind) {
    if (wordFinish) {
        return;
    }

    if (ind == resWords[wordArray[current_index]]) {
        word_handler.setAttribute('correct', '');
        correct = correct + 1;
        ans_text.innerHTML = "Верно!";
        console.log(correct);
    }
    else {
        console.log('no');
        ans_text.innerHTML = "Неверно! Правильно: " + wordArray[current_index];
        word_handler.setAttribute('incorrect', '');
        incorrectWords += wordArray[current_index] + " ";
    }
    current_index += 1;
    console.log(current_index);
    main_button.style.display = "block";
    wordFinish = true;
}

function getPercent() {
    return Math.floor((correct/wordArray.length)*100);
}

function check() {
    if (current_index == 0) {
        header_card.style.display = "block";
        progress.style.display = "block";
        header_card.innerHTML = "Какое ударение в слове?";
        word_handler.style.display = "flex";
        main_button.innerHTML = "Дальше";
        correct = 0;
        incorrectWords = '';
        generateRes();
    }
    if (current_index != wordArray.length) {
        ui(true);
        word_handler.innerHTML = '';
        word_handler.removeAttribute("correct");
        word_handler.removeAttribute("incorrect");
        setWord(current_index);
        bar.innerHTML = "№ " + (current_index+1).toString() + "/" + wordArray.length.toString();
        ans_text.style.display = "block";
        ans_text.innerHTML = '';
    } 
    else { 
        main_button.innerHTML = "Начать Снова";
        header_card.innerHTML = "Правильно: " + correct.toString() + "/" + wordArray.length.toString() + ' (' + getPercent().toString() + '%)';
        progress.style.display = "none";
        if (incorrectWords != '') {
            if (getPercent() < 50) {
                ans_text.innerHTML = "Не стоит расстариваться, еще можно наверстать! Слова с ошибками: " + incorrectWords;
            }
            if (getPercent() >= 50 && getPercent() < 75) {
                ans_text.innerHTML = "Неплохо, но надо поднажать! Слова с ошибками: " + incorrectWords;
            }
            if (getPercent() >= 75 && getPercent() < 90) {
                ans_text.innerHTML = "Круто, но стоит продолжать! Слова с ошибками: " + incorrectWords;
            }
            if (getPercent() >= 90 && getPercent() != 100) {
                ans_text.innerHTML = "Близко к идеалу) Слова с ошибками: " + incorrectWords;
            }
        }
        else {
            ans_text.innerHTML = 'Машина💪';
        }
        console.log(getPercent());
        word_handler.innerHTML = '';
        word_handler.removeAttribute("correct");
        word_handler.removeAttribute("incorrect");
        current_index = 0;
        correct = 0;
    }
    wordFinish = false;
}

function ui(open) {
    if (open) {
        button.style.display = "none";
    }
    else {
        button.style.display = "block";
    }
}