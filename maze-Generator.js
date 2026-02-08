import {A, start, checking} from "./main.js"
export const _width = 800, cols = 10, rows =  Math.floor(cols * 0.7), s = _width / cols,  _height = rows * s;
console.log(s);

let stack = [];
export let current = null, code = 1, grid;
export function setup(p) {
    p.createCanvas(_width, _height);
    grid = createGrid(cols, rows);
    current = grid[start.x][start.y];
}

export function draw(p) {
    p.background(255);
    if(code) code = chooseNeighbour();
    grid.forEach(e => e.forEach(q => q.display(p)));
}

class Cell {
    constructor(x, y) {
        this.x = x * s;
        this.y = y * s;
        this.walls = [true, true, true, true];
        this.visited = false;
        this.f = undefined;
        this.g = undefined;
        this.h = undefined;
        this.previous = null;
    }

    display(p) {
        p.push();
        if(this.visited) p.fill('rgba(50, 153, 204, 0.5)');
        if(this === current || this === checking) p.fill('rgba(150, 0, 255, 0.5)');
        if(this === checking) p.fill('rgba(199, 10, 0, 0.5)');
        // if(this === next) fill('rgba(0, 100, 0, 0.25');
        p.noStroke();
        p.rect(this.x, this.y, s);
        p.pop();

        // TOP
        if(this.walls[0]) p.line(this.x, this.y, this.x + s, this.y);
        // RIGHT
        if(this.walls[1]) p.line(this.x + s, this.y, this.x + s, this.y + s);
        // BOTTOM
        if(this.walls[2]) p.line(this.x + s, this.y + s, this.x, this.y + s);
        // LEFT
        if(this.walls[3]) p.line(this.x, this.y + s, this.x, this.y);
    }
}

export function createGrid(cols, rows) {
    let array = new Array(cols);
    for (let i = 0; i < array.length; i++) {
        array[i] = new Array(rows);
        for (let j = 0; j < array[i].length; j++) {
            array[i][j] = new Cell(i, j);
        }        
    }
    return array;
}

function chooseNeighbour() {
    current.visited = true;
    const next = getNeighbours(current)[Math.floor(Math.random() * getNeighbours(current).length)];
    if(!next) {
        if(current === grid[start.x][start.y]){
            // alert('Finished😁');
            A();
            return 0;
        } else {
            current = stack.pop();
        }
    } else {
        stack.push(current);

        const dir = getDir(current, next);
        current.walls[dir] = false;
        next.walls[getIndex(dir)] = false;

        current = next;
    }
    return 1;
}

function getIndex(r) {
    if(typeof r !== 'number' || r < 0 || r > 3) throw new RangeError("r must be [0;3]");
    else return (r + 2) % 4;
}

function getNeighbours(cell) {
    let a = [], x = Math.round(cell.x / s), y = Math.round(cell.y / s);
    if(y - 1 >= 0 && !grid[x][y - 1].visited) a.push(grid[x][y - 1]);
    if(x + 1 < cols && !grid[x + 1][y].visited) a.push(grid[x + 1][y]);
    if(y + 1 < rows && !grid[x][y + 1].visited) a.push(grid[x][y + 1]);
    if(x - 1 >= 0 && !grid[x - 1][y].visited) a.push(grid[x - 1][y]);
    
    return a;
}

function getDir(a, b) {
    if(a instanceof Cell && b instanceof Cell) {
        const r = (b.x - a.x) / s + 2 * (b.y - a.y) / s;
        return Math.round(0.5 * r * r * r - 1/3 * r * r - 1.5 * r + 7/3);
    } else throw new TypeError("a && b must be instances of Cell");
}