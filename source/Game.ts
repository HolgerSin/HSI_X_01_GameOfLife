import { Grid, Cell, Coordinate } from './Grid.js';

type CanvasColor = "green"|"black"|"blue"|"red";

export class Generation{
    private readonly _golCells: GolCell[]       // GolCell[] == Array<GolCell>
    //public readonly counter: number;
    constructor(public readonly counter: number)
    {
        this._golCells = new Array<GolCell>();
        
    }

    public get golCells(): GolCell[] 
    {
        return this._golCells;
    }

    
}

export class GolCell extends Cell
{
    public readonly alive: boolean;
    constructor(x: number, y: number, alive: boolean = true, gridSize?: number)
    {
        super(x, y, gridSize);
        this.alive = alive;
    }

}

export class GameOfLife
{
    public readonly gcMediator: GridCanvasMediator;
    private _currentGen: Generation;
    constructor(startGen: Generation, gridSize: number, canvasElementId: string)
    {
        this.gcMediator = new GridCanvasMediator("canvas", new Grid<GolCell>(gridSize));
        this._currentGen = startGen;
    }

    public setGeneration(newGen: Generation)
    {
        this._currentGen = newGen;
    }

    public get currentGen(): Generation
    {
        return this._currentGen;
    }

    public display()
    {
        this.gcMediator.drawAllCells(this._currentGen.golCells.filter(gc => gc.alive == true), "green");
        this.gcMediator.drawAllCells(this._currentGen.golCells.filter(gc => gc.alive == false), "red");
        //
        this.gcMediator.displayString(`${this._currentGen.counter}`);
        
        this.gcMediator.myGrid.cells = this._currentGen.golCells;
        //this._gcMediator.drawAllCells();
    
        //console.log(this.gcMediator.myGrid.getAdjacentCells(new Coordinate(90,51)).length);

    }

}

export class GenerationProcessor
{
    public static calculateNextGen(oldGen: Generation, gridSize?: number): Generation
    {
        let nextGen = new Generation(oldGen.counter + 1);
        let toroidal = true;
        /*
        if (!gridSize)
        {
            toroidal = false;
            //console.log(`No gridsize given${gridSize}`);
        }
        */
       
        for(let cell of oldGen.golCells)
        {   
            let aliveCellCount: number = Grid.getAdjacentCellsFromArray(cell.position, oldGen.golCells, gridSize).filter(gc => gc.alive == true).length
            
            if (Rules.cellStaysAlive(aliveCellCount))
            {
                nextGen.golCells.push(cell);
            }
            
            //console.log("AliveCells   "+aliveCellCount+" arrayLegth "+nextGen.golCells.length);
        

            // calculate new born cells for all 8 cells around the origin cell
            for(let x = -1; x < 2; x++)
            for (let y = -1; y < 2; y++)
            {
                if(x == 0 && y == 0)
                {
                    continue;
                }
                let xPos = cell.position.x + x;
                let yPos = cell.position.y + y;
                
                aliveCellCount = Grid.getAdjacentCellsFromArray(new Coordinate(xPos, yPos), oldGen.golCells, gridSize).filter(gc => gc.alive == true).length
           
                if(Rules.cellIsBorn(aliveCellCount))
                {
                    if (Grid.getCellFromArray(new Coordinate(xPos, yPos), oldGen.golCells) == null && Grid.getCellFromArray(new Coordinate(xPos, yPos),nextGen.golCells) == null)
                    {
                        nextGen.golCells.push(new GolCell(xPos, yPos, true, gridSize));
                    }
                    //console.log("AliveCells should be 3   "+aliveCellCount+" arrayLegth "+nextGen.golCells.length);
                }   
            }

        }
        
        return nextGen;
    }
}


class Rules
{
    private static readonly aliveConditions : number[] = [2, 3];
    private static readonly newCellBirthConditions : number[] = [3];

    public static cellStaysAlive(aliveAdjacentCellCount: number): boolean
    {
        if(this.aliveConditions.indexOf(aliveAdjacentCellCount) != -1)
        {
            return true;
        }
        else
            return false;
    }

    public static cellIsBorn(aliveAdjacentCellCount: number): boolean
    {
        if(this.newCellBirthConditions.indexOf(aliveAdjacentCellCount) != -1)
        {
            return true;
        }
        else
            return false;
    }
}


export class GridCanvasMediator{
    private readonly _cellSize: number;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _drawingContext: CanvasRenderingContext2D;
   
    constructor(
        public readonly canvasElementId: string,
        public readonly myGrid: Grid<GolCell>) //warum nicht Grid<Cell>
    {
        this._canvas = <HTMLCanvasElement>document.getElementById(canvasElementId);
        this._drawingContext = this._canvas.getContext("2d");
        this._cellSize = this._canvas.height/myGrid.size;
    }

    public drawAllCells(cells: Cell[] = this.myGrid.cells, color: CanvasColor = "blue"){
        for(let cell of cells) {
            this.drawCell(cell, color);
        }
    }

    public drawCell(cell:Cell, color: CanvasColor = "black"){
        this._drawingContext.fillStyle = color;
        this._drawingContext.fillRect(cell.position.x*this._cellSize,cell.position.y*this._cellSize,this._cellSize,this._cellSize);
    }

    public clearAll(){
        this._drawingContext.fillStyle = "white";
        this._drawingContext.fillRect(0,0,this._canvas.width,this._canvas.height);
    }

    public displayString(text: string){
        this._drawingContext.fillStyle = "black";
        this._drawingContext.font = "30px Arial";
        this._drawingContext.fillText(text, 10, 50); 
    }
}








