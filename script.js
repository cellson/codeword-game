import {Cell, Row, Puzzle} from './puzzle_grid.js';

// 2D array representing the puzzle grid. 
// Zeros are black cells, and other numbers correspond to letters in the key
const puzzleLayout = [
    [0,0,1,0,0],
    [1,2,3,3,4],
    [0,0,5,0,0],
    [5,4,2,6,0],
    [0,0,4,0,0]
]
// dictionary of number keys to letter values
const puzzleKey = {1:'C', 2:'E', 3:'L', 4:'S', 5:'U', 6:'D'}

let selectedNumber = null;
let solved = false;

// A function to iterate over the 2d puzzle array and return a Puzzle object
function puzzleFactory(layout, alphabetKey) {
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
    return new Puzzle(alphabetKey, rows)
}

const gamePuzzle = puzzleFactory(puzzleLayout, puzzleKey);


function checkWin() {
    return gamePuzzle.rows.every(row => row.cells.every(cell => gamePuzzle.guesses[cell.keyNumber] === puzzleKey[cell.keyNumber]));
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

            if (cell.keyNumber === 0) {
                cellDiv.classList.add("black");
            }
            if (gamePuzzle.guesses[cell.keyNumber] === puzzleKey[cell.keyNumber] && cell.keyNumber !== 0) {
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
                renderGrid();
            });

            const numberSpan = document.createElement("span");
            numberSpan.classList.add("cell-number");
            numberSpan.textContent = cell.keyNumber || "";

            const letterDiv = document.createElement("div");
            letterDiv.classList.add("cell-letter");
            letterDiv.textContent = gamePuzzle.guesses[cell.keyNumber] || "";
            
            container.appendChild(rowDiv);
            rowDiv.appendChild(cellDiv);
            cellDiv.appendChild(letterDiv);
            cellDiv.appendChild(numberSpan);
                        
            })
        
    });

    const winMessage = document.getElementById("win-message");
    winMessage.textContent = solved ? "You solved it! 🎉" : "";
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

    renderGrid();
});

renderGrid();