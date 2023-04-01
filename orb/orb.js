/**
 * Container for variables the game parameters
 * By placing all of these here, we can tune the game easily
 * as opposed to hunting across classes.
 */
class Globals{
  static baseSize = 20
  static heroSize = 15
  static baseOffset = 150
  static speed = 250
  static enemyBounds = 100
  static enemySpeed = 100
}

/**
 * Invisible controller component
 * -Sets up the camera
 * -Stores the score
 * -Checks for collisions.
 */
class ControllerComponent extends Component {
  name = "ControllerComponent"
  /**
   * Start the invisble controller
   * - Setup the camera
   * - Set the score to 0
   * @param {CanvasRenderingContext2D} ctx The context for drawing.
   */
  start(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);

    // Add three color stops
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(.8, "rgba(0,0,150)")
    gradient.addColorStop(1, "black");

    Camera.main.fillStyle = gradient
    this.setGradient = true;
    this.score = 0;
  }
  /**
   * Check the state of the game by looking for collisions.
   */
  update() {
    //Grab the relevant game objects
    let heroGameObject = GameObject.getObjectByName("HeroGameObject")
    let enemyGameObject = GameObject.getObjectByName("EnemyGameObject")

    //Grab the relevant transforms
    let heroTransform = heroGameObject.transform;
    let enemyTransform = enemyGameObject.transform;

    //Grab the individual positions
    let x1 = heroTransform.x;
    let x2 = enemyTransform.x;
    let y1 = heroTransform.y;
    let y2 = enemyTransform.y;

    //Find the Euclidean distance between points
    let distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

    //Sum the radii
    let minDistance = heroTransform.sx + enemyTransform.sx;

    //Check to see if the distance between centers is less than 
    //the sum of the radii. If it is, end the game
    if (distance < minDistance) {
      //This effectively restarts the game since
      //it reloads the scene and calls start again.
      //This is rather abrupt. An improvement would give the
      //user more feedback about what is happening.
      SceneManager.changeScene(0)
    }
  }
}

/**
 * Class for the base components.
 * The bases are the places where 
 * the hero is "safe"
 */
class BaseComponent extends Component {
  /**
   * Draw the base to the screen
   * We want the bases to be outlined
   * We also want them to have a glow if they are the next
   * destination.
   * We also want any glow to pulse slightly.
   * @param {CanvasRenderingContext2D} ctx The context for drawing.
   */
  draw(ctx) {
    //To draw only an outline, set the fillStyle to transparent
    //Since we are manually drawing, we could just leave out fillStyle
    ctx.fillStyle = "transparent";

    //The color of the outline
    ctx.strokeStyle = "white"

    //Set the width of the outline
    ctx.lineWidth = 3;

    //Glow if we are the next base

    //Grab the player's destination
    let destinationY = -150;

    //Grab the players direction
    let hero = GameObject.getObjectByName("HeroGameObject").getComponent("HeroComponent")
    
    //Switch the destination if needed
    if (hero.isAtBottom) {
      destinationY = 150
    }

    //If the hero is done moving and not at the destination...
    if (this.transform.y != destinationY && hero.state == hero.DONE_STATE) {
      //Add a pulse to the base
      ctx.shadowColor = "white"

      //Use a trig function to make it appear to pulse
      ctx.shadowBlur = 8 * (Math.sin(Time.time * 5) / 2 + 1) + 5
    }

    //Draw the base
    ctx.beginPath()
    ctx.arc(this.transform.x, this.transform.y, this.transform.sx, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke();

    //Turn off any lingering "shadows"
    ctx.shadowColor = "transparent"
  }
}

class HeroComponent extends Component {
  name = "HeroComponent"
  MOVING_STATE = 1
  DONE_STATE = 2
  isAtBottom = true
  start() {
    this.state = this.DONE_STATE
  }
  update() {
    if (this.state == this.MOVING_STATE) {
      let destinationY = 150;
      if (!this.isAtBottom) {
        destinationY = -150
      }

      if (this.transform.y != destinationY) {
        if (this.transform.y < destinationY) {
          this.transform.y += Globals.speed * Time.deltaTime;
        }
        else {
          this.transform.y -= Globals.speed * Time.deltaTime;
        }
      }
      else {
        this.state = this.DONE_STATE;
        let controller = 
        GameObject.getObjectByName("ControllerGameObject")
          .getComponent("ControllerComponent")
          let currentScore = parseInt(controller.score);
          currentScore ++;
          controller.score = currentScore
      }
    }
    else {
      if (keysDown[" "]) {
        this.state = this.MOVING_STATE;
        this.isAtBottom = !this.isAtBottom;
      }
    }
  }
}

class ScoreController extends Component {
  update() {
    this.parent.getComponent("Text").string =
      ""
      + GameObject.getObjectByName("ControllerGameObject").getComponent("ControllerComponent").score
  }
}

class EnemyDrawComponent extends Component {
  draw(ctx) {
    ctx.fillStyle = "black"
    ctx.beginPath();
    ctx.arc(this.transform.x, this.transform.y, this.transform.sx, 0, Math.PI * 2)
    ctx.fill();

    ctx.fillStyle = "orange";
    ctx.shadowColor = "orange"
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.arc(this.transform.x + 8, this.transform.y, this.transform.sx / 7, 0, Math.PI * 2)
    ctx.fill();

    ctx.beginPath()
    ctx.arc(this.transform.x - 8, this.transform.y, this.transform.sx / 7, 0, Math.PI * 2)
    ctx.fill();

    ctx.shadowBlur = 0
  }
}

class EnemyComponent extends Component {
  movingLeft = true;

  update() {
    if (this.movingLeft) {
      this.transform.x -= Globals.enemySpeed * Time.deltaTime;
      if (this.transform.x <= -Globals.enemyBounds) {
        this.movingLeft = false;
      }
    }
    else {
      this.transform.x += Globals.enemySpeed * Time.deltaTime;
      if (this.transform.x >= Globals.enemyBounds) {
        this.movingLeft = true;
      }
    }
  }
}


class OrbScene extends Scene {
  start() {

    this.addGameObject(
      new GameObject("ControllerGameObject").addComponent(new ControllerComponent())
    )

    this.addGameObject(
      new GameObject("Base1GameObject")
        .addComponent(new BaseComponent()),
      new Vector2(0, Globals.baseOffset),
      new Vector2(Globals.baseSize, Globals.baseSize)
    )

    this.addGameObject(
      new GameObject("Base2GameObject")
        .addComponent(new BaseComponent()),
      new Vector2(0, -Globals.baseOffset),
      new Vector2(Globals.baseSize, Globals.baseSize)
    )

    this.addGameObject(
      new GameObject("HeroGameObject")
        .addComponent(new Circle("white"))
        .addComponent(new HeroComponent()),
      new Vector2(0, Globals.baseOffset),
      new Vector2(Globals.heroSize, Globals.heroSize)
    )

    this.addGameObject(
      new GameObject("TitleGameObject")
        .addComponent(new Text("Jumping Game", "White", "10pt Trebuchet MS")),
      new Vector2(-125, -200)
    )

    this.addGameObject(
      new GameObject("ScoreGameObject")
        .addComponent(new Text("0", "White", "10pt Trebuchet MS"))
        .addComponent(new ScoreController()),
      new Vector2(-125, -200 + 15)
    )

    this.addGameObject(
      new GameObject("EnemyGameObject")
        .addComponent(new EnemyComponent())
        .addComponent(new EnemyDrawComponent()),
      new Vector2(0, 0),
      new Vector2(15, 15)
    )
  }
}

//export the main scene so the .html file can run the game.
export default new OrbScene();