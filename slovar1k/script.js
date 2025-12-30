const urlParams = new URLSearchParams(window.location.search);

const word_data = urlParams.get("q");

const settings_menu = document.getElementById("settings");
const game_menu = document.getElementById("game");
const results_menu = document.getElementById("results");

const word_input = document.getElementById("wordInput");
const tries_input = document.getElementById("triesInput");

const keyState = {};

let globalWord = "";
let globalTries = 0;

let currentRow = 0;
let currentCol = 0;

let DICTIONARY = new Set();
let DICTIONARY_LOADED = false;

results_menu.style.display = "none";

word_input.addEventListener("input", () => {
    const len = word_input.value.length;
    if (len >= 4 && len <= 8) {
        tries_input.value = len + 1;
    }
});

function generateGrid(word, tries) {
    const grid = document.getElementById("grid");
    const letters = word.length;

    grid.innerHTML = "";

    for (let r = 0; r < tries; r++) {
        const row = document.createElement("div");
        row.classList.add("row");
        row.style.gridTemplateColumns = `repeat(${letters}, 50px)`;

        for (let c = 0; c < letters; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;

            row.appendChild(cell);
        }

        grid.appendChild(row);
    }

    initInput(word, tries);
}

function getCell(r, c) {
    return document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
}

function initInput(word, tries) {
    const letters = word.length;

    const grid = document.getElementById("grid");
    
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        // console.log(`key: ${key}; currentCol: ${currentCol}; currentRow: ${currentRow}`);
        if (/^[a-zA-Zа-яА-Я]$/.test(key)) {
            if (currentCol < letters) {
                const cell = getCell(currentRow, currentCol);
                cell.textContent = key.toUpperCase();
                currentCol++;
            }
            return;
        }
    
        if (key == "Backspace") {
            if (currentCol > 0) {
                currentCol--
                const cell = getCell(currentRow, currentCol);
                cell.textContent = "";
            }
            return;
        }

        if (key == "Enter") {
            if (!DICTIONARY_LOADED) {
                showMessage("Dictionary is not loaded yet");
            }
            if (currentCol === letters) {
                const guess = [];
                for (let i = 0; i < letters; i++) {
                    guess.push(grid.children[currentRow].children[i].textContent.toLowerCase());
                }

                console.log(`Input: ${guess.join("")}`)

                if ((guess.join("") === globalWord.toLowerCase())) {
                    showResults();
                }

                if (!DICTIONARY.has(normalize(guess.join("")))) {
                    showMessage("There is no such word in game's dictionary");
                    return;
                }

                const statuses = checkGuess(guess, word);
                paintRow(currentRow, statuses);
                updateKeyboard(guess, statuses);

                currentRow++;
                currentCol = 0;

                if (currentRow === globalTries) {
                    showResults();
                }
            }
        }
    });
}

function showMessage(text) {
    const el = document.getElementById("message");
    el.textContent = text;
    el.classList.add("show");
    
    setTimeout(() => el.classList.remove("show"), 1500);
}

function loadDictionary(wordLength, word) {
    const isCyrillic = /[а-яё]/i.test(word);
    const file = isCyrillic ? "ru.txt" : "en.txt";

    fetch(file)
        .then(response => response.text())
        .then(text => {
            DICTIONARY = new Set(
                text.split("\n").map(w => normalize(w.trim())).filter(w => w.length === wordLength)
            );
            DICTIONARY_LOADED = true;
            console.log("dict loaded");
        })
        .catch(err => {
            console.log("error with loading dict");
        })
}

function showResults() {
    const results_word = document.getElementById("results-word");
    const results_tries = document.getElementById("results-tries");

    game_menu.style.display = "none";
    results_menu.style.display = "block";

    results_word.innerHTML = `Word: ${globalWord.toLowerCase()}`;
    results_tries.innerHTML = `Tries: ${currentRow}`;
}

function generateKeyboard(word) {
    const isCyrillic = /[а-яё]/i.test(word);
    const layout = isCyrillic ? ["йцукенгшщзхъ", "фывапролджэ", "ячсмитьбю"]
        : ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = "";

    layout.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "kb-row";

        for (const ch of row) {
            const key = document.createElement("button");
            key.textContent = ch.toUpperCase();
            key.dataset.key = ch;
            key.onclick = () => handleKey(ch);
            rowDiv.appendChild(key);
        }

        keyboard.appendChild(rowDiv);
    })

    addSpecialKey("⌫", "backspace");
    addSpecialKey("↵", "enter");
}

function addSpecialKey(label, action) {
    const keyboard = document.getElementById("keyboard");
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = "special";
    btn.onclick = () => handleKey(action);
    keyboard.appendChild(btn);
}

