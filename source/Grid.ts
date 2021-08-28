
export class Grid<T extends Cell> {
    private readonly _cells: T[];
    
    constructor(public readonly size: number)
    {
        if(!size)
        {
            throw new Error("Size missing.");
        }
        else if(size < 10)
        {
            throw new Error("Size >= 10 required.");
        }

        this._cells = new Array<T>();
    }

    public get cells(): T[] {
        return this._cells;
    }
    public set cells(value: T[])
    {
       
        this._cells.length = 0; 
        for(let cell of value)
        {
            this._cells.push(cell);
        }
        
    }

  
    public getCell(pos: Coordinate): T {
        return Grid.getCellFromArray(pos, this._cells);
    }

    public static getCellFromArray<T extends Cell>(pos: Coordinate, cells: T[]): T {
        for(let cell of cells)
        {
            if(cell.position.x == pos.x && cell.position.y == pos.y)
            {
                return cell;
            }
        }
        
        return null;
    }



    public getAdjacentCells(pos: Coordinate): T[] 
    {
        return Grid.getAdjacentCellsFromArray(pos, this._cells);
    }

    public static getAdjacentCellsFromArray<T extends Cell>(pos: Coordinate, myCells: T[], gridSize?: number): T[]
    {
        let _adjacentCells: T[] = [];

        for(let x = -1; x < 2; x++)
        for (let y = -1; y < 2; y++)
        {
            if(x == 0 && y == 0)
            {
                continue;
            }
            let newX = pos.x + x;
            let newY = pos.y + y;

            if (!gridSize)
            {
                _adjacentCells.push(Grid.getCellFromArray(new Coordinate(newX, newY), myCells));
            }
            else
            {
                _adjacentCells.push(Grid.getCellFromArray(Grid.getToroidalCoordinates(newX, newY, gridSize), myCells));
            }
        }

        return _adjacentCells.filter(c => c != null);
    }

    public static getToroidalCoordinates(x: number, y: number, gridSize: number): Coordinate{
        //console.log(`getToroidalCoordinates called: ${x}  ${y}`)
        let newX = x;
        let newY = y;
        if (x < 0){newX = x + gridSize}
        else if (x >= gridSize){newX = x - gridSize} 
        if (y < 0){newY = y + gridSize}
        else if (y >= gridSize){newY = y - gridSize} 
        return new Coordinate(newX, newY);
    }

}

export class Cell{
    constructor(x: number, y: number, gridSize?: number) {
        //TODO: check coordinates are within grid size limits
        if (!gridSize)
        {
            this.position = new Coordinate(x, y);

        }
        else
        {
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

    public readonly position: Coordinate
}

export class Coordinate{
    constructor(
        public readonly x: number,
        public readonly y: number
    ) {}
}