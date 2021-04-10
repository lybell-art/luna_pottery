let pot=[null,null,null];
let rot=0;
let myCam;
let slider1, slider2, slider3, slider4, slider5, slider6;

function preload() {
	for(var i=0;i<3;i++)
	{
		pot[i]=loadModel('assets/ceramic'+(i+1)+'.obj');
	}
}

function setup()
{
	createCanvas(windowWidth, windowHeight, WEBGL);
	myCam = createCamera();
	myCam.lookAt(0, -20, 0);
	myCam.setPosition(0, -400, 600);
	setCamera(myCam);
	noStroke();
	debugMode();
	slider1 = createSlider(-1000, -1000, 0);
	slider1.position(10, 10);
	slider2 = createSlider(-1000, -1000, 0);
	slider2.position(10, 40);
	slider3 = createSlider(-1000, -1000, 0);
	slider3.position(10, 70);
	slider4 = createSlider(-1000, -1000, 0);
	slider4.position(10, 100);
	slider5 = createSlider(-1000, -1000, 0);
	slider5.position(10, 140);
	slider6 = createSlider(-1000, -1000, 0);
	slider6.position(10, 180);
}

function draw()
{
	background(200);
//	orbitControl(1,1,1);
	myCam.setPosition(slider1, slider2, slider3);
	myCam.lookAt(slider4, slider5, slider6);
	lights();
	
	translate(0,-80,0);
	ambientMaterial(220,225,223);
	box(80,160,80);
	push();
	translate(0,-90,0);
	rotateX(PI);
	rotateY(rot);
	scale(16);
	model(pot[0]);
	pop();
	rot+=0.02;
}
