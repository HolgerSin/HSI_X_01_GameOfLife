//import { Grid, Cell, Coordinate } from './Grid.js';
import { Generation, GolCell, GameOfLife, GenerationProcessor } from './Game.js';





/*
let grid = new Grid<Cell>(100);
let cell: Cell;
let myAdjacentCells: Cell[] ;
for (let index = 0; index < 15; index++)
{
    cell = new Cell(30 + index, 50);
    grid.cells.push(cell);
    myAdjacentCells= grid.getAdjacentCells(cell.position);
    console.log(myAdjacentCells.length);
}

console.log(grid.getAdjacentCells(new Coordinate(90,50)).length);


let canvasInterface = new GridCanvasMediator("canvas", grid);
canvasInterface.drawAllCells(grid.cells, "green");
*/

let gridSize = 200;
let startPosX = 75;
let startPosY = 90;
let delayTimer = 10;

let gen0 = new Generation(0);

for (let index = 0; index < 56; index++)
{
    let golCell = new GolCell(startPosX + index, startPosY);
    gen0.golCells.push(golCell);
    
}

let txt = 
`
X_X_XXX
__XX_X
`;

let myGol = new GameOfLife(gen0, gridSize, "canvas");

myGol.display();

/*
for(let index = 0; index < 200; index++)
{
        
}
*/
let counter  = 0;
let counterMax = 1000;

let handle = setInterval(() => { 
    counter++;
    myGol.setGeneration(GenerationProcessor.calculateNextGen(myGol.currentGen, gridSize));
    myGol.gcMediator.clearAll();
    myGol.display();

    if(counter == counterMax)
    {
        clearInterval(handle);
    }
}, delayTimer);


