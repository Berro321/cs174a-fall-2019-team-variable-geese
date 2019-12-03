# A Geese Game

## Due: December 1, 2019 at 11:50pm

### Overview:
Two teams of geese must battle for control of the land. The game involves two players controlling their respective team of geese and is played in an arena made up of grass, dirt and stone tiles, where each team begins on opposite sides of the field. There are 6 different geese flavors and a team of geese is comprised of a specific number of each character type of these geese:
- Honk (x4): Basic, well-rounded, scout.
- Lonk (x2): Has longer neck for longer range attacks.
- Chonk (x2): Chonky, which gives it higher defense ability at the cost of lesser movement and lesser attack.
- Stronk (x2): Has thick, muscular legs for more powerful attacks, at the cost of lesser movement.
- Sonk (x1): Has musical attack.
- Monk (x1): Has magic attack with extensive range, low defense and normal movement.

A chart with exact numbers for all our goose stats (health points, attack, defense, movement range, attack range) is included at the bottom of the README.
The game is turn-based upon which each side has the ability to act with all units before proceeding to the opponent’s turn. Each goose unit moves in a tile-based pattern and can attack any enemy unit in range. The goal is to defeat all the enemy units before losing all your units.
The game is a 3D game with chess-like elements, but once a unit initiates an attack with an enemy unit, it zooms in and does a little battle simulation between the two units with nice animations in which the initiating unit first attacks and the enemy unit can then retalliate with its own attack, if its attack range allows it to. Damage value taken by the defending unit is calculated as the attacking unit's attack value minus the defending unit's defense value.

![Goose Move](https://media.giphy.com/media/cgfGtIi1jrmKpUblJn/giphy.gif)

![Goose Attack](https://media.giphy.com/media/QyhRS4svqSXXAlfbeT/giphy.gif)


### Individual Tasks:
#### Ben:
I contributed to this project mainly in terms of laying out the structure of the game as well as implementing a lot of the logic behind it. My main work was creating the class structure/inheritance structure of each Goose class and how to structure them in a way to have them have elements of traditional OOP concepts as well as being able to be animated inside the scene. This was taken care of mostly arrays/maps contained in each Goose class, and then would be instantiated in the scene to be handled. I also implemented the movement-tile algorithm (DFS) and also took care of moving the geese around the map, including their animation. 
Speaking of animation, I worked on how animations were to be managed such that coordination was easy and simple, especially in a game environment where animations may be started by the user. The implementation I found out to work best was to use frames, such that each call of display() would animate one frame of whatever function was called (move/attack).
Finally, I implemented most of the game logic, including players turns, geese deaths and removal, and when a player wins.

#### Betto:
For this project I implemented the bump mapping (based on my assignment 4 code) and the mouse picking (by transforming backwards from screen coordinates
to world space). I also implemented screen to texture rendering by using renderbuffers and framebuffers to save the current frame and then run shaders on
them (multipass-rendering) such as the radial blur during the camera zoom or the monk attack. I also implemented the tile class that renders the appropriate
tiles at their appropriate locations based on a 2D array indicating tile placement. I also worked on implementing smooth camera movements and integrating
the battle animations into one thing.
I also worked on organizing the tile textures and writing shader code for effects (like radial blur and the negative effect) that make the battles more
intense. In terms of data structures, I worked with arrays and matrices to keep track of several elements of an object (like the tiles or several UI elements). I also worked with maps to keep easy access to certain elements of an object (goose to audio sources).

#### Jorge:
My main work on the project was comprised of creating all our goose character models, and attack animations. I used a lot of matrix math in order to compose new shapes in our dependencies to use in these models, and to ensure that these looked appropriate with the lights sources we applied. Additionally, all within the model's space, I had to position the shapes correctly with respect to each other and ensure they interacted with the correct transformations during our animations which is definitely where most of my time was spent, putting all that logic together. These transformation states/shapes were generally stored in data structures such as arrays and maps.
Following that process, I did also work on a chunk of the game mechanics as was deemed necessary for the team, some logic with the menu buttons for example, but mostly to tasks related to the attack animations. A couple of these tasks were to line up battle damage logic/effect and sound effects (which were refined with MP3 editing technology) to the appropriate frames in our animations.



### Citations:
