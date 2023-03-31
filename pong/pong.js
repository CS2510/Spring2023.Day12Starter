import "/engine/engine.js"

//-----------------------------------------------------
//Start

let reset = true

class PersistentPointsComponent extends Component {
    name = "PersistentPointsComponent"
    points = 0
    start() {
        // if(GameObject.getObjectByName("PersistentPointsGameObject") != this.parent){
        //     this.parent.destroy();
        //     console.log("Removing duplicate persistent points component");
        // }
        // else{
        //     console.log("Only one persistent points component. Move on.")
        // }
    }
    updatePoints(points) {
        this.points = points;
        document.cookie = this.points;
    }
}

class StartController extends Component {
    start() {
        this.freezeTime = 0
        this.maxFreezeTime = 1
        GameObject.getObjectByName("PersistentPointsGameObject").doNotDestroyOnLoad()

    }
    update() {
        this.freezeTime += Time.deltaTime
        if (keysDown["a"] && this.freezeTime >= this.maxFreezeTime) {
            SceneManager.changeScene(1)
        }

    }

}

class ScoreSetterComponent extends Component {
    name = "ScoreSetterComponent"
    start() {
        this.maxScoreComponent = this.parent.getComponent("Text");
    }
    update() {
        let persistentPointsGameObject = GameObject.getObjectByName("PersistentPointsGameObject");

        if (persistentPointsGameObject) {

            this.maxScoreComponent.string = "Max Score: "

            let persistentPointsComponent = persistentPointsGameObject
                .getComponent("PersistentPointsComponent")

            this.maxScoreComponent.string += persistentPointsComponent.points
        }
    }
}

class StartCameraComponent extends Component {
    start() {

    }
    update() {
        this.parent.transform.x += 0;
        // this.parent.transform.sx = 10;
        // this.parent.transform.sy = 10;
    }
}

class StartScene extends Scene {
    constructor() {
        super("black")
    }
    start() {
        this.addGameObject(new GameObject("StartConttrollerGameObject").addComponent(new StartController()))
        this.addGameObject(new GameObject("PersistentPointsGameObject").addComponent(new PersistentPointsComponent()))
        this.addGameObject(new GameObject("WelcomeToPongGameObject").addComponent(new Text("Welcome to Pong", "white")), new Vector2(-125, 20))
        this.addGameObject(new GameObject("MaxScoreGameObject").addComponent(new Text("", "white")).addComponent(new ScoreSetterComponent()), new Vector2(-125, 45))
        Camera.main.parent.addComponent(new StartCameraComponent());
    }
}

//-----------------------------------------------------
//Main

class MainCameraComponent extends Component{
    start(){

    }
    update(){
        // this.transform.x = 75;
        //  this.transform.y = 75;
        //  this.transform.sx = 3;
        //  this.transform.sy = 3;
        this.transform.x = 50
    }
}

class MainController extends Component {
    start() {
        for (let i = 0; i < 1; i++) {
            //Create a new pong ball
            let ballGameObject = new GameObject("BallGameObject")
            let ballComponent = new BallComponent();
            ballComponent.addListener(this)
            ballComponent.addListener(GameObject.getObjectByName("PointsGameObject").getComponent("PointsComponent"))
            ballGameObject.addComponent(ballComponent)

            let circle = new Circle()
            ballGameObject.addComponent(circle)
            circle.fillStyle = "yellow"
            circle.transform.sx = 5
            circle.transform.x = -15 * i
            GameObject.instantiate(ballGameObject)
        }
    }
    handleUpdate(component, eventName) {
        if (eventName == "BallOutOfBounds") {
            //Check to see if there are any more pong balls in play
            let ballGameObjects = GameObject.getObjectsByName("BallGameObject")
            let countLive = 0;
            for (let ballGameObject of ballGameObjects) {
                if (!ballGameObject.markedForDestroy) {
                    countLive++;
                }
            }
            if (countLive == 0) {
                SceneManager.changeScene(2)
            }
        }
    }
}

class PointsComponent extends Component {
    name = "PointsComponent"
    start() {
        this.points = 0
    }
    handleUpdate(component, eventName) {
        if (eventName == "Rebound") {
            this.points++;
            let persistentPointsComponent = GameObject
                .getObjectByName("PersistentPointsGameObject")
                .getComponent("PersistentPointsComponent")
            if (this.points > persistentPointsComponent.points) {
                persistentPointsComponent.updatePoints(this.points)
            }
        }
    }
    update() {
        this.parent.getComponent("Text").string = "Game Points: " + this.points;
    }

}

