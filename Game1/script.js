const inputs = document.querySelector(".inputs");
resetBtn  = document.querySelector(".inputs");

function randomWord() 
{
    let ranObj = wordList[Math.floor(Math.random() * wordList.length)];
    let word = ranObj.word;
    console.log(word);

    let html = "";
    for (let i = 0; i < word.length; i++)
    {
        html += `<input type="text" disabled>`;
    } 
    inputs.innerHTML = html;
}
randomWord();