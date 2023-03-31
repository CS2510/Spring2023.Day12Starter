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

class OrbScene extends Scene {
  start() {
    this.addGameObject(
      new GameObject("OrbGameObject")
        .addComponent(new OrbComponent())
    )
  }
}

//export the main scene so the .html file can run the game.
export default new OrbScene();