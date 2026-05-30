# Exatest

A browser-based arithmetic speed drill. Answer as many math questions as you can in 60 seconds.

## How it works

The game picks a random operation (addition, subtraction, multiplication, or division) and two numbers, then displays the question. As soon as you type the correct answer it moves to the next question automatically — no need to press Enter. When the timer runs out it shows your stats.

## Tech

- **HTML** — structure and layout
- **CSS** — styling
- **JavaScript** — all game logic (question generation, timer, score tracking)
- **localStorage** — saves your score history between sessions so stats persist across games
- **Canvas API** — draws the score history chart on the stats screen

No frameworks, no build tools, no dependencies. Open `index.html` in a browser and it runs.
