let pot=[null,null,null];
let transitor={pre:0, cur:0, scale:0, set:function(c){this.pre=this.cur, this.cur=c, this.scale=-16;}};
let myCam, cameraPos;
let slider;
let darkMode=false;
let sansuShader, sansuTexture, floorShader, floorTexture;

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

function seasonColor(c, no)
{
	const colorData=[[color(188,206,172), color(172,206,204), color(196,182,157), color(171,177,182)],
			[color(125,255,172), color(40,168,255), color(255,170,15), color(100,100,105)]];
	var c_=cycle(c,-59-45,365);
	if(c_<92) return lerpColor(colorData[no][0], colorData[no][1], map(c_,0,92,0,1));
	else if(c_<184) return lerpColor(colorData[no][1], colorData[no][2], map(c_,92,184,0,1));
	else if(c_<275) return lerpColor(colorData[no][2], colorData[no][3], map(c_,184,275,0,1));
	else return lerpColor(colorData[no][3], colorData[no][0], map(c_,275,365,0,1));
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
	sansuShader = loadShader('sansu.vert','sansu.frag');
	floorShader = loadShader('floor.vert','floor.frag');
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
	
	//prepare sansu-wall texture
	sansuTexture = createGraphics(1000, 600, WEBGL);
	sansuTexture.noStroke();
	floorTexture = createGraphics(1000, 1000, WEBGL);
	floorTexture.noStroke();
}

function draw()
{
	let seasonCol=[];
	for(var i=0;i<2;i++) seasonCol[i] = seasonColor(slider.value(),i);
	
	//rendering sansu-wall
	sansuTexture.shader(sansuShader);
	
	sansuShader.setUniform("uResolution", [sansuTexture.width, sansuTexture.height]);
	sansuShader.setUniform("uTime", millis() / 1000.0);
	sansuShader.setUniform("inCol", seasonCol[0]._array);

	// passing the shaderTexture layer geometry to render on
	sansuTexture.rect(0,0,sansuTexture.width,sansuTexture.height);
	
	//rendering floor-pulse
	floorTexture.shader(floorShader);
	
	floorShader.setUniform("uResolution", [floorTexture.width, floorTexture.height]);
	floorShader.setUniform("uTime", millis() / 1000.0);
	floorShader.setUniform("inCol", seasonCol[0]._array);
	floorShader.background(0);
	// passing the shaderTexture layer geometry to render on
//	floorTexture.rect(0,0,floorTexture.width,floorTexture.height);

	background(255);
	orbitControl(2,2,0);
	
	//plain draw
	push();
	translate(0,-300,0);
	texture(sansuTexture);
	for(var i=0;i<4;i++)
	{
		rotateY(PI/2);
		push();
		translate(0,0,500);
		plane(1000,600);
		pop();
	}
	pop();
	
	//floor draw
	push();
	rotateX(PI/2);
	if(darkMode) fill(10);
	else texture(floorTexture);
	plane(1000,1000);
	pop();
	
	//pottery draw
	lights();
	if(!darkMode) directionalLight(160,184,172,-0.127,0.45,0.156);
	pointLight(seasonCol[1], 0, -480, 0);
	pointLight(150, 176, 210, 0, 580, 0);
	translate(0,-80,0);
	if(darkMode) ambientMaterial(18, 20, 20);
	else ambientMaterial(seasonCol[0]);
	box(80,160,80);
	if(darkMode) ambientMaterial(22, 23, 22);
	else ambientMaterial(220, 232, 229);
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
