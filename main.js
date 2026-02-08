import { setup, draw, grid} from "./maze-Generator.js";
const game = p => {
    p.setup = () => {
        setup(p);
    }

    p.draw = () => {
        draw(p);
    }
}

export default function A() {
    console.log(grid);
}

const instance = new p5(game);