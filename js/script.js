function check(id, answer) {
    let input = document.getElementById(id+'-input');
    let ans = document.getElementById(id+'-ans');
    if (input.value == answer) {
        ans.innerHTML = 'Верно!';
    }
    else {
        ans.innerHTML = 'Неверно! Правильный ответ: ' + answer;
    }
}