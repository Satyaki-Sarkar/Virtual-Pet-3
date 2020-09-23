//Create variables here
var dog, happyDog, dogImage, database, foodS, foodStock, DogImage, HappyDogImage;
var dogFoodCounter,c,foodRemaining;
var milk;
var gameState="PLAY";
var fedTime, lastFed,foodObj,foodLeft;
var changeState,readState;
var bedRoomImage,gardenImage,washRoomImage,BedRoomImage,GardenImage,WashRoomImage;
var feedThePetButton, addFoodButton;

function preload()
{
	//load images here
  dogImage = loadImage("images/dogImg.png",DogImage);
  happyDog = loadImage("images/dogImg1.png",HappyDogImage);
  bedRoomImage = loadImage("virtual pet images/Bed Room.png",BedRoomImage);
  gardenImage = loadImage("virtual pet images/Garden.png",GardenImage);
  washRoomImage = loadImage("virtual pet images/Wash Room.png",WashRoomImage);
}

function setup() 
{
	createCanvas(1200, 800);
  foodObj = new Food();

  dog = createSprite(950,250,10,10);
  dog.addImage(dogImage);
  dog.scale=0.4;

  database=firebase.database();
  foodStock=database.ref("Food");
  foodStock.on("value",readPosition,showError);

  fedTime=database.ref("FeedTime");
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState=database.ref("GameState");
  readState.on("value",function(data){
    gameState=data.val();
  });

  dogFoodCounter="Food Remaining";

    feedThePetButton = createButton('Click to feed the pet');
    feedThePetButton.position(650,60);

    addFoodButton = createButton('Click to add food for the pet');
    addFoodButton.position(1050,60);

  
}


function draw() 
{  
  background(46,139,87);

  c--;
    if(c<=0){
      dog.addImage(dogImage);
    }


  if(gameState==="PLAY" || gameState==="Hungry")
  {
    dog.visible = true;

    addFoodButton.mousePressed(addFood);
    feedThePetButton.mousePressed(feedFood);

    foodObj.display();

    if(dogFoodCounter==="Food Remaining"){

    }else {
      gameState="END";
    }

  }else  if(gameState==="END")
  {
    dog.addImage(dogImage);
    if(keyWentDown("Space")){
      gameState="PLAY";
      foodS=20;
      dogFoodCounter="Food Remaining";
      foodStock.update({
        Food : 20
      });
    }
  }

  changingBackground();

  if(gameState!=="Hungry" && gameState!=="PLAY"){
    feedThePetButton.hide();
    addFoodButton.hide();
    dog.visible=false;
  }else{

    feedThePetButton.show();
    addFoodButton.show();
    dog.visible=true;
  }

  drawSprites();
    //add styles here
    textSize(20);
    fill("Black");
    if(dogFoodCounter==="Food Remaining"){
      if(lastFed>12){
        text("Last Feed : "+ lastFed%12+ " PM",20,20);
      }else if(lastFed===12){
        text("Last Feed : "+ lastFed+" PM",20,20);
      }else if(lastFed===0){
        text("Last Feed : 12 AM",20,20);
      }else{
        text("Last Feed : "+lastFed+"AM",20,20);
      }
      // text("NOTE : Press the buttons to feed Rocky milk, and add food for Rocky.",20,480);
    }

    if(gameState==="END")
  {
    text("Press SPACE to reset.",20,480)
    text("Food Over",20,20);
  }


}

function writeStock(x){  
 if(x<=1){
    x=0;
    dogFoodCounter="Food Over";
    gameState="END";
  } else {
    x--;
  }

  foodStock.update({
    Food : x 
  });
}

function readPosition(data){
  pos=data.val();
  foodRemaining=pos.Food;
  foodS = foodRemaining;
}

function showError(err){
    console.log(err);
}

function addFood(){
  dog.addImage(dogImage);
  if(foodS<20)
  {
    foodS++;
    foodStock.update({
    Food : foodS 
  });
  }
}

function feedFood(){
    dog.addImage(happyDog);
    c=20;

    lastFed=hour();

    writeStock(foodS);
    foodStock.update({
    Food : foodS 
  });

    database.ref('/').update({
      FeedTime : lastFed
    }) 
}

function updateState(state)
{
  database.ref('/').update({
    GameState : state
  });
}

function changingBackground(){
  currentTime=hour();
  if(currentTime===(lastFed+1)){
    updateState("Playing");
    foodObj.garden();
  }else if(currentTime===(lastFed+2)){
    updateState("Sleeping");
    foodObj.bedRoom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    updateState("Bathing");
    foodObj.washRoom();
  }else {
    updateState("Hungry");
    foodObj.display();
  }
}