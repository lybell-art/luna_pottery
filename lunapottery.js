let pot=[null,null,null];
let transitor={pre:0, cur:0, scale:0, set:function(c){this.pre=this.cur, this.cur=c, this.scale=-16;}};
let myCam, cameraPos;
let slider1, slider2, slider3, slider4, slider5, slider6;
let darkMode=false;

class showPottery{
	static pre=0;
	static cur=0;
	static scale=0;
	static set(c){
		showPottery.pre=showPottery.cur;
		showPottery.cur=cycle(showPottery.pre,c,3);
		showPottery.scale=-16;
	}
	static show(){
		push();
		translate(0,-90+sin(millis()/2400)*7,0);
		rotateX(PI);
		scale(Math.abs(showPottery.scale));
		if(showPottery.scale >= 0) model(pot[showPottery.cur]);
		else model(pot[showPottery.pre]);
		if(showPottery.scale < 16 ) showPottery.scale+=0.5;
		else showPottery.scale = 16;
		pop();
	}
}

function cycle(n, p, c)
{
	let v=n+p;
	return v-Math.floor(v/c)*c;
}

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
	push();
	translate(0,-300,0);
	for(var i=0;i<4;i++)
	{
		fill(0,i*40,255);
		rotateY(PI/2);
		push();
		translate(0,0,500);
		plane(1000,600);
		pop();
	}
	pop();
	push();
	rotateX(PI/2);
	fill(184, 203, 203);
	plane(1000,1000);
	pop();
	
	lights();
	directionalLight(200,230,215,-0.127,0.45,0.156);
	pointLight(0, 180, 0,0, -480, 0);
	pointLight(150, 176, 210, 0, 580, 0);
	translate(0,-80,0);
	ambientMaterial(220, 232, 229);
	box(80,160,80);
//	push();
//	translate(0,-90+sin(millis()/2400)*7,0);
//	rotateX(PI);
//	scale(16);
//	model(pot[modelNo]);
//	pop();
	showPottery.show();
}

function windowResized()
{
	resizeCanvas(windowWidth, windowHeight, false);
	myCam.setPosition(cameraPos.eyeX,cameraPos.eyeY,cameraPos.eyeZ);
	myCam.lookAt(cameraPos.centerX,cameraPos.centerY,cameraPos.centerZ);
}

function keyPressed() {
	switch(keyCode)
	{
		case LEFT_ARROW:
			showPottery.set(-1);
			break;
		case RIGHT_ARROW:
			showPottery.set(1);
			break;
		case 90://Z
			darkMode=!darkMode;
			break;
	}
}

function mouseWheel(event) { //zoom
	let e = event.delta;
	myCam.move(0,0, e * 0.1);
	cameraPos=extractCameraPos(myCam); //for screen size consistency
}

function extractCameraPos(cam) //for screen size consistency
{
	if(cam)
	{
		return {eyeX:cam.eyeX, eyeY:cam.eyeY, eyeZ:cam.eyeZ, centerX:cam.centerX, centerY:cam.centerY, centerZ:cam.centerZ};
	}
	else return {eyeX:0, eyeY:0, eyeZ:(height/2.0) / tan(PI*30.0 / 180.0), centerX:0, centerY:0, centerZ:0};
}
