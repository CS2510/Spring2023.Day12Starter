//The code for the blink game

//Start by importing the engine
//To match Unity, we use an import with side effects
//instead of a traditional import
import "/engine/engine.js"

/**
 * The logic behind the blink game.
 * You can think of this as the controller of the game.
 * The component tracks the passage of time. 
 * If up is true, then the passage of time makes the screen
 * a brighter color of green.
 * When full green is reach, up becomes false and on
 * succeeding frames the screen gets darker.
 * The process reverses when the color reaches black.
 */
class BlinkComponent extends Component {
    /**
     * Reset all values in the component
     */
    start() {
        this.time = 0
        this.up = true
    }
    /**
     * Update the component by changing the color
     */
    update() {
        if (this.up) {
            this.time++;
            if (this.time >= 255)
                this.up = false
        }
        else {
            this.time--
            if (this.time <= 0) {
                this.up = true
            }
        }
    }
    /**
     * Draw the color to the screen.
     * @param {The drawing context.} ctx 
     */
    draw(ctx) {
        ctx.fillStyle = `rgb(0, ${this.time} ,0)`

        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
}

/**
 * Create an instance of the main scene and add the
 * blink component.
 */
let mainScene = new Scene();
mainScene.start = function () {

    this.addGameObject(
        new GameObject("BlinkGameObject")
            .addComponent(new BlinkComponent())
    )
}

//export the main scene so the .html file can run the game.
export default mainScene;