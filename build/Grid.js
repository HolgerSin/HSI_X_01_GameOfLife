export class Grid {
    constructor(size) {
        this.size = size;
        if (!size) {
            throw new Error("Size missing.");
        }
        else if (size < 10) {
            throw new Error("Size >= 10 required.");
        }
        this._cells = new Array();
    }
    get cells() {
        return this._cells;
    }
    set cells(value) {
        this._cells.length = 0;
        for (let cell of value) {
            this._cells.push(cell);
        }
    }
    getCell(pos) {
        return Grid.getCellFromArray(pos, this._cells);
    }
    static getCellFromArray(pos, cells) {
        for (let cell of cells) {
            if (cell.position.x == pos.x && cell.position.y == pos.y) {
                return cell;
            }
        }
        return null;
    }
    getAdjacentCells(pos) {
        return Grid.getAdjacentCellsFromArray(pos, this._cells);
    }
    static getAdjacentCellsFromArray(pos, myCells, gridSize) {
        let _adjacentCells = [];
        for (let x = -1; x < 2; x++)
            for (let y = -1; y < 2; y++) {
                if (x == 0 && y == 0) {
                    continue;
                }
                let newX = pos.x + x;
                let newY = pos.y + y;
                if (!gridSize) {
                    _adjacentCells.push(Grid.getCellFromArray(new Coordinate(newX, newY), myCells));
                }
                else {
                    _adjacentCells.push(Grid.getCellFromArray(Grid.getToroidalCoordinates(newX, newY, gridSize), myCells));
                }
            }
        return _adjacentCells.filter(c => c != null);
    }
    static getToroidalCoordinates(x, y, gridSize) {
        //console.log(`getToroidalCoordinates called: ${x}  ${y}`)
        let newX = x;
        let newY = y;
        if (x < 0) {
            newX = x + gridSize;
        }
        else if (x >= gridSize) {
            newX = x - gridSize;
        }
        if (y < 0) {
            newY = y + gridSize;
        }
        else if (y >= gridSize) {
            newY = y - gridSize;
        }
        return new Coordinate(newX, newY);
    }
}
export class Cell {
    constructor(x, y, gridSize) {
        //TODO: check coordinates are within grid size limits
        if (!gridSize) {
            this.position = new Coordinate(x, y);
        }
        else {
            /*
            let newX = x;
            let newY = y;
            if (x < 0){newX = x + gridSize}
            else if (x >= gridSize){newX = x - gridSize}
            if (y < 0){newY = y + gridSize}
            else if (y >= gridSize){newY = y - gridSize}
            this.position = new Coordinate(newX, newY);
            */
            this.position = Grid.getToroidalCoordinates(x, y, gridSize);
        }
    }
}
export class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
//# sourceMappingURL=Grid.js.map