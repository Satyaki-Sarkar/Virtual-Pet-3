//Create variables here
var dog, happyDog, dogImage, database, foodS, foodStock, DogImage, HappyDogImage;
var dogPosition;

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

  
}


function draw() 
{  
  background(46,139,87);

  if(keyWentDown(UP_ARROW))
  {
    writeStock(foodStock);
    dog.addImage(happyDog);
  }
  drawSprites();
  //add styles here

}

function writeStock(x){  
 if(x<=0){
    x=0;
  } else {
    x--;
  }

  foodStock.update({
    Food : x 
  });
}

function readPosition(data){
  pos=data.val();
  food=pos;
  console.log(food);
}

function showError(err){
    console.log(err);
}