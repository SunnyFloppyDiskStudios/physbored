function debounce(func){
    let timer;
    return function(event){
        if(timer) clearTimeout(timer);
        timer = setTimeout(func,100,event);
    };
}

function pathToVertices(path, samples = 40) {
    // replacement for the broken matterJS functionality
    // derived from stackoverflow posts mainly

    let length = path.getTotalLength();
    let verts = [];

    for (let i = 0; i <= samples; i++) {
        let point = path.getPointAtLength(
            (i / samples) * length
        );

        verts.push({ x: point.x, y: point.y });
    }

    return verts;
}

// module aliases
let Engine = Matter.Engine,
    // Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

const SVG_NS = "http://www.w3.org/2000/svg";

// variables
let createdBoreds = []; // list of bored objects

let engine;
// let render;
let runner;

// functions
function createSimulation() {
    // world creation funciton

    // engine & renderer
    engine = Engine.create();

    Matter.Events.on(engine, "afterUpdate", function() {
        for (let bored of createdBoreds) {
            let body = bored.body;
            let svg = bored.svg;

            let width = svg.width.baseVal.value;
            let height = svg.height.baseVal.value;

            bored.element.style.transform = `translate(${body.position.x - width / 2}px, ${body.position.y - height / 2}px) rotate(${body.angle}rad)`;
        }
    });

    // render = Render.create({
    //     element: document.body,
    //     engine: engine,
    //     options: {
    //         width: window.innerWidth,
    //         height: window.innerHeight
    //     }
    // });

    // world
    let ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 30, window.innerWidth, 60, { isStatic: true });
    let roof = Bodies.rectangle(window.innerWidth / 2, -30, window.innerWidth, 60, { isStatic: true });
    let wallLeft = Bodies.rectangle(-30, window.innerHeight / 2, 60, window.innerHeight * 2, { isStatic: true });
    let wallRight = Bodies.rectangle(window.innerWidth + 30, window.innerHeight / 2, 60, window.innerHeight * 2, { isStatic: true });


    // making it all add up
    Composite.add(engine.world, [ground, wallLeft, wallRight, roof]);
    Composite.add(engine.world, createdBoreds.map(bored => bored.body));

    // Render.run(render); // RENDERS A CANVAS DELETE IF NOT IN USE ME PLEASE REMMEBER TO REMOVE THIS LATER THIS IS A HUGE COMMENT SO IT STICKS OUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    runner = Runner.create();
    Runner.run(runner, engine);
}

function destroySimulation() {
    // world deletion function RIP

    Runner.stop(runner);
    // Render.stop(render);

    Composite.clear(engine.world, false);
    Engine.clear(engine);

    // render.canvas.remove();
    // render.textures = {};

    engine = null;
    // render = null;
    runner = null;
}

function resetSimulation() {
    destroySimulation();
    createSimulation();
}

function addBored() {
    // the borederiser

    let randPosX = Math.random() * window.innerWidth;
    // let randPosY = Math.random() * window.innerHeight;
    let randPosY = 50;

    let randScale = Math.max(Math.random() * 300, 50);

    let oDiv = document.createElement("div");
    oDiv.style.position = "absolute";

    let oSvg = document.createElementNS(SVG_NS, "svg");
    oSvg.setAttribute("width", randScale.toString());
    oSvg.setAttribute("height", randScale.toString());
    oSvg.setAttribute("viewBox", "0 0 36 36");

    oDiv.appendChild(oSvg);

    let oBody = document.createElementNS(SVG_NS, "path");
    oBody.setAttribute("d", "M17 27c-1.657 0-3-1.343-3-3v-4c0-1.657 1.343-3 3-3 .603-.006 6-1 6-5 0-2-2-4-5-4-2.441 0-4 1.343-3 3 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-4.878 4.58-9 10-9 8 0 11 5.982 11 11 0 4.145-2.277 7.313-6.413 8.92-.9.351-1.79.587-2.587.747V24c0 1.657-1.343 3-3 3z");

    let oCircle = document.createElementNS(SVG_NS, "path");
    oCircle.setAttribute("d", "M20 32a3 3 0 1 1-6 0 3 3 0 0 1 6 0z");

    oSvg.appendChild(oBody);
    oSvg.appendChild(oCircle);

    document.body.appendChild(oDiv);


    let bodyVerts = pathToVertices(oBody);
    let circVerts = pathToVertices(oCircle);

    let scale = randScale / 36;
    bodyVerts = bodyVerts.map(v => ({ x: v.x * scale, y: v.y * scale }));
    circVerts = circVerts.map(v => ({ x: v.x * scale, y: v.y * scale }));

    let obj = Bodies.fromVertices(randPosX, randPosY, [bodyVerts, circVerts]);

    Matter.Body.setAngle(obj, Math.random() * Math.PI * 2);

    createdBoreds.push({ body: obj, element: oDiv, svg: oSvg });

    Composite.add(engine.world, obj);
}

window.addEventListener('resize', debounce(resetSimulation))

window.addEventListener('keypress', function(e) {
    if (e.key === "e") {
        addBored();
    }
})

createSimulation();