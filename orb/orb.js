//The code for our example game
class OrbComponent extends Component {
  start() {
    Camera.main.getComponent("Camera").fillStyle = "black"
  }
  update() {
  }
  draw(ctx) {
    ctx.fillStyle = `rgb(0, 0,255)`
    ctx.fillRect(0, 0, 100, 100)
  }
}

class ControllerComponent extends Component {
  name = "ControllerComponent"
  start() {
    Camera.main.getComponent("Camera").fillStyle = "pink"
    this.score = 0;
  }

}

class BaseComponent extends Component {

}

let speed = 2;
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
    // this.addGameObject(new GameObject("OrbGameObject").addComponent(new OrbComponent()))
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

    let v = new Vector2(9/16*-300, -200)
    this.addGameObject(new GameObject("ScoreGameObject")
      .addComponent(new Text("Squirrel Jumping Game. Score:", "Blue", "10pt Arial"))
      .addComponent(new ScoreController()),
      v
    )



  }
}

//export the main scene so the .html file can run the game.
export default new OrbScene();