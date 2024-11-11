const mazeElement = document.getElementById("maze");
const pacman = document.getElementById("pacman");
const scoreElement = document.getElementById("score");

let score = 0; // Initialize score

// Add Audio
const moveSound = new Audio("assets/soundeffects/moveSound.wav");
const gameOverSound = new Audio("assets/soundeffects/gameOver.wav");

// Pacman Auto Adjust size
const cellSize = 35; // Set this for auto adjustment
pacman.style.width = cellSize + "px";
pacman.style.height = cellSize + "px";

// Maze layout (0 = empty space, 1 = wall, 2 = dot)
mazeElement.style.display = "grid";
mazeElement.style.gridTemplateColumns = "repeat(25, " + cellSize + "px)";

const mazeLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1],
    [1, 2, 2, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1],
    [1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
    [1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1],
    [1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Initialize position ng pacman with the maze
const startPosition = { row: 1, col: 1 };
pacman.style.top = startPosition.row * cellSize + "px";
pacman.style.left = startPosition.col * cellSize + "px";

const dotElements = [];
let ghosts = []; // Store ghosts here

// Generate the maze based on the layout
function generateMaze() {
    mazeLayout.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement("div");
            if (cell === 1) {
                cellElement.classList.add("wall");
                cellElement.style.width = cellSize + "px";
                cellElement.style.height = cellSize + "px";
            } else if (cell === 2) {
                cellElement.classList.add("dot");
                dotElements.push({ row: rowIndex, col: colIndex, element: cellElement });
            }
            mazeElement.appendChild(cellElement);
        });
    });
}

// Ghost movement function
function moveGhost(ghost) {
    const directions = ['up', 'down', 'left', 'right'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];

    let newTop = ghost.top;
    let newLeft = ghost.left;

    switch (randomDirection) {
        case 'up':
            newTop -= cellSize;
            break;
        case 'down':
            newTop += cellSize;
            break;
        case 'left':
            newLeft -= cellSize;
            break;
        case 'right':
            newLeft += cellSize;
            break;
    }

    // Calculate the new row and column for the ghost
    const row = Math.floor(newTop / cellSize);
    const col = Math.floor(newLeft / cellSize);

    // Check if the new position is valid (not a wall)
    if (newTop >= 0 && newTop < mazeLayout.length * cellSize &&
        newLeft >= 0 && newLeft < mazeLayout[0].length * cellSize &&
        mazeLayout[row][col] !== 1) {
        
        // Update ghost position if valid
        ghost.top = newTop;
        ghost.left = newLeft;
        ghost.element.style.top = newTop + "px";
        ghost.element.style.left = newLeft + "px";
    }
}

// Add a ghost to the maze
function addGhost(row, col) {
    const ghostElement = document.createElement("div");
    ghostElement.classList.add("ghost");

    const designs = ['red', 'blue', 'pink'];
    const randomDesign = designs[Math.floor(Math.random() * designs.length)];
    ghostElement.classList.add(randomDesign);

    ghostElement.style.width = cellSize+10 + "px";
    ghostElement.style.height = cellSize+10 + "px";

    ghostElement.style.position = "absolute";
    ghostElement.style.top = row * cellSize + "px";
    ghostElement.style.left = col * cellSize + "px";

    mazeElement.appendChild(ghostElement);

    ghosts.push({ element: ghostElement, top: row * cellSize, left: col * cellSize });
}

// Detect collision with ghost
function checkGhostCollision() {
    const pacmanTop = parseInt(pacman.style.top);
    const pacmanLeft = parseInt(pacman.style.left);

    ghosts.forEach(ghost => {
        if (pacmanTop === ghost.top && pacmanLeft === ghost.left) {
            // Play game over sound and stop the game
            gameOverSound.play();
            alert("Game Over, Please Try Again!");
            location.reload(); // Reload the game
        }
    });
}

// Move the pacman within the maze
document.addEventListener("keydown", (event) => {
    let newTop = parseInt(pacman.style.top) || startPosition.row * cellSize;
    let newLeft = parseInt(pacman.style.left) || startPosition.col * cellSize;

    switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
            pacman.style.transform = "rotate(270deg)";
            newTop -= cellSize;
            break;
        case "ArrowDown":
        case "s":
        case "S":
            pacman.style.transform = "rotate(90deg)";
            newTop += cellSize;
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            pacman.style.transform = "scaleX(-1)";
            newLeft -= cellSize;
            break;
        case "ArrowRight":
        case "d":
        case "D":
            pacman.style.transform = "rotate(0deg)";
            newLeft += cellSize;
            break;
    }

    // Calculate row and column for the new position
    const row = Math.floor(newTop / cellSize);
    const col = Math.floor(newLeft / cellSize);

    // Check if the new position is valid and not a wall
    if (newTop >= 0 && newTop < mazeLayout.length * cellSize &&
        newLeft >= 0 && newLeft < mazeLayout[0].length * cellSize &&
        mazeLayout[row][col] !== 1) {
        
        // Detect dot collision
        if (mazeLayout[row][col] === 2) {
            mazeLayout[row][col] = 0; // Set as Zero when eaten
            score += 10;
            scoreElement.textContent = score;

            // Play move sound
            moveSound.play();

            const dotIndex = dotElements.findIndex(dot => dot.row === row && dot.col === col);
            if (dotIndex !== -1) {
                dotElements[dotIndex].element.classList.remove("dot");
                dotElements.splice(dotIndex, 1); // Remove from dot tracking
            }
        }

        // Update Pac-Man's position
        pacman.style.top = newTop + "px";
        pacman.style.left = newLeft + "px";
    }

    // Check for collision with ghosts
    checkGhostCollision();
});

// Initialize the maze and add ghosts
generateMaze();
addGhost(3, 3);     //Ghost 1
addGhost(1, 17);    //Ghost 2
addGhost(5, 15);    //Ghost 3
addGhost(5, 5);     //Ghost 4
addGhost(9, 3);     //Ghost 5
addGhost(10, 10);   //Ghost 6
addGhost(11, 19);   //Ghost 7

// Move ghosts every 1 second
setInterval(() => {
    ghosts.forEach(ghost => moveGhost(ghost));
}, 1000);
