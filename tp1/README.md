# SGI 2024/2025 - TP1

## Group: T0xG0y

| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| John Doe         | 201901010 | ...                |
| Jane Doe         | 201901011 | ...                |

----
## Project information

### Code structure

This project was built upon the basic structure that was given to us by the teachers. We decided to use the `MyContents` class to manage all objects in scene. To organize the code we built per object (or object group if small enough) a function where is the object is created, applied transformations to and added to the scene. The models code live inside the `models` folder, where there is a class per object added to the scene. There is also a folder `curves` inside this folder which has the helper function to build NURBS and a custom curve used in the project (later mentioned), and the `textures` folder.

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

Mention that most of the objects created are parameterrized so is easy to change them.
The gui also has some changeable properties, to see its actions on the scene

----
## Issues/Problems

- (items describing unimplemented features, bugs, problems, etc.)