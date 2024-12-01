# SGI 2024/2025 - TP2

## Group T06G01

| Name                        | Number    | E-Mail            |
| --------------------------- | --------- | ----------------- |
| Pedro Filipe Pinho Oliveira | 202108669 | up202108669@up.pt |
| Wallen Marcos Ribeiro       | 202109260 | up202109260@up.pt |

----
## Project information
Our project scene is inspired by the Among Us cafeteria room. Among Us is a popular multiplayer online game developed by Innersloth, first released in 2018. The game is set on a space station, where players take on one of two roles: Crewmates or Impostors. It is recognized for its simple yet engaging gameplay and became a cultural phenomenon, particularly during the COVID-19 pandemic. Our scene includes our unique creative twist to meet TP2 project's requirements, while still capturing many recognizable elements from the original video game.

![project video demo](/tp2/screenshots/amongus.mp4)
![scene screenshot near](/tp2/screenshots/amongus1.png)
![scene screenshot far](/tp2/screenshots/amongus2.png)


### Code structure
This project builds upon the foundational structure provided by our teachers. We leveraged the ```SceneGraph``` class to manage the overall structure of the ```YASF``` parser, facilitating the generation of the scene. To streamline the parsing of primitives—such as cylinders, ```NURBS```, and polygons—we utilized the ```PrimitiveFactory``` class, which isolates the logic specific to these elements. The scene's configuration and structure are defined entirely within the scene.json file, ensuring a clear and organized workflow.


### Camera Perspectives and Controls: 
- **Camera 1** - Provides a distant, high-level overview of the entire scene. 
- **Camera 2** -  A close-up view situated within the cafeteria and its elements.
- **Laptop Camera**- Allows a closer look on the video playing on the laptop screen. 
- **Toggle wireframe** - Allows the user to switch between the ```fill``` and ```wireframe modes```.


### Main Objects in scene / scene composition
- **Sky Box** - perspective of the space view.
- **Car** -  detailed red car roaming through space. Textures are applied to the bottom, the seats, and the license plates.
- **Cafeteria Room** - The cafeteria room is composed of octagon polygon floor and celing, surrounded by walls made of planes.
- **Tables** - The table is composed by a Table top and seats. The Table top placed in the center is a cylinder and seats are made with multiple totated boxes to give the arched look. Lod Object so is changes the structure with camera distance. becomes less arched and more boxy. The seats are dynamic and change their structure based on camera distance, becoming more boxy and less arched in the far distance due to LOD adjustments.
- **Crewmates** - the colorful characters are made with Cylinders and spheres. The crewmates change their appearance with camera distance, losing details such as their visors and backpacks when viewed from afar sue to LOD adjustments.
- **Newspaper and Vase** - Nurbs objects with applied textures.
- **Laptop**  - video texture of a crewmate dancing applied on screen, and bump map applied to the keyboard.
- **Random Objects** - The scene also includes various objects like an emergency button, cups, and plates, each with applied textures.

## Issues/Problems
- Difficulty configuring the camera target, specifically with the ```lookAt``` parameter not functioning as expected.


