

export class Cell {
    constructor({row, col, keyNumber = null}) {
        this.row = row;
        this.col = col;
        this.keyNumber = keyNumber;
        this.guess = "";
    }
}


export class Row {
    constructor(cells = []) {
        this.cells = cells;
    }
}

export class Puzzle {
    constructor(key, rows = []) {
        this.key = key;
        this.rows = rows;
        this.guesses = {};
    }

    debugRender() {
        this.rows.forEach(row => {
            const rowString = row.cells.map(cell => {
                if (cell.isBlack) return "[■]";
                return `[${cell.keyNumber}]`;
            }).join(" ");
            console.log(rowString);
        });
    }
}

export class Key {
    constructor(alphabetKey = {}) {
        this.alphabetKey = alphabetKey;
    }
}