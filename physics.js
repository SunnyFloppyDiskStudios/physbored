function debounce(func){
    let timer;
    return function(event){
        if(timer) clearTimeout(timer);
        timer = setTimeout(func,100,event);
    };
}

function pathToVertices(path) {
    // replacement for the broken matterJS functionality
    // derived from stackoverflow posts mainly

    const d = path.getAttribute("d");

    const vertices = [];
    const regex = /([ML])\s*(-?\d*\.?\d+(?:e[-+]?\d+)?)\s+(-?\d*\.?\d+(?:e[-+]?\d+)?)/gi; // i still dont *really* know how this magic works

    let match;

    while ((match = regex.exec(d)) !== null) {
        vertices.push({
            x: Number(match[2]),
            y: Number(match[3])
        });
    }

    return vertices;
}

// module aliases
let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

const SVG_NS = "http://www.w3.org/2000/svg";

// variables
let createdBoreds = []; // list of bored objects

let engine;
let render;
let runner;

// functions
function createSimulation() {
    // world creation funciton

    // engine & renderer
    engine = Engine.create();

    Matter.Events.on(engine, "afterUpdate", function() {
        // places the visual on "top" of the colliders

        for (let bored of createdBoreds) {
            let body = bored.body;
            let svg = bored.svg;

            let width = svg.width.baseVal.value;
            let height = svg.height.baseVal.value;

            bored.element.style.transform = `translate(${body.position.x - width / 2}px, ${body.position.y - height / 2}px) rotate(${body.angle}rad)`;
        }
    });

    render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    });

    // world
    let ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 30, window.innerWidth, 60, { isStatic: true });
    let roof = Bodies.rectangle(window.innerWidth / 2, -30, window.innerWidth, 60, { isStatic: true });
    let wallLeft = Bodies.rectangle(-30, window.innerHeight / 2, 60, window.innerHeight * 2, { isStatic: true });
    let wallRight = Bodies.rectangle(window.innerWidth + 30, window.innerHeight / 2, 60, window.innerHeight * 2, { isStatic: true });


    // making it all add up
    Composite.add(engine.world, [ground, wallLeft, wallRight, roof]);
    Composite.add(engine.world, createdBoreds.map(bored => bored.body));

    Render.run(render); // RENDERS A CANVAS DELETE IF NOT IN USE ME PLEASE REMMEBER TO REMOVE THIS LATER THIS IS A HUGE COMMENT SO IT STICKS OUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    runner = Runner.create();
    Runner.run(runner, engine);
}

function destroySimulation() {
    // world deletion function RIP

    Runner.stop(runner);
    Render.stop(render);

    Composite.clear(engine.world, false);
    Engine.clear(engine);

    render.canvas.remove();
    render.textures = {};

    engine = null;
    render = null;
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
    oDiv.classList.add("bored");

    let oSvg = document.createElementNS(SVG_NS, "svg");
    oSvg.setAttribute("width", randScale.toString());
    oSvg.setAttribute("height", randScale.toString());
    oSvg.setAttribute("viewBox", "0 0 36 36");

    oDiv.appendChild(oSvg);

    let oBody = document.createElementNS(SVG_NS, "path");
    oBody.setAttribute("d", "M17 27 L15.88192749 26.7847684 L15.08511698 26.309577 L14.31746691 25.3447132 L14 24 L14 22.0574232 L14 20 L14.91425666 17.8435785 L17 17 L19.5981254 16.2961344 L21.6549689 15.0024706 L22.5438873 13.8627626 L23 12 L21.443478 9.10220116 L18 8 L15.56392159 8.74994398 L14 11 L13.21459798 13.0238896 L11 14 L8.866235803 13.1089135 L8 11 L8.23346253 9.10486627 L8.889668382 7.35493604 L9.87951981 5.82291721 L10.99626334 4.64496385 L12.6398445 3.45006074 L14.32979136 2.652686384 L15.83789151 2.221655563 L18 2 L19.76754 2.104151897 L21.7222242 2.503734939 L23.7701554 3.35242283 L25.7439766 4.80264869 L27.0031343 6.2844143 L28.1112934 8.3495504 L28.7038 10.26900219 L29 13 L28.9155857 14.3497926 L28.6550273 15.6571344 L28.0343505 17.2743655 L27.2625157 18.5238699 L26.3104925 19.6058407 L25.3126479 20.4468596 L24.0457542 21.2476692 L22.587 21.92 L21.2929001 22.354323 L20 22.667 L20 23.3576243 L20 24 L19.7925558 25.0984919 L19.2447528 25.9904127 L18.2061848 26.7477123 Z");

    let oCircle = document.createElementNS(SVG_NS, "path");
    oCircle.setAttribute("d", "M20 32 L19.744375 33.1606268 L19.0375749 34.0871821 L18.1719778 34.7496869 L17 35 L15.72964323 34.6570821 L14.91428432 34.0390694 L14.2251008 33.0290074 L14 32 L14.32283155 30.7672784 L15.01742817 29.8600201 L15.73244796 29.3413986 L17 29 L18.1675595 29.2895706 L19.0322864 29.9076428 L19.7443367 30.903053 Z");

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
    
    oBody.setAttribute("d", "M17 27c-1.657 0-3-1.343-3-3v-4c0-1.657 1.343-3 3-3 .603-.006 6-1 6-5 0-2-2-4-5-4-2.441 0-4 1.343-3 3 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-4.878 4.58-9 10-9 8 0 11 5.982 11 11 0 4.145-2.277 7.313-6.413 8.92-.9.351-1.79.587-2.587.747V24c0 1.657-1.343 3-3 3z");
    oCircle.setAttribute("d", "M20 32a3 3 0 1 1-6 0 3 3 0 0 1 6 0z");
}

window.addEventListener('resize', debounce(resetSimulation))

window.addEventListener('keypress', function(e) {
    if (e.key === "e") {
        addBored();
    }
})

createSimulation();