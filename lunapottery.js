let pot=[null,null,null];
let rot=0;

function preload() {
	for(var i=0;i<3;i++)
	{
		pot[i]=loadModel('assets/ceramic'+(i+1)+'.obj');
	}
}

function setup()
{
	createCanvas(windowWidth, windowHeight, WEBGL);
	camera(0, 100, -400, 0, 80, 0, 0, 1, 0);
	noStroke();
	debugMode();
}

function draw()
{
	background(0);
	orbitControl();
	
	lights();
	translate(0,80,0);
	fill(255);
	box(80,160,80);
	push();
	translate(0,100,0);
	scale(16);
	model(pot[0]);
	pop();
//	rot+=0.1;
}
