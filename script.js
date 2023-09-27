const boardElement = document.getElementById('board');
const startButton = document.querySelector('button');

const BOARD_SIZE = 8;
const NUM_MINES = 10;

let board = [];
let revealed = [];
let remainingCells;

function initializeGame() {
    board = generateBoard(BOARD_SIZE, NUM_MINES);
    revealed = createEmptyArray(BOARD_SIZE);
    remainingCells = BOARD_SIZE * BOARD_SIZE - NUM_MINES;
    renderBoard();
}

function generateBoard(size, numMines) {
    // Create an empty board
    const board = createEmptyArray(size);
    
    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        if (board[row][col] !== 'X') {
            board[row][col] = 'X';
            minesPlaced++;
        }
    }
    
    // Calculate adjacent mine counts
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] !== 'X') {
                let count = 0;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        const newRow = i + x;
                        const newCol = j + y;
                        if (isValidCell(newRow, newCol) && board[newRow][newCol] === 'X') {
                            count++;
                        }
                    }
                }
                board[i][j] = count === 0 ? '' : count.toString();
            }
        }
    }
    
    return board;
}

function createEmptyArray(size) {
    return new Array(size).fill(null).map(() => new Array(size).fill(''));
}

function isValidCell(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function revealCell(row, col) {
    if (!isValidCell(row, col) || revealed[row][col]) return;

    revealed[row][col] = true;
    if (board[row][col] === '') {
        // If cell is empty, recursively reveal adjacent cells
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                revealCell(row + x, col + y);
            }
        }
    }

    remainingCells--;
    if (board[row][col] === 'X') {
        // Game over if a mine is revealed
        revealAllMines();
        renderBoard();
        alert('Game Over! You hit a mine.');
    } else if (remainingCells === 0) {
        // Win condition
        renderBoard();
        alert('Congratulations! You win!');
    } else {
        renderBoard();
    }
}

function revealAllMines() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === 'X') {
                revealed[i][j] = true;
            }
        }
    }
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (revealed[i][j]) {
                cell.textContent = board[i][j];
            }
            cell.addEventListener('click', () => revealCell(i, j));
            boardElement.appendChild(cell);
        }
    }
}

startButton.addEventListener('click', initializeGame);
initializeGame();
