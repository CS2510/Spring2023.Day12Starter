/**
 * Container for variables the game parameters
 * By placing all of these here, we can tune the game easily
 * as opposed to hunting across classes.
 */
class Globals {
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

/**
 * Class for the hero component
 * This class maintains a state machine for the hero.
 * Either the hero is moving (MOVING_STATE) or not moving
 * (DONE_STATE).
 */
class HeroComponent extends Component {
  name = "HeroComponent"

  //The states the hero can have
  MOVING_STATE = 1  //The hero is moving and ignores input
  DONE_STATE = 2    //The hero is not moving

  //True if the hero is at the bottom base
  isAtBottom = true

  /**
   * Start the component by setting the state to
   * not moving (DONE_STATE)
   */
  start() {
    this.state = this.DONE_STATE
  }

  /**
   * Update the hero component
   * Since we have two states, this is divided into two
   */
  update() {
    if (this.state == this.MOVING_STATE) {
      //The hero is moving (input ignored, we check to see if we are arrived)

      //Figure out where our current destination is in world coordinates
      let destinationY = 150;
      if (!this.isAtBottom) {
        destinationY = -150
      }

      //Check to see if we have arrived.
      //We can't just check using == since floating points
      //can be off. Instead we check to see if the difference
      //is less than the distance travelled during an update
      let difference = Math.abs(this.transform.y - destinationY)
      if (difference > Globals.speed * Time.deltaTime) {
        //If we are not close, we move the hero
        //We always scale by deltaTime since
        //framerates can differ by device
        if (this.transform.y < destinationY) {
          this.transform.y += Globals.speed * Time.deltaTime;
        }
        else {
          this.transform.y -= Globals.speed * Time.deltaTime;
        }
      }
      else {
        //If we have arrived, make sure we are centered on the base
        this.transform.y = destinationY

        //Change the state to not moving
        this.state = this.DONE_STATE;

        //Grab the controller so we can update the score.
        //We use parseInt to make sure that the score hasn't turned into a string
        let controller =
          GameObject.getObjectByName("ControllerGameObject")
            .getComponent("ControllerComponent").score++
      }
    }
    else {
      //If we aren't moving, check for user input
      if (keysDown[" "]) {
        //Change our state to moving
        this.state = this.MOVING_STATE;
        //Update our destination
        this.isAtBottom = !this.isAtBottom;
      }
    }
  }
}

/**
 * Component for the score text
 */
class ScoreController extends Component {
  //Set the value of the score text to be the score
  //This is very unoptimized.
  //It would be faster to store the address of the ControllerComponent
  //in a start() function.
  //It would also be faster to use message passing so 
  //that we only update the text when the score changes.
  update() {
    this.parent.getComponent("Text").string = GameObject.getObjectByName("ControllerGameObject").getComponent("ControllerComponent").score
  }
}

/**
 * The component for drawing the enemy
 */
class EnemyDrawComponent extends Component {
  /**
   * Draw the enemy
   * This includes the enemy's circle and enemy's eyes
   * @param {CanvasRenderingContext2D} ctx The context for drawing.
   */
  draw(ctx) {

    //Draw the main part of the enemy
    ctx.fillStyle = "black"
    ctx.beginPath();
    ctx.arc(this.transform.x, this.transform.y, this.transform.sx, 0, Math.PI * 2)
    ctx.fill();

    //Draw glowing eyes
    ctx.fillStyle = "orange";
    ctx.shadowColor = "orange"
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.arc(this.transform.x + 8, this.transform.y, this.transform.sx / 7, 0, Math.PI * 2)
    ctx.fill();

    ctx.beginPath()
    ctx.arc(this.transform.x - 8, this.transform.y, this.transform.sx / 7, 0, Math.PI * 2)
    ctx.fill();

    //Reset the blur
    ctx.shadowBlur = 0
  }
}

/**
 * The enemy component
 */
class EnemyComponent extends Component {
  //Track which way the enemy is moving
  movingLeft = true;

  /**
   * Update the enemy
   * This is done by moving the enemy based on its direction
   */
  update() {
    //Update based on its direction
    if (this.movingLeft) {
      this.transform.x -= Globals.enemySpeed * Time.deltaTime;
      //Change directions if we have reached an extreme
      if (this.transform.x <= -Globals.enemyBounds) {
        this.movingLeft = false;
      }
    }
    else {
      this.transform.x += Globals.enemySpeed * Time.deltaTime;
      //Change directions if we have reached an extreme
      if (this.transform.x >= Globals.enemyBounds) {
        this.movingLeft = true;
      }
    }
  }
}

/**
 * The main scene for the game
 */
class OrbScene extends Scene {
  /**
   * Star the game by creating the game objects
   */
  start() {
    //Create the invisible controller
    this.addGameObject(new GameObject("ControllerGameObject").addComponent(new ControllerComponent()))

    //Add the first base
    this.addGameObject(
      new GameObject("Base1GameObject")
        .addComponent(new BaseComponent()),
      new Vector2(0, Globals.baseOffset),
      new Vector2(Globals.baseSize, Globals.baseSize)
    )

    //Add the second base
    this.addGameObject(
      new GameObject("Base2GameObject")
        .addComponent(new BaseComponent()),
      new Vector2(0, -Globals.baseOffset),
      new Vector2(Globals.baseSize, Globals.baseSize)
    )

    //Add the player 
    this.addGameObject(
      new GameObject("HeroGameObject")
        .addComponent(new Circle("white"))
        .addComponent(new HeroComponent()),
      new Vector2(0, Globals.baseOffset),
      new Vector2(Globals.heroSize, Globals.heroSize)
    )

    //Add the static title text
    this.addGameObject(
      new GameObject("TitleGameObject")
        .addComponent(new Text("Jumping Game", "White", "10pt Trebuchet MS")),
      new Vector2(-125, -200)
    )

    //Add the dynamic score text
    this.addGameObject(
      new GameObject("ScoreGameObject")
        .addComponent(new Text("0", "White", "10pt Trebuchet MS"))
        .addComponent(new ScoreController()),
      new Vector2(-125, -200 + 15)
    )

    //Add the enemy object
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