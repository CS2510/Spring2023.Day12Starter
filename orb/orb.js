let baseSize = 20;
let heroSize = 15;
let baseOffset = 150;
let speed = 250;
let enemyBounds = 100
let enemySpeed = 100

class ControllerComponent extends Component {
  name = "ControllerComponent"
  start(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);

    // Add three color stops
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(.8, "rgba(0,0,150)")
    gradient.addColorStop(1, "black");

    Camera.main.getComponent("Camera").fillStyle = gradient
    this.setGradient = true;
  }
  update() {
    this.score = 0;
    //Check for collision
    let heroGameObject = GameObject.getObjectByName("HeroGameObject")
    let enemyGameObject = GameObject.getObjectByName("EnemyGameObject")

    let heroTransform = heroGameObject.transform;
    let enemyTransform = enemyGameObject.transform;

    let x1 = heroTransform.x;
    let x2 = enemyTransform.x;
    let y1 = heroTransform.y;
    let y2 = enemyTransform.y;

    let distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    let minDistance = heroTransform.sx + enemyTransform.sx;

    if (distance < minDistance) {
      SceneManager.changeScene(0)
    }
  }
}


class BaseComponent extends Component {
  draw(ctx) {
    ctx.fillStyle = "transparent";
    ctx.strokeStyle = "white"
    ctx.lineWidth = 3;

    //Glow if we are the next base
    let destinationY = -150;
    let hero = GameObject.getObjectByName("HeroGameObject").getComponent("HeroComponent")
    if (hero.isAtBottom) {
      destinationY = 150
    }
    if (this.transform.y != destinationY && hero.state == hero.DONE_STATE) {
      ctx.shadowColor = "white"
      ctx.shadowBlur = 8 * (Math.sin(Time.time * 5) /2 + 1) + 5
    }

    ctx.beginPath()
    ctx.arc(this.transform.x, this.transform.y, this.transform.sx, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke();

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
          this.transform.y += speed * Time.deltaTime;
        }
        else {
          this.transform.y -= speed * Time.deltaTime;
        }
      }
      else {
        this.state = this.DONE_STATE;
        GameObject.getObjectByName("ControllerGameObject").getComponent("ControllerComponent").score++;
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

class EnemyDrawComponent extends Component{
  draw(ctx){
    ctx.fillStyle = "black"
    ctx.beginPath();
    ctx.arc(this.transform.x, this.transform.y, this.transform.sx, 0, Math.PI*2)
    ctx.fill();

    ctx.fillStyle =  "orange";
    ctx.shadowColor = "orange"
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.arc(this.transform.x+8, this.transform.y, this.transform.sx/7, 0, Math.PI*2)
    ctx.fill();

    ctx.beginPath()
    ctx.arc(this.transform.x-8, this.transform.y, this.transform.sx/7, 0, Math.PI*2)
    ctx.fill();

    ctx.shadowBlur = 0
  }
}

class EnemyComponent extends Component {
  movingLeft = true;

  update() {
    if (this.movingLeft) {
      this.transform.x -= enemySpeed * Time.deltaTime;
      if (this.transform.x <= -enemyBounds) {
        this.movingLeft = false;
      }
    }
    else {
      this.transform.x += enemySpeed * Time.deltaTime;
      if (this.transform.x >= enemyBounds) {
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
      new Vector2(0, baseOffset),
      new Vector2(baseSize, baseSize)
    )

    this.addGameObject(
      new GameObject("Base2GameObject")
        .addComponent(new BaseComponent()),
      new Vector2(0, -baseOffset),
      new Vector2(baseSize, baseSize)
    )

    this.addGameObject(
      new GameObject("HeroGameObject")
        .addComponent(new Circle("white"))
        .addComponent(new HeroComponent()),
      new Vector2(0, baseOffset),
      new Vector2(heroSize, heroSize)
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

    // this.addGameObject(
    //   new GameObject("CornerCheck")
    //     .addComponent(new Circle("Green")),
    //   new Vector2(-50,-50*16/9),
    //   new Vector2(10,10)
    // )
  }
}

//export the main scene so the .html file can run the game.
export default new OrbScene();