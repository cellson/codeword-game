import {Cell, Row, Puzzle, Key} from './classes.js';

// 2D array representing the puzzle grid. 
// Zeros are black cells, and other numbers correspond to letters in the key
const puzzleLayout = [
    [0,0,1,0,0],
    [1,2,3,3,4],
    [0,0,5,0,0],
    [5,4,2,6,0],
    [0,0,4,0,0]
]

const puzzleKey = new Key({1:'C', 2:'E', 3:'L', 4:'S', 5:'U', 6:'D'})

let selectedNumber = null;
let solved = false;

// A function to iterate over the 2d puzzle array and return a Puzzle object
function puzzleFactory(layout, key) {
    const rows = layout.map((rowData, rowIndex) => {
        const cells = rowData.map((val, colIndex) => {
            return new Cell({
                row: rowIndex,
                col: colIndex,
                keyNumber: val
            });
        });
        return new Row(cells);
    })
    return new Puzzle(key, rows)
}

function renderPuzzle() {
    renderGrid();
    renderKey();
}


const gamePuzzle = puzzleFactory(puzzleLayout, puzzleKey);


function checkWin() {
    for (let row of gamePuzzle.rows) {
        for (let cell of row.cells) {
            if (cell.keyNumber === 0) continue; // skip black cells
            if (gamePuzzle.guesses[cell.keyNumber] !== puzzleKey.alphabetKey[cell.keyNumber]) {
                return false; // if any cell is not solved, return false
            }
        }
    }
    return true;

}

function renderGrid() {
    const container = document.getElementById("game-container");
    container.innerHTML = "";

    gamePuzzle.rows.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        
        row.cells.forEach(cell => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            container.appendChild(rowDiv);
            rowDiv.appendChild(cellDiv);

            if (cell.keyNumber === 0) {
                cellDiv.classList.add("black");
                return; // skip further rendering for black cells
            }
            if (gamePuzzle.guesses[cell.keyNumber] === puzzleKey.alphabetKey[cell.keyNumber]) {
                cellDiv.classList.add("solved");
            }
            if (cell.keyNumber === selectedNumber && !solved) {
                cellDiv.classList.add("selected");
            }
            if (cell.keyNumber === selectedNumber && solved) {
                cellDiv.classList.add("solved", "selected");
            }
            cellDiv.addEventListener("click", () => {
                if (solved) return;
                selectedNumber = cell.keyNumber;
                renderPuzzle();
            });

            const numberSpan = document.createElement("span");
            numberSpan.classList.add("cell-number");
            numberSpan.textContent = cell.keyNumber || "";

            const letterDiv = document.createElement("div");
            letterDiv.classList.add("cell-letter");
            letterDiv.textContent = gamePuzzle.guesses[cell.keyNumber] || "";
            
            
            cellDiv.appendChild(letterDiv);
            cellDiv.appendChild(numberSpan);
                        
            })
        
    });

    const winMessage = document.getElementById("win-message");
    winMessage.textContent = solved ? "You solved it! 🎉" : "";
}

function renderKey() {
    const keyContainer = document.getElementById("key-container");
    keyContainer.innerHTML = "";
    for (let i = 1; i <= 26; i++) {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");

        if (gamePuzzle.guesses[i] === puzzleKey.alphabetKey[i]) {
            cellDiv.classList.add("solved");
        }
        if (i === selectedNumber && !solved) {
            cellDiv.classList.add("selected");
        }
        if (i === selectedNumber && solved) {
            cellDiv.classList.add("solved", "selected");
        }

        cellDiv.addEventListener("click", () => {
            if (solved) return;
            selectedNumber = i;
            renderPuzzle();
        });

        const numberSpan = document.createElement("span");
        numberSpan.classList.add("cell-number");
        numberSpan.textContent = i;

        const letterDiv = document.createElement("div");
        letterDiv.classList.add("cell-letter");
        letterDiv.textContent = gamePuzzle.guesses[i] || "";

        cellDiv.appendChild(letterDiv);
        cellDiv.appendChild(numberSpan);
        keyContainer.appendChild(cellDiv);
    }
}

document.addEventListener("keydown", (event) => {
    if (solved || selectedNumber === null) return;

    const key = event.key.toUpperCase();

    if (key === "BACKSPACE") {
        delete gamePuzzle.guesses[selectedNumber];
    } else if (key.length === 1 && key >= "A" && key <= "Z") {
        gamePuzzle.guesses[selectedNumber] = key;
    }

    if (checkWin()) {
        solved = true;
        selectedNumber = null;
    }

    renderPuzzle();
});

renderPuzzle();