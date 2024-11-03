# SGI 2024/2025 - TP1

## Group T06G01

| Name                        | Number    | E-Mail            |
| --------------------------- | --------- | ----------------- |
| Pedro Filipe Pinho Oliveira | 202108669 | up202108669@up.pt |
| Wallen Marcos Ribeiro       | 202109260 | up202109260@up.pt |

----
## Project information
![](/tp1/screenshots/linguini.mp4)
Our project scene is inspired by Alfredo Linguini's room, a key character from the award-winning animated film [_Ratatouille_](https://www.imdb.com/title/tt0382932/), a landmark in the world of computer graphics [Linguini's Room Fanart](https://dimasnp.artstation.com/projects/wJP549). Our scene includes our unique creative twist to meet TP1 project's requirements, while still capturing many recognizable elements from the original movie.


### Code structure

This project was built upon the basic structure that was given to us by the teachers. We decided to use the `MyContents` class to manage all objects in scene. To organize the code we built per object (or object group if small enough) a function where is the object is created, applied transformations to and added to the scene. The models code live inside the `models` folder, where there is a class per object added to the scene. There is also a folder `curves` inside this folder which has the helper function to build NURBS and a custom curve used in the project (later mentioned), and the `textures` folder.


### Camera and Controls

#### Camera Perspectives: 

- ***Outside Perspective:***  broader view of the room from an elevated position.

- ***Inside Perspective:*** focuses on the interior of the scene, with a closer, lower-angle view.

- ***Table***: Positioned near a tabletop level, offering a low vantage point within the scene, for better view of the objects in the table.

#### Orthographic Camera Views:

-   **Left View:** Side perspective, positioned on the left of the frustum, looking at the center.
-   **Right View:** Positioned on the right side, facing the center.
-   **Top View:** Positioned above, looking down on the scene with a focus on the vertical axis.
-   **Bottom View:** Positioned below, looking up at the center of the scene.
-   **Front View:** Located at the front, offering a direct view of the scene.
-   **Back View:** Positioned at the back, looking toward the front.


#### Camera Controls:

-   **Active Camera:** Dropdown menu to select active camera from options: "Outside Perspective," "Inside Perspective," "Left," "Top," "Front," "Right," "Back," "Bottom," "Table." Updates camera view dynamically.
-   **X Coordinate:** Adjusts the active camera's `x` position within a range of 0 to 10.

#### Point Light Controls:

-   **Position:** Adjusts point light position along the `x`, `y`, and `z` axes within a range of -10 to 10.
-   **Intensity:** Controls light intensity from 0 to 50, updating brightness dynamically.
-   **Color:** Adjusts the color of the point light in real-time.

#### Table Controls:

-   **X Displacement:** Controls the table's `x` position from -5 to 5.
-   **Z Displacement:** Adjusts the table's `z` position from -5 to 5.

#### Cake Controls:

-   **X Displacement:** Moves the cake along the `x` axis within a range of -2 to 2.
-   **Z Displacement:** Adjusts cake displacement along the `z` axis from -2 to 2.
- This helps visualize the shadow changing with the movement of the cake next to the desk lamp.

#### Shelf Controls:

-   **Z Displacement:** Modifies the shelf's position along the `z` axis from -3 to 5. This helps visualize the shadow changing with the movement of the shelf with its objects, because they are next to the standing floor lamp.


### Objects in scene / scene composition

Mentioning the required tasks:
- The room, composed by the floor, four walls (one has hole to fit a window) and a ceiling.
- A wooden table, which has on it
    - The cake with a candle (missing a slice)
    - The slice of cake in a plate
    - A desk lamp being to spotlight the cake (casting shadows).
    - A spiral spring (which uses the custom curve).
- On the wall of the room we have:
    - Two framed paintings, one of *Remi* and another of *Auguste Gusteau*.
    - A framed sillouette of the Beetle
    - A window
- There is also a shelf with:
    - A jar with a flower on top
    - A newspaper in shape of a reed
- There is also a jar with a different flower on the ground

### Other Implementations

- Most of the objects are parameterized, which enable to quickly change them.

- Added an inverted sphere with a high-resolution texture of Paris on its inner surface, creating the illusion of an an immersive outside world when looking through the window.

- The door in the room contains a wooden texture with a bump map applied to the material, giving the ilusion of a bumpy 3D door.

- Added curtains rod and hooks, with cutains on each side, made with _NURBS_ surfaces.

- A opened cereal box object with different texture on each lip, inside and out.

- Added a desk with some objects, to visualized a more complex scenario where a light creates shadows. 

- Besides desk lamp, theres a bigger room lamp in our scene, that illuminates the desk and the objects on it.  These objects receive and cast shadows.

- Added a `.glb` 3D model of Linguini for added decorative detail.

----
## Issues/Problems

- The quality of Skydome Texture, due to difficulties in adapting the image to perfectly fit the sphere while maitaining its resolution.

