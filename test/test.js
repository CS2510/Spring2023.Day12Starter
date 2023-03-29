let ctx = document.querySelector("#canv").getContext("2d")

//Set to truthy if we want to see the name of each test that was passed
//If false, only the final result (passed or failed) is displayed
//without poluting the console.
let verboseDebug = true;

let testOffset = 30;
let nextOffset = 25;
let testMaxX = 320
let testY = 20

function moveTestLocation() {
  testOffset += nextOffset;
  if (testOffset > testMaxX - 60) {
    testOffset = 30;
    testY += 30
  }
}


/**
 * Test the game. 
 * Runs a series of test on the game.
 * @param {string} title The title of the game. See start(title) for more details
 * @param {object} options The options object.
 * 
 * The options are as follows:
 * maxFrames: The number of frames to run in the test.
 * Note that teh default is 100 frames if maxFrames is not defined.
 */
function test(title, options = {}) {
  //Surround with a try so that if there is an error,
  //We can display it in the browser
  try {
    //Set the title
    document.title = title;

    //Set maxFrames to either the parameter passed in
    //or the default value otherwise.
    let maxFrames = options.maxFrames ? options.maxFrames : 100;

    //Emulate the game loop by running for a set number of iterations
    for (let i = 0; i < maxFrames; i++) {
      engineUpdate();
      engineDraw();
    }

    //Call the done function if provided
    if (options.done) {
      options.done(ctx);
    }
  } catch (exception) {
    //Update the browser window to show that there is an error.
    failTest("Error in test(): " + exception, false)

    //Rethrow the exception so the user can know what line the error
    //is on, etc.
    throw exception;
  }

  //Call the done function if provided
  if (options.done) {
    options.done(ctx);
  }
}

//Called when tests fail.
function failTest(description, needsToBeThrown = true) {
  //Draw a red x if a test failed.
  ctx.font = "20px Courier"
  ctx.fillText("❌", testOffset, testY)
  moveTestLocation()
  if (needsToBeThrown)
    throw description
}


//Called when a test is passed
function passTest(description) {
  //Output the result to the console 
  //if verbose debugging is on.
  ctx.font = "20px Courier"
  ctx.fillText("✅", testOffset, testY)
  moveTestLocation()
  if (verboseDebug) {
    console.log("Passed test: " + description)
  }
}

//Called when all tests are passed.
//Draw a green checkmark in the browser
//if all tests were passed
function passTests() {
  ctx.font = "20px Courier"
  ctx.fillText("🏁", 5, 20)
  moveTestLocation()
  console.log("Called passTests")
}

/**
* Simple unit test function.
* If the first parameter evaluates to true, 
* the test passes.
* Otherwise, the test fails.
* @param {boolean} boolean 
* @param {string} description 
*/
function assert(boolean, description = "[No description set]") {
  //Handle the failed test case
  if (!boolean) {
    failTest(description)
  }
  //Handle the passed test case
  else {
    passTest(description)
  }
}

function expectException(call, description = "") {
  try {
    call()
    failTest(description)
  }
  catch (e) {
    passTest(description);
  }
}

function testSection(description) {
  console.log("  Begining test section: " + description)
}

/** Start the test.*/
window.test = test;

/** A reference to our unit test function */
window.assert = assert;

/** A reference to the pass tests function. 
 * Called by test code when all tests have passed 
 * */
window.passTests = passTests

window.testSection = testSection