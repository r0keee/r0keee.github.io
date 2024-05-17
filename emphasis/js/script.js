const output = document.querySelector('textarea');
const button = document.querySelector('button');
const header_card = document.getElementById('header_card');
const word_handler = document.getElementById('word');
const ans_text = document.getElementById('ans');
const main_button = document.getElementById('main-button');

let data = '';
let wordArray = [];
let resWords = {};
let current_index = 0;
let correct = 0;

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
    console.log(resWords);
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
    }
    current_index += 1;
    console.log(current_index);
    main_button.style.display = "block";
}


function check() {
    generateRes();
    if (current_index == 0) {
        header_card.style.display = "block";
        header_card.innerHTML = "Какое ударение в слове?";
        word_handler.style.display = "flex";
        main_button.innerHTML = "Дальше";
        correct = 0;
    }
    if (current_index != wordArray.length) {
        ui(true);
        word_handler.innerHTML = '';
        word_handler.removeAttribute("correct");
        word_handler.removeAttribute("incorrect");
        setWord(current_index);
        ans_text.style.display = "block";
    } 
    else { 
        main_button.innerHTML = "Начать Снова";
        header_card.innerHTML = "Правильно: " + correct.toString() + "/" + wordArray.length.toString();
        word_handler.innerHTML = '';
        ans_text.style.display = 'none';
        word_handler.removeAttribute("correct");
        word_handler.removeAttribute("incorrect");
        current_index = 0;
        correct = 0;
    }
    ans_text.innerHTML = '';
}

function ui(open) {
    if (open) {
        button.style.display = "none";
    }
    else {
        button.style.display = "block";
    }
}