# Spring2023

## About

This directory contains a game engine and several test games for CSCI 2510 at the University of Nebraska at Omaha, Spring 2023.

To run the games, load this directory in a web server (for example LiveServer). Then open the index.html file in each game directory to play the game. Tests can be found in the test.html file in each game directory.

The engine itself can be found in the engine directory. 

## Conventions
This game engine is modelled to reflect the API of Unity so students are prepared to take CS3510, Advanced Game Programming, which is taught using Unity.

Unfortunately, the syntax of C# and JS are different, as are some of their fundamental pardigms (i.e. static typed v dynamically typed). In an attempt to follow standard practices in JS while matching the C# api as close as possible, the following conventions are used in this project.

- Files that contain a class are capitalized using [PascalCase](https://en.wiktionary.org/wiki/Pascal_case)
- Each engine file, other than engine.js proper, contains exactly one class.
- Classes are capitalized using PascalCase.
- Functions on classes are capitalized using [camelCase](https://en.wikipedia.org/wiki/Camel_case)
- In game files than contain classes, i.e. Components, the file name and class name is in PascalCase.
- All custom game components have a name in PascalCase which matches the name of the class, specificially they end with Component.
- All custom game objects have a name in PascalCase which matches the name of the class, specifically they end with GameObject
- All engine components have a name that matches the class name, specifically, they do not end with "Component."
- In Unity, game objects are stored at text files. In this project, game objects must be defined in code. To match Unity as closely as possible, the only code in a custom game object is in the start function. The code in the start function must be declarative, i.e. to loops or if statements. If initializing a game object requires emperative programming, i.e. loops or ifs, the user should create a component that procedurally populates the game object.
- In Unity, scenes are stored as text files. In this project, scenes must be defined in code. Like game objects, the only code in custom scenes should be in start() and must be declarative. 
- To preserve js conventions for class function names, the function names are in camelCase in this project. To covert code to Unity, change the function calls to PascalCase.
- There is not a one-to-one correspondance between functions and classes in this project and the Unity API. Most of the omissions from the Unity API are for simplicity.

# Generating documentation

The api for this engine can be generated by using the `jsdoc` command. Follow these steps if it is the first time you are generating the api:
- Install `nodejs` and `npm`. You can check if they are installed type running the following commands. If either of these generates an error, install them following the [installation instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  - `node -v`
  - `npm -v`

- Install [jsdoc](https://github.com/jsdoc/jsdoc) using `npm`: `npm install -g jsdoc`. To check that `jsdoc` is installed, run `jsdoc -v`. If you get an error, the installation failed or you need to close and re-open your console.
- To generate the api, run `jsdoc ./engine/**`. This will create the api in a folder called `out`. By default, the out folder is not saved when you commit. To commit, you need to remove the following line from `.gitignore`: `out/`

To use the markdown plugin for jsdoc, you need to point jsdoc to the config file at ./jsdoc.config.json. The command to run is `jsdoc -c ./jsdoc.config.json ./engine/**`

