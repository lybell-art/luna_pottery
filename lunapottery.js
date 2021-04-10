let pot=[null,null,null];
let rot=0;
let myCam;

function preload() {
	for(var i=0;i<3;i++)
	{
		pot[i]=loadModel('assets/ceramic'+(i+1)+'.obj');
	}
}

function setup()
{
	createCanvas(windowWidth, windowHeight, WEBGL);
	camera = createCamera();
	camera.lookAt(0, -80, 0);
	camera.setPosition(80, 100, -400);
	setCamera(camera);
	noStroke();
	debugMode();
}

function draw()
{
	background(200);
	orbitControl(1,1,0);
	
	lights();
	
	translate(0,-80,0);
	fill(255);
	box(80,160,80);
	push();
	translate(0,-100,0);
	rotateX(PI);
	rotateZ(rot);
	scale(16);
	model(pot[0]);
	pop();
	rot+=0.1;
}
