//Create variables here
var dog, happyDog, dogImage, database, foodS, foodStock, DogImage, HappyDogImage;
var dogFoodCounter,c,foodRemaining;

function preload()
{
	//load images here
  dogImage = loadImage("images/dogImg.png",DogImage);
  happyDog = loadImage("images/dogImg1.png",HappyDogImage);
}

function setup() 
{
	createCanvas(500, 500);
  dog = createSprite(250,250,10,10);
  dog.addImage(dogImage);
  dog.scale=0.4;

  database=firebase.database();
  foodStock=database.ref("Food");
  foodStock.on("value",readPosition,showError);

  foodS=20;
  dogFoodCounter="Food Remaining";

  
}


function draw() 
{  
  background(46,139,87);

  if(dogFoodCounter==="Food Remaining"){
    if(keyWentDown(UP_ARROW))
    {
      writeStock(foodS);
      dog.addImage(happyDog);
      c=20;
      foodS--;
    }
  }

  c--;
  if(c<=0){
    dog.addImage(dogImage);
  }
  drawSprites();
  //add styles here
  textSize(20);
  fill("Black");
  if(dogFoodCounter==="Food Remaining"){
    text("Food Remaining : "+foodRemaining,20,20);
    text("NOTE : Press UP_ARROW to feed Rocky milk.",20,480);
  }else {
    text("Food Over",20,20);
  }


}

function writeStock(x){  
 if(x<=1){
    x=0;
    dogFoodCounter="Food Over";
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
}

function showError(err){
    console.log(err);
}