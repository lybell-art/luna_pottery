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
	noStroke();
}

function draw()
{
	background(0);
	orbitControl();
	
	lights();
	translate(0,0,50);
	fill(255);
	box(50,50,100);
	push();
	translate(0,0,70);
//	rotateX(rot);
	rotateZ(PI/2);
	scale(10);
	model(pot[0]);
	pop();
//	rot+=0.1;
}
