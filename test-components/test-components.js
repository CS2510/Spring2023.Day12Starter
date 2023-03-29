class ExampleScene extends Scene {
  start() {
    this.addGameObject(
      new GameObject("ExampleRectangle")
        .addComponent(new Rectangle("black", "magenta", 5)),
      new Vector2(100, 100),
      new Vector2(50, 25)
    )
    
    this.addGameObject(
      new GameObject("ExampleCircle")
        .addComponent(new Circle("black", "red", 10)),
      new Vector2(300, 300),
      new Vector2(25, 25)
    )

    this.addGameObject(
      new GameObject("ExampleLine")
        .addComponent(new Line("blue", 10)),
      new Vector2(200, 200),
      new Vector2(25, 25)
    )

    this.addGameObjectTransform(
      new GameObject("ExampleFromToLine")
        .addComponent(
          new Line("Green", 15)),
      Transform.fromTo(0, 0, 100, 100)
    );
  }
}

//export the main scene so the .html file can run the game.
export default new ExampleScene();