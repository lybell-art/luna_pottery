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
		translate(0,-90+sin(millis()/1000)*7,0);
		rotateX(PI);
		scale((showPottery.scale*showPottery.scale)/16);
		if(showPottery.scale >= 0) model(pot[showPottery.cur]);
		else model(pot[showPottery.pre]);
		if(showPottery.scale < 16 ) showPottery.scale+=1;
		else showPottery.scale = 16;
		pop();
	}
}

function initialDate()
{
	let d1=new Date(), d2=new Date();
	d2.setMonth(0,1);
	return Math.round((d1.valueOf()-d2.valueOf())/86400000);
}

function seasonColor(c)
{
	var c_=cycle(c,-59-45,365);
	if(c_<92) return lerpColor(color(188,206,172), color(172,206,204), map(c_,0,92,0,1));
	else if(c_<184) return lerpColor(color(172,206,204), color(196,182,157), map(c_,92,184,0,1));
	else if(c_<275) return lerpColor(color(196,182,157), color(171,177,182), map(c_,184,275,0,1));
	else return lerpColor(color(171,177,182), color(188,206,172), map(c_,275,365,0,1));
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
	slider = createSlider(0, 365, initialDate());
	slider.position(10, 10);
	cameraPos={eyeX:450, eyeY:-400, eyeZ:175, centerX:0, centerY:-80, centerZ:0};
}

function draw()
{
	let seasonCol = seasonColor(slider.value());
	if(darkMode) background(5);
	else background(200);
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
	if(darkMode) fill(18, 20, 20);
//	else fill(184, 203, 203);
	else fill(seasonCol);
	plane(1000,1000);
	pop();
	
	lights();
	if(!darkMode) directionalLight(200,230,215,-0.127,0.45,0.156);
	pointLight(seasonCol, 0, -480, 0);
	pointLight(150, 176, 210, 0, 580, 0);
	translate(0,-80,0);
	if(darkMode) ambientMaterial(22, 23, 22);
	else ambientMaterial(220, 232, 229);
	box(80,160,80);
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
function mouseDragged()
{
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
