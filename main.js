import * as maze from "./maze-Generator.js";
export const start = {x: 0, y: 0};
export let checking, open = [], closed = [];
let finished = false, target, k = true;

const game = p => {
    p.setup = () => {
        maze.setup(p);
    }

    p.draw = () => {
        maze.draw(p);
        if(finished && open.length != 0 && k === true) {
            p.frameRate(5);
            loop();
        }
    }

    p.keyReleased = () => {
        if(p.keyCode === 32) {
            k = true;
        }
    }
}

export function A() {
    target = maze.grid[maze.cols - 1][maze.rows - 1];
    setF(maze.grid[start.x][start.y], {g: -1}, true);
    open.push(maze.grid[start.x][start.y]);
    finished = true;
    return false;
}

function loop() {
    checking = open.reduce((prev, cur) => {if(cur.f < prev.f) return cur;else return prev});
    closed.push(open.splice(open.indexOf(checking), 1)[0]);
    if(checking === target) {
        console.log(checking, target);
        k = false;
        setTimeout(() => alert("path found"), 200);
        return true;
    }

    const neighbours = (() => {
        let a = [];
        const i = checking.x / maze.s, j = checking.y / maze.s;
        if(!checking.walls[0] && closed.indexOf(maze.grid[i][ - 1]) === -1) a.push(maze.grid[i][j - 1]);
        if(!checking.walls[1] && closed.indexOf(maze.grid[i + 1][j]) === -1) a.push(maze.grid[i + 1][j]);
        if(!checking.walls[2] && closed.indexOf(maze.grid[i][j + 1]) === -1) a.push(maze.grid[i][j + 1]);
        if(!checking.walls[3] && closed.indexOf(maze.grid[i - 1][j]) === -1) a.push(maze.grid[i - 1][j]);
        return a;
    })();
    window.controls = [checking, open, closed, maze.grid, neighbours];
    

    neighbours.forEach(neighbour => {
        if(closed.indexOf(neighbour) >= 0) return;
        if(open.indexOf(neighbour) === -1 || neighbour.g > checking.g + 1) {
            try {
                setF(neighbour, checking);
            } catch(err) {
                console.error(err);
                console.log(neighbour, checking, neighbours);
            }
            if(open.indexOf(neighbour) === -1) open.push(neighbour);
        }
    });
}

function setF(cell, prev, first = false) {
    cell.previous = first ? null:prev;
    cell.g = prev.g + 1;
    cell.h = (target.x - cell.x + target.y - cell.y) / maze.s;
    cell.f = cell.g + cell.h;
}

const instance = new p5(game);