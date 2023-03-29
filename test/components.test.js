/**
    * Unit tests for the component classes
    */
Circle.test = function () {
  testSection("Circle constructor")
  let c = new Circle("red", "blue", 10);
  assert(c.fillStyle == "red", "First argument of constructor")
  assert(c.strokeStyle == "blue", "Second argument of constructor")
  assert(c.lineWidth == 10, "Third argument of constructor")
}

Component.test = function () {
  testSection("Component constructor")
  let c = new Component();
  assert(!c.name, "The name is empty")
  assert(!c.parent, "The parent is empty")
  assert(!c.starter, "started is false")
}

GameObject.test = function () {
  testSection("Game Object constructor")
  let gameObject = new GameObject();

  assert(gameObject.components.length == 1,
    "Default Game Object has one component");
  assert(gameObject.components[0] == gameObject.transform,
    ".transform returns the first component.")
  assert(gameObject.components[0] instanceof Transform,
    "First component is of type component.")
}

Line.test = function () {
  testSection("Line")
  console.log("[Not Implemented]")
}

Rectangle.test = function () {
  testSection("Rectangle")
  console.log("[Not Implemented]")
}

Scene.test = function () {
  testSection("Component")
  console.log("[Not Implemented]")
}

SceneManager.test = function () {
  testSection("SceneManager")
  console.log("[Not Implemented]")
}

Transform.test = function () {
  //Do tests on the transform object
  testSection("Transform Object")
  let transform = new Transform();
  assert(transform.x == 0, "Default transform.x is 0")
  assert(transform.y == 0, "Default transform.y is 0")
  assert(transform.sx == 1, "Default transform.sx is 1")
  assert(transform.sy == 1, "Default transform.sy is 1")
  assert(transform.r == 0, "Default transform.r is 0")

  testSection("Transform fromTo")
  let t = Transform.fromTo(0, 0, 1, 0)
  assert(t.x == .5, "fromTo generates the right x value")
  assert(t.y == 0, "fromTo generates the right y value")
  assert(t.sx == .5, "fromTo generates the right sx value")
  assert(t.sy == 1, "fromTo generates the right sy value")
  assert(t.r == 0, "fromTo generates the right r value")

  testSection("Transform fromTo")
  t = Transform.fromTo(0, 0, 1, 0)
  assert(t.x == .5, "fromTo generates the right x value")
  assert(t.y == 0, "fromTo generates the right y value")
  assert(t.sx == .5, "fromTo generates the right sx value")
  assert(t.sy == 1, "fromTo generates the right sy value")
  assert(t.r == 0, "fromTo generates the right r value")
}

Vector2.test = function () {
  testSection("Vector2")
  console.log("[Not Implemented]")
}

