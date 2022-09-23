var bg, bgImg
var bottomGround
var topGround
var balloon, balloonImg
var obstacleTop, obsTop1, obsTop2
var obstacleBottom, obsBottom1, obsBottom2, obsBottom3
var gameOver, gameOverImg
var restart, restartImg
var jumpsound,diesound
var bg2,bgImg2
var score = 0;
var goldcoin,goldcoinImg
var coinsGroup
var life=50

//game states      
var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload(){
bgImg = loadImage("assets/bg.png")
bgImg2 = loadImage("assets/bgImg2.jpg")

balloonImg = loadAnimation("assets/balloon1.png","assets/balloon2.png","assets/balloon3.png")

obsTop1 = loadImage("assets/obsTop1.png")
obsTop2 = loadImage("assets/obsTop2.png")

obsBottom1 = loadImage("assets/obsBottom1.png")
obsBottom2 = loadImage("assets/obsBottom2.png")
obsBottom3 = loadImage("assets/obsBottom3.png")

gameOverImg= loadImage("assets/gameOver.png")
restartImg = loadImage("assets/restart.png")

jumpsound = loadSound("assets/jump.mp3")
diesound = loadSound("assets/die.mp3")

goldcoinImg = loadImage("assets/gold coin.png")

}

function setup(){

  createCanvas(700,400)
//background image
bg = createSprite(165,485,1,1);

getbackgroundimage();


//creating top and bottom grounds
bottomGround = createSprite(200,390,800,20);
bottomGround.visible = false;

topGround = createSprite(200,10,800,20);
topGround.visible = false;
      
//creating balloon     
balloon = createSprite(100,200,20,50);
balloon.addAnimation("balloon",balloonImg);
balloon.scale = 0.2;
balloon.debug = false;

//initialising groups
topObstaclesGroup = new Group();
bottomObstaclesGroup = new Group();
barGroup = new Group();

coinsGroup = new Group();

//creating game over and restart sprites
gameOver = createSprite(350,200);
restart = createSprite(350,240);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.8;
restart.addImage(restartImg);
restart.scale = 0.8;
gameOver.visible = false;
restart.visible = false;
}

function draw() {
  
  background("black");

  balloon.collide(bottomGround);

  if(gameState === PLAY){

    //making the hot air balloon jump
    if(keyDown("space")) {
      balloon.velocityY = -6 ;
      jumpsound.play();
    }

    //adding gravity
     balloon.velocityY = balloon.velocityY + 2;

     
    Bar();

    //spawning top and bottom obstacles
    spawnObstaclesTop();
    spawnObstaclesBottom();
    coins();
 if(coinsGroup.isTouching(balloon)){
coinsGroup.destroyEach();
score=score+50

 }
//condition for END state
if(topObstaclesGroup.isTouching(balloon) || balloon.isTouching(topGround)
|| balloon.isTouching(bottomGround) || bottomObstaclesGroup.isTouching(balloon)){
//diesound.play();
//gameState = END;
life=life-1


}
if(life===0){
diesound.play();
gameState = END;

}
  }

  if(gameState === END) 
    {
          gameOver.visible = true;
          gameOver.depth = gameOver.depth+1
          restart.visible = true;
          restart.depth = restart.depth+1
          
          //all sprites should stop moving in the END state
          balloon.velocityX = 0;
          balloon.velocityY = 0;
          topObstaclesGroup.setVelocityXEach(0);
          bottomObstaclesGroup.setVelocityXEach(0);
          barGroup.setVelocityXEach(0);
          
          coinsGroup.setVelocityXEach(0);

          //setting -1 lifetime so that obstacles don't disappear in the END state
          topObstaclesGroup.setLifetimeEach(-1);
          bottomObstaclesGroup.setLifetimeEach(-1);
          coinsGroup.setLifetimeEach(-1);

          balloon.y = 200;
          
          //resetting the game
          if(mousePressedOver(restart)) 
          {
                reset();
          }

    } 

    drawSprites();
    Score();     
}

function reset()
{
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  topObstaclesGroup.destroyEach();
  bottomObstaclesGroup.destroyEach();
  coinsGroup.destroyEach();

  score=0;
  life=50;
}


function spawnObstaclesTop() 
{
  if(World.frameCount % 60 === 0) {
    obstacleTop = createSprite(700,50,40,50);

//obstacleTop.addImage(obsTop1);

obstacleTop.scale = 0.1;
obstacleTop.velocityX = -4;

//random y positions for top obstacles
obstacleTop.y = Math.round(random(10,100));

//generate random top obstacles
var rand = Math.round(random(1,2));
switch(rand) {
  case 1: obstacleTop.addImage(obsTop1);
          break;
  case 2: obstacleTop.addImage(obsTop2);
          break;
  default: break;
}

 //assign lifetime to the variable
obstacleTop.lifetime = 170;

balloon.depth = balloon.depth + 1;

topObstaclesGroup.add(obstacleTop);

  }
}

function spawnObstaclesBottom() 
{
      if(World.frameCount % 80 === 0) {
        obstacleBottom = createSprite(700,350,40,50);
    
    obstacleBottom.addImage(obsBottom1);
    obstacleBottom.debug=false;

    
    obstacleBottom.scale = 0.07;
    obstacleBottom.velocityX = -4;
    
    

   //generate random bottom obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacleBottom.addImage(obsBottom1);
              break;
      case 2: obstacleBottom.addImage(obsBottom2);
              break;
      case 3: obstacleBottom.addImage(obsBottom3);
              break;
      default: break;
    }

     //assign lifetime to the variable
   obstacleBottom.lifetime = 170;
    
   balloon.depth = balloon.depth + 1;

   bottomObstaclesGroup.add(obstacleBottom);
   
      }
}

 function Bar() 
 {
         if(World.frameCount % 60 === 0)
         {
           var bar = createSprite(400,200,10,800);
          bar.velocityX = -6
        
          
          bar.velocityX = -6
          bar.depth = balloon.depth;
          bar.lifetime = 70;
          bar.visible = false;

          barGroup.add(bar);
         }
}

function Score()
{
         if(balloon.isTouching(barGroup))
         {
           score = score + 1;
         }
        textFont("algerian");
        textSize(30);
        fill("black");
        text("Score: "+ score, 500, 50);
        text("life: "+ life, 500, 100);
  
}
async function getbackgroundimage(){
var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
var responseJson = await response.json()
var datetime = responseJson.datetime
var hour = datetime.slice(11,13)
if(hour>=06 && hour<=17){
  bg.addImage(bgImg)
  bg.scale=2.5
}
else{
  bg.addImage(bgImg2)
  bg.scale=1.5
  bg.x=350
  bg.y=150
}
}
  
function coins(){
if(World.frameCount%200===0){
  goldcoin = createSprite(700,200,50,50)
  goldcoin.y = Math.round(random(10,180))
  goldcoin.lifetime=380
  goldcoin.addImage(goldcoinImg)
  goldcoin.velocityX = -2
  goldcoin.scale = 0.1
  coinsGroup.add(goldcoin)
}
 
}