function encodeWordData(word, tries) {
    const utf8String = encodeURIComponent(`${word}|${tries}`)
    return btoa(utf8String)
}

function decodeWordData(encoded_data) {
    const binaryString = atob(encoded_data);
    const decoded = decodeURIComponent(binaryString);
    const [ word, triesStr ] = decoded.split("|");
    return { word, tries: parseInt(triesStr, 10) };
}

document.getElementById("generateBtn").addEventListener("click", () => {
    const word = word_input.value.trim().toLowerCase();
    let tries = parseInt(tries_input.value);

    if (word.length < 4 || word.length > 8) {
        alert("Word must contain between 4 and 8 characters.");
        return;
    }

    if (isNaN(tries) || tries < 2 || tries > 9) {
        tries = word.length + 1;
    }

    const generated_word_data = encodeWordData(word, tries);
    const relative_link = `${location.origin}${location.pathname}?q=${generated_word_data}`;
    const final_link = relative_link.replace("/index.html", "/");

    document.getElementById("resultLink").innerHTML = `
        <p>Link:</p>
        <a href="${final_link}" target="_blank">${final_link}</a>
    `;
})

function checkGuess(guess, answer) {
    const result = Array(answer.length).fill("absent");
    const freq = {};

    for (let i = 0; i < answer.length; i++) {
        if (guess[i] === answer[i]) {
            result[i] = "correct";
        } else {
            freq[answer[i]] = (freq[answer[i]] || 0) + 1;
        }
    }

    for (let i = 0; i < answer.length; i++) {
        if (result[i] === "correct") continue;

        const letter = guess[i];
        if (freq[letter] > 0) {
            result[i] = "present";
            freq[letter]--;
        }
    }

    return result;
}

function handleKey(key) {
    console.log(key);
    if (key === "backspace") {
        onBackspace();
    } else if (key === "enter") {
        onEnter();
    } else {
        onLetter(key);
    }
}

function onLetter(key) {
    letters = globalWord.length;
    if (/^[a-zA-Zа-яА-Я]$/.test(key)) {
        if (currentCol < letters) {
            const cell = getCell(currentRow, currentCol);
            cell.textContent = key.toUpperCase();
            currentCol++;
        }
    }
}

function onBackspace() {
    if (currentCol > 0) {
        currentCol--
        const cell = getCell(currentRow, currentCol);
        cell.textContent = "";
    }
}

function onEnter() {
    const grid = document.getElementById("grid");
    const letters = globalWorld.length;
    if (!DICTIONARY_LOADED) {
        showMessage("Dictionary is not loaded yet");
    }
    if (currentCol === letters) {
        const guess = [];
        for (let i = 0; i < letters; i++) {
            guess.push(grid.children[currentRow].children[i].textContent.toLowerCase());
        }

        console.log(`Input: ${guess.join("")}`)

        if ((guess.join("") === globalWord.toLowerCase())) {
            showResults();
        }

        if (!DICTIONARY.has(normalize(guess.join("")))) {
            showMessage("There is no such word in game's dictionary");
            return;
        }

        const statuses = checkGuess(guess, globalWord);
        paintRow(currentRow, statuses);
        updateKeyboard(guess, statuses);

        currentRow++;
        currentCol = 0;

        if (currentRow === globalTries) {
            showResults();
        }
    }
}

function paintRow(rowIndex, statuses) {
    const row = document.querySelectorAll(".row")[rowIndex];
    const cells = row.children;

    for (let i = 0; i < statuses.length; i++) {
        cells[i].classList.add(statuses[i]);
    }
}

function updateKeyboard(guess, statuses) {
    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        const status = statuses[i];

        if (!keyState[letter] || priority(status) > priority(keyState[letter])) {
            keyState[letter] = status;
        }

        const keyBtn = document.querySelector(`[data-key=${letter}]`);
        if (keyBtn) { 
            keyBtn.classList.remove("correct", "present", "absent");
            keyBtn.classList.add(keyState[letter]);
        }
    }
}

function priority(s) {
    return { absent: 1, present: 2, correct: 3 }
}

function goHome() {
    let currentUrl = window.location.pathname;
    window.location.replace(currentUrl);
}

function normalize(word) {
    return word.toLowerCase().replaceAll("ё", "e");
}

if (word_data != null) {
    settings_menu.style.display = "none";
    game_menu.style.display = "block";

    const { word, tries } = decodeWordData(word_data);
    loadDictionary(normalize(word).length, normalize(word));
    globalWord = word;
    globalTries = tries;
    generateGrid(word, tries);
    generateKeyboard(word); 
} else {
    settings_menu.style.display = "block";
    game_menu.style.display = "none";
}
