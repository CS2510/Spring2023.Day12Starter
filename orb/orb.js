class ControllerComponent extends Component {
  name = "ControllerComponent"
  start() {
    Camera.main.getComponent("Camera").fillStyle = "pink"
    this.score = 0;
  }
  update(){
    //Check for collision
    let squirrelGameObject = GameObject.getObjectByName("SquirrelGameObject")
    let baddieGameObject = GameObject.getObjectByName("BaddieGameObject")
    
    let squirrelTransform = squirrelGameObject.transform;
    let baddieTransform = baddieGameObject.transform;

    let x1 =squirrelTransform.x;
    let x2 = baddieTransform.x;
    let y1 = squirrelTransform.y;
    let y2 = baddieTransform.y;

    let distance = Math.sqrt((x1-x2)**2+(y1-y2)**2);
    let minDistance = squirrelTransform.sx + baddieTransform.sx;

    if(distance < minDistance){
      SceneManager.changeScene(0)
    }



  }
}

let baddieBounds = 100
class BaddieComponent extends Component {
  movingLeft = true;
  
  update(){
    if(this.movingLeft){
      this.transform.x--;
      if(this.transform.x <= -baddieBounds){
        this.movingLeft = false;
      }
    }
    else{
      this.transform.x++;
      if(this.transform.x >= baddieBounds){
        this.movingLeft = true;
      }
    }
  }

}

let speed = 10;
class SquirrelComponent extends Component {
  MOVING_STATE = 1
  DONE_STATE = 2
  isAtBottom = true
  start(){
    this.state = this.DONE_STATE
  }
  update(){
    if(this.state == this.MOVING_STATE){
      let destinationY = 150;
      if(!this.isAtBottom){
        destinationY = -150
      }
      
      if(this.transform.y != destinationY){
        if(this.transform.y < destinationY){
          this.transform.y += speed;
        }
        else{
          this.transform.y -= speed;
        }
      }
      else{
        this.state = this.DONE_STATE;
        GameObject.getObjectByName("ControllerGameObject").getComponent("ControllerComponent").score++;
      }

    }
    else{
      //Check for input
      if(keysDown[" "]){
        this.state = this.MOVING_STATE;
        this.isAtBottom = !this.isAtBottom;
      }
    }
  }


}

class EnemyComponent extends Component {

}

class ScoreController extends Component {
  start(){

  }
  update(){
    this.parent.getComponent("Text").string = 
    "Squirrel Jumping Game. Score=" 
    + GameObject.getObjectByName("ControllerGameObject").getComponent("ControllerComponent").score 
  }

}


let baseSize = 20;
let squirrelSize = 15;
let baseOffset = 150;

class OrbScene extends Scene {
  start() {

    this.addGameObject(
      new GameObject("ControllerGameObject").addComponent(new ControllerComponent())
      )

    this.addGameObject(
      new GameObject("Base1GameObject").addComponent(new Circle("Red", "Black",2)),
      new Vector2(0, baseOffset),
      new Vector2(baseSize, baseSize)
      )

    this.addGameObject(
      new GameObject("Base2GameObject").addComponent(new Circle("Blue", "Black",2)),
      new Vector2(0, -baseOffset),
      new Vector2(baseSize,baseSize)
      )

    this.addGameObject(
      new GameObject("SquirrelGameObject")
      .addComponent(new Circle("brown", "orange"))
      .addComponent(new SquirrelComponent()),
      new Vector2(0,baseOffset),
      new Vector2(squirrelSize, squirrelSize)
      )

    this.addGameObject(
      new GameObject("ScoreGameObject")
      .addComponent(new Text("Squirrel Jumping Game. Score:", "Blue", "10pt Arial"))
      .addComponent(new ScoreController()),
      new Vector2(9/16*-300, -200)
    )

    this.addGameObject(
      new GameObject("BaddieGameObject")
      .addComponent(new Circle("Black"))
      .addComponent(new BaddieComponent()),
      new Vector2(0,0),
      new Vector2(15,15)
    )



  }
}

//export the main scene so the .html file can run the game.
export default new OrbScene();