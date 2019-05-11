# Pedestrian Behavior Simulation and Visualization
Master thesis project at Atkins, Spring 2019. Details presented at my [portfolio](https://jessiezheng.world/project_thesis.html).

### Title
Interactive Visual Analytics for Agent-Based Simulation: Pedestrian Behavior at Signalized Pedestrian Crossing

### Abstract
An Atkins team based in Stockholm is working on a software prototype called [Planning Information Modeling (PIM)](http://pim.atkinsglobal.com/). PIM is a parametric 3D visualization tool for urban planners, which helps with their cooperation and decision-making. To investigate one of PIM’s future possibilities, this thesis aims at developing a visual analytics tool that provides insights into pedestrians’ street crossing behavior. In the visualization scenario, people cross the street where there are traffic signal lights. Concretely, they go upon the crosswalk lines to reach the opposite side of the street. On the one hand, the visualization involves illegal crossing phenomena if people cross against the red signal light; on the other hand, it visualizes the space utilization of the crosswalk area by analyzing people’s trajectories. [Optimal Reciprocal Collision Avoidance (ORCA)](http://gamma.cs.unc.edu/RVO2/) is chosen as the crowd simulation algorithm to generate the trajectory data, which data is then used for developing the web-based visualization within one signal light cycle. Moreover, the tool enables dynamic comparison by providing users with the option to alter the pedestrian flow rate.

### Compile
After you are located in the root directory:
```shell
$ npm install
$ yarn dev
```
Then, check http://localhost:3000/ to see the compiled web.