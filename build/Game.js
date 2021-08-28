import { Grid, Cell, Coordinate } from './Grid.js';
export class Generation {
    //public readonly counter: number;
    constructor(counter) {
        this.counter = counter;
        this._golCells = new Array();
    }
    get golCells() {
        return this._golCells;
    }
}
export class GolCell extends Cell {
    constructor(x, y, alive = true, gridSize) {
        super(x, y, gridSize);
        this.alive = alive;
    }
}
export class GameOfLife {
    constructor(startGen, gridSize, canvasElementId) {
        this.gcMediator = new GridCanvasMediator("canvas", new Grid(gridSize));
        this._currentGen = startGen;
    }
    setGeneration(newGen) {
        this._currentGen = newGen;
    }
    get currentGen() {
        return this._currentGen;
    }
    display() {
        this.gcMediator.drawAllCells(this._currentGen.golCells.filter(gc => gc.alive == true), "green");
        this.gcMediator.drawAllCells(this._currentGen.golCells.filter(gc => gc.alive == false), "red");
        //
        this.gcMediator.displayString(`${this._currentGen.counter}`);
        this.gcMediator.myGrid.cells = this._currentGen.golCells;
        //this._gcMediator.drawAllCells();
        //console.log(this.gcMediator.myGrid.getAdjacentCells(new Coordinate(90,51)).length);
    }
}
export class GenerationProcessor {
    static calculateNextGen(oldGen, gridSize) {
        let nextGen = new Generation(oldGen.counter + 1);
        let toroidal = true;
        /*
        if (!gridSize)
        {
            toroidal = false;
            //console.log(`No gridsize given${gridSize}`);
        }
        */
        for (let cell of oldGen.golCells) {
            let aliveCellCount = Grid.getAdjacentCellsFromArray(cell.position, oldGen.golCells, gridSize).filter(gc => gc.alive == true).length;
            if (Rules.cellStaysAlive(aliveCellCount)) {
                nextGen.golCells.push(cell);
            }
            //console.log("AliveCells   "+aliveCellCount+" arrayLegth "+nextGen.golCells.length);
            // calculate new born cells for all 8 cells around the origin cell
            for (let x = -1; x < 2; x++)
                for (let y = -1; y < 2; y++) {
                    if (x == 0 && y == 0) {
                        continue;
                    }
                    let xPos = cell.position.x + x;
                    let yPos = cell.position.y + y;
                    aliveCellCount = Grid.getAdjacentCellsFromArray(new Coordinate(xPos, yPos), oldGen.golCells, gridSize).filter(gc => gc.alive == true).length;
                    if (Rules.cellIsBorn(aliveCellCount)) {
                        if (Grid.getCellFromArray(new Coordinate(xPos, yPos), oldGen.golCells) == null && Grid.getCellFromArray(new Coordinate(xPos, yPos), nextGen.golCells) == null) {
                            nextGen.golCells.push(new GolCell(xPos, yPos, true, gridSize));
                        }
                        //console.log("AliveCells should be 3   "+aliveCellCount+" arrayLegth "+nextGen.golCells.length);
                    }
                }
        }
        return nextGen;
    }
}
class Rules {
    static cellStaysAlive(aliveAdjacentCellCount) {
        if (this.aliveConditions.indexOf(aliveAdjacentCellCount) != -1) {
            return true;
        }
        else
            return false;
    }
    static cellIsBorn(aliveAdjacentCellCount) {
        if (this.newCellBirthConditions.indexOf(aliveAdjacentCellCount) != -1) {
            return true;
        }
        else
            return false;
    }
}
Rules.aliveConditions = [2, 3];
Rules.newCellBirthConditions = [3];
export class GridCanvasMediator {
    constructor(canvasElementId, myGrid) {
        this.canvasElementId = canvasElementId;
        this.myGrid = myGrid;
        this._canvas = document.getElementById(canvasElementId);
        this._drawingContext = this._canvas.getContext("2d");
        this._cellSize = this._canvas.height / myGrid.size;
    }
    drawAllCells(cells = this.myGrid.cells, color = "blue") {
        for (let cell of cells) {
            this.drawCell(cell, color);
        }
    }
    drawCell(cell, color = "black") {
        this._drawingContext.fillStyle = color;
        this._drawingContext.fillRect(cell.position.x * this._cellSize, cell.position.y * this._cellSize, this._cellSize, this._cellSize);
    }
    clearAll() {
        this._drawingContext.fillStyle = "white";
        this._drawingContext.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
    displayString(text) {
        this._drawingContext.fillStyle = "black";
        this._drawingContext.font = "30px Arial";
        this._drawingContext.fillText(text, 10, 50);
    }
}
//# sourceMappingURL=Game.js.map