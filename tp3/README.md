# SGI 2024/2025 - TP3

## Group T06G01

| Name                        | Number    | E-Mail            |
| --------------------------- | --------- | ----------------- |
| Pedro Filipe Pinho Oliveira | 202108669 | up202108669@up.pt |
| Wallen Marcos Ribeiro       | 202109260 | up202109260@up.pt |

----
## Project information

![scene screenshot](/tp3/screenshots/game.png)

Our 3D game revolves around a competitive hot air balloon race where players navigate a predefined track against an autonomous opponent. Players control their balloon’s altitude using simple controls—raising or lowering it to adjust to different wind layers ```WS```, each influencing the direction of movement. Staying aligned with the track is crucial, with the balloon’s shadow serving as a guide. The track includes obstacles, power-ups, and a time limit, adding complexity and urgency to the gameplay. The game penalizes track departures or collisions with timeouts.
By integrating tools like the YASF language and importing 3D models, we believe that our game allows for agile development while leaving room for creative customization.

### Techniques Applied:
Here’s technical implementations of the requirements defined:

- **Object Picking for Menu Interaction**
Object picking was implemented to enable the player to select two balloons for the game. This technique likely utilizes raycasting, where a ray is projected from the camera to detect which 3D object (balloon) the user clicks or interacts with. The intersection of the ray with the objects' bounding volumes (e.g., bounding boxes bellow balloon options) determines the selection.

- **Keyframe Animation for Opponent Balloon**
The movement of the opponent balloon was driven by keyframe animation, where predefined positions, rotations, and scales of the balloon were interpolated over time. This allowed smooth, controlled movement along a specified trajectory. Additional procedural animation techniques have been used to enhance realism, such as simulating slight swaying or reactions to in-game physics.

- **Collision Detection with Power-Ups and Track Boundaries**
Collision detection was employed to identify interactions between the player’s balloon and game elements like power-ups and track boundaries. Collision detection was implemented using bounding sphere collision. Each collidable object (e.g., power-ups and obstacles) and the balloon is assigned a radius. During each game update, the distances between the balloon and all collidable objects are calculated. If the distance between their centers is less than the sum of their radius, a collision is detected.

- **Spritesheets and Shaders for Visual Effects**
Spritesheets were used to optimize rendering of outdoor scenery by packing multiple textures into a single image and mapping specific UV coordinates to quads. Shaders were utilized to render depth maps, enhancing the scene’s realism by creating visual effects such as shadows. Additional shaders were applied to obstacles for effects like transparency, emissive glow, or surface detail.

- **Particle Systems for Firework Box Effects**
A particle system was implemented for the Firework Box, simulating dynamic, visually engaging explosions. This system likely involved generating numerous particles with randomized properties (e.g., velocity, color, lifetime) and applying forces such as gravity.

