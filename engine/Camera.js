
/**
 * A camera engine-level component
 */
 class Camera extends Component {
    /** The name of the component */
    name = "Camera"
  
    /** The fill color of the component */
    fillStyle
  
   
    /**
     * Create a circle component. 
     * Has an optional color for fillStyle
     * @param {Color} fillStyle 
     */
    constructor(fillStyle = "white") {
      super();
      this.fillStyle = fillStyle
    }

    static get main(){
      let scene = SceneManager.getActiveScene();
      return scene.gameObjects[0].components[1]
    }
  
    /**
     * Draw the circle to the given context.
     * @param {2DContext} ctx The context to draw to.
     */
    // draw(ctx) {
    //   //Set the fill style
    //   ctx.fillStyle = this.fillStyle
    //   ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // }
  }
  
  //Add circle to the global namespace.
  window.Camera = Camera;