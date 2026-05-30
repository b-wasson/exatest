
const question = document.getElementById("question");
const input = document.getElementById("answer");
const scoreEl = document.getElementById("score");
const startscreen = document.getElementById("startscreen");
const gamescreen = document.getElementById("game");
const statsscreen = document.getElementById("statsscreen");
const startBtn = document.getElementById("startBtn");
const statsBtn = document.getElementById("statsBtn");
const backBtn = document.getElementById("backBtn");

let a, b, answer;
let score = 0;
let timeleft = 60;
let interval;

startBtn.addEventListener("click", function() {
    score = 0;
    timeleft = 60;
    scoreEl.textContent = "Score: 0";
    startscreen.style.display = "none";
    gamescreen.style.display = "flex";
    newQuestion();
    input.focus();
    startTimer();
});

statsBtn.addEventListener("click", function() {
    startscreen.style.display = "none";
    statsscreen.style.display = "flex";
    showStats();
});

backBtn.addEventListener("click", function() {
    statsscreen.style.display = "none";
    startscreen.style.display = "flex";
});

//polling the user input
input.addEventListener("input", function() {
    const guess = Number(input.value);
    if (guess === answer) {
        score++;
        scoreEl.textContent = "Score: " + score;
        newQuestion();
    }
});

function newQuestion() {
    const operators = ["+", "-", "*", "/"];
    const op = operators[Math.floor(Math.random() * operators.length)];

    a = Math.floor(Math.random() * 99) + 1;

    if (op === "+") {
        b = Math.floor(Math.random() * 99) + 1;
        answer = a + b;
    }
    if (op === "-") {
        b = Math.floor(Math.random() * 99) + 1;
        if (b > a) { let temp = a; a = b; b = temp; }
        answer = a - b;
    }
    if (op === "*") {
        b = Math.floor(Math.random() * 11) + 2;
        answer = a * b;
    }
    if (op === "/") {
        b = Math.floor(Math.random() * 11) + 2;
        answer = a;
        a = a * b;
    }

    question.textContent = a + " " + op + " " + b;
    input.value = "";
    input.focus();
}

function startTimer() {
    const timer = document.getElementById("timer");
    timer.textContent = timeleft + " sec";
    interval = setInterval(function() {
        timeleft--;
        timer.textContent = timeleft + " sec";
        if (timeleft <= 0) {
            clearInterval(interval);
            saveStats(score);
            gamescreen.style.display = "none";
            statsscreen.style.display = "flex";
            showStats();
        }
    }, 1000);
}

function saveStats(finalScore) {
    const gamesPlayed = Number(localStorage.getItem("gamesPlayed") || 0) + 1;
    const bestScore = Math.max(Number(localStorage.getItem("bestScore") || 0), finalScore);
    const totalCorrect = Number(localStorage.getItem("totalCorrect") || 0) + finalScore;
    const history = JSON.parse(localStorage.getItem("scoreHistory") || "[]");
    history.push(finalScore);

    localStorage.setItem("gamesPlayed", gamesPlayed);
    localStorage.setItem("bestScore", bestScore);
    localStorage.setItem("totalCorrect", totalCorrect);
    localStorage.setItem("scoreHistory", JSON.stringify(history));
}

function showStats() {
    const gamesPlayed = Number(localStorage.getItem("gamesPlayed") || 0);
    const bestScore = Number(localStorage.getItem("bestScore") || 0);
    const totalCorrect = Number(localStorage.getItem("totalCorrect") || 0);
    const avg = gamesPlayed > 0 ? (totalCorrect / gamesPlayed).toFixed(1) : 0;
    const history = JSON.parse(localStorage.getItem("scoreHistory") || "[]");

    document.getElementById("statGames").textContent = gamesPlayed;
    document.getElementById("statBest").textContent = bestScore;
    document.getElementById("statAvg").textContent = avg;
    document.getElementById("statLast").textContent = history.length > 0 ? history[history.length - 1] : 0;

    drawChart(history);
}

function drawChart(scores) {
    const canvas = document.getElementById("scoreChart");
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const pad = 24;

    ctx.clearRect(0, 0, w, h);
    if (scores.length < 2) return;

    const max = Math.max(...scores, 1);
    const n = scores.length;

    // converts a data point to canvas coordinates
    const cx = (i) => pad + (i / (n - 1)) * (w - pad * 2);
    const cy = (v) => h - pad - (v / max) * (h - pad * 2);

    // score line
    ctx.beginPath();
    ctx.strokeStyle = "#A27B5C";
    ctx.lineWidth = 2;
    scores.forEach((s, i) => i === 0 ? ctx.moveTo(cx(i), cy(s)) : ctx.lineTo(cx(i), cy(s)));
    ctx.stroke();

    // dots
    scores.forEach((s, i) => {
        ctx.beginPath();
        ctx.arc(cx(i), cy(s), 4, 0, Math.PI * 2);
        ctx.fillStyle = "#DCD7C9";
        ctx.fill();
    });

    // linear regression trend line
    const meanX = (n - 1) / 2;
    const meanY = scores.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    scores.forEach((s, i) => {
        num += (i - meanX) * (s - meanY);
        den += (i - meanX) ** 2;
    });
    const slope = den !== 0 ? num / den : 0;
    const intercept = meanY - slope * meanX;

    ctx.beginPath();
    ctx.strokeStyle = "#DCD7C9";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.moveTo(cx(0), cy(intercept));
    ctx.lineTo(cx(n - 1), cy(slope * (n - 1) + intercept));
    ctx.stroke();
    ctx.setLineDash([]);
}
