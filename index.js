function debounce(func){
    var timer;
    return function(event){
        if(timer) clearTimeout(timer);
        timer = setTimeout(func,100,event);
    };
}

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Svg = Matter.Svg;

// variables
var createdBoreds = []; // list of bored objects

var engine;
var render;
var runner;

// functions
function createSimulation() {
    // world creation funciton
    // engine & renderer
    engine = Engine.create();

    render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    });

    // world
    var ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 30, window.innerWidth, 60, { isStatic: true });
    var wallLeft = Bodies.rectangle(-30, window.innerHeight / 2, 60, window.innerHeight * 2, { isStatic: true });
    var wallRight = Bodies.rectangle(window.innerWidth + 30, window.innerHeight / 2, 60, window.innerHeight * 2, { isStatic: true });


    // making it all add up
    Composite.add(engine.world, [ground, wallLeft, wallRight]);
    Composite.add(engine.world, createdBoreds);

    Render.run(render);

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

function addObject() {
    // the RANDOMISER wow

    let randPosX = Math.random() * window.innerWidth;
    let randPosY = Math.random() * window.innerHeight;

    let randSizeX = Math.random() * 80;
    let randSizeY = Math.random() * 80;


    let box = Bodies.rectangle(randPosX, randPosY, randSizeX, randSizeY);

    createdBoreds.push(box);

    Composite.add(engine.world, box);
}

window.addEventListener('resize', debounce(resetSimulation))

window.addEventListener('keypress', function(e) {
    if (e.key === "e") {
        addObject();
    }
})

createSimulation();