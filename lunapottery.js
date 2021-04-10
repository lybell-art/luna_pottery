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
	setCamera(myCam);
	myCam.setPosition(450, -400, -175);
	myCam.lookAt(0, -80, 0);
	noStroke();
	debugMode();
	slider1 = createSlider(-1000, 1000, 450);
	slider1.position(10, 10);
	slider2 = createSlider(-1000, 1000, -400);
	slider2.position(10, 40);
	slider3 = createSlider(-1000, 1000, -175);
	slider3.position(10, 70);
	slider4 = createSlider(-1000, 1000, 0);
	slider4.position(10, 100);
	slider5 = createSlider(-1000, 1000, -80);
	slider5.position(10, 140);
	slider6 = createSlider(-1000, 1000, 0);
	slider6.position(10, 180);
}

function draw()
{
	background(200);
	orbitControl(2,2,0);
//	myCam.setPosition(slider1.value(), slider2.value(), slider3.value());
//	myCam.lookAt(slider4.value(), slider5.value(), slider6.value());
	lights();
	directionalLights(240,240,240,slider1.value()/1000,slider2.value()/1000,slider3.value()/1000);
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