class BallComponent extends Component {
    name = "BallComponent"
    start() {
        this.margin = 0;
        this.size = 100;
        this.transform.x = this.margin + this.size / 2 + this.transform.x
        this.transform.y = this.margin + this.size / 2
        this.pongVX = 3
        this.pongVY = -2
    }
    update() {

        let paddleGameObject = GameObject.getObjectByName("PaddleGameObject")
        let paddleComponent = paddleGameObject.getComponent("PaddleComponent")
        let paddleWidth = paddleComponent.paddleWidth;
        let paddleX = paddleComponent.transform.x;

        //Model of MVC
        this.transform.x += this.pongVX * Time.deltaTime * 10
        this.transform.y += this.pongVY * Time.deltaTime * 10

        if (this.transform.x > this.margin + this.size) {
            this.pongVX *= -1
        }
        if (this.transform.y > this.margin + this.size) {
            //Check for a collision with the paddle
            if (paddleX - paddleWidth / 2 <= this.transform.x && paddleX + paddleWidth / 2 >= this.transform.x) {
                this.pongVY *= -1
                this.updateListeners("Rebound")
            }
            else {
                this.parent.destroy()
                this.updateListeners("BallOutOfBounds")
            }
        }
        if (this.transform.x < this.margin) {
            this.pongVX *= -1
        }
        if (this.transform.y < this.margin) {
            this.pongVY *= -1
        }
    }
}

class PaddleComponent extends Component {
    name = "PaddleComponent"
    start() {
        this.margin = 0;
        this.size = 100;
        this.transform.x = this.margin + this.size / 2
        this.paddleWidth = 40;
    }
    update() {


        //Update the paddle based on input
        if (keysDown["ArrowLeft"]) {
            this.transform.x -= 2 * Time.deltaTime * 20;
        }
        else if (keysDown["ArrowRight"]) {
            this.transform.x += 2 * Time.deltaTime * 20
        }

        //Constrain the paddle position
        if (this.transform.x < this.margin + this.paddleWidth / 2) {
            this.transform.x = this.paddleWidth / 2 + this.margin
        }
        if (this.transform.x > this.margin - this.paddleWidth / 2 + this.size) {
            this.transform.x = -this.paddleWidth / 2 + this.margin + this.size
        }
    }
    draw(ctx) {
        //Now draw the paddle
        ctx.beginPath()
        ctx.moveTo(this.transform.x - this.paddleWidth / 2, this.margin + this.size)
        ctx.lineTo(this.transform.x + this.paddleWidth / 2, this.margin + this.size)
        ctx.stroke()
    }
}

class WallsComponent extends Component {
    name = "WallsComponent"
    start() {
        this.margin = 0;
        this.size = 100;
    }
    draw(ctx) {
        ctx.strokeStyle = "black"
        ctx.beginPath()
        ctx.moveTo(this.margin, this.margin)
        ctx.lineTo(this.margin + this.size, this.margin)
        ctx.lineTo(this.margin + this.size, this.margin + this.size)
        ctx.moveTo(this.margin, this.margin + this.size)
        ctx.lineTo(this.margin, this.margin)
        ctx.stroke()
    }
}

class MainScene extends Scene {
    constructor() {
        super("green")
    }
    start() {
        this.addGameObject(
            new GameObject("PointsGameObject")
                .addComponent(new PointsComponent())
                .addComponent(new Text("Game Points: 0", "black")),
            new Vector2(0, -50))

        this.addGameObject(
            new GameObject("MaxPointsGameObject")
                .addComponent(new ScoreSetterComponent())
                .addComponent(new Text("", "black")),
            new Vector2(0, -30))

        this.addGameObject(new GameObject("PaddleGameObject").addComponent(new PaddleComponent()))
        this.addGameObject(new GameObject("WallsGameObject").addComponent(new WallsComponent()))
        this.addGameObject(new GameObject("ControllerGameObject").addComponent(new MainController()))
        Camera.main.parent.addComponent(new MainCameraComponent());
    }
}

//-----------------------------------------------------
//End

class EndController extends Component {
    update() {
        if (keysDown["a"]) {
            SceneManager.changeScene(0)
        }
    }
}

class EndScene extends Scene {
    constructor() {
        super("Black")
    }
    start() {
        this.addGameObject(new GameObject("EndControllerGameObject").addComponent(new EndController()))
        this.addGameObject(new GameObject("EndTextGameObject").addComponent(new Text("You Died", "red")), new Vector2(-100, 20))
        this.addGameObject(
            new GameObject("MaxPointsGameObject")
                .addComponent(new ScoreSetterComponent())
                .addComponent(new Text("", "red")),
            new Vector2(-100, 37))

    }
}

let startScene = new StartScene()
let mainScene = new MainScene()
let endScene = new EndScene()

window.allScenes = [startScene, mainScene, endScene]
