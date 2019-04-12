/* global window */
import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL, { PolygonLayer, PathLayer, ScatterplotLayer } from 'deck.gl';
// import { TripsLayer } from '@deck.gl/experimental-layers';
import './app.css';

import DataBuildings from './data/buildings.json';
import DataPedestrians from './data/pedestrians.json';
import DataVehicles from './data/vehicles.json';
import DataZebras from './data/env_zebras.json';
import DataLanes from './data/env_lanes.json';
import DataBuffer from './data/env_buffer.json';
import DataLights from './data/env_lights.json';

// import TEST from './data/test.json';

// // Not mine
// const MAPBOX_TOKEN = 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pudzRtaWloMDAzcTN2bzN1aXdxZHB5bSJ9.2bkj3IiRC8wj3jLThvDGdA';

// My token, enable when using my mapbox style
const MAPBOX_TOKEN = 'pk.eyJ1IjoiamVzc2llemgiLCJhIjoiY2pxeG5yNHhqMDBuZzN4cHA4ZGNwY2l3OCJ9.T2B6-B6EMW6u9XmjO4pNKw';

document.addEventListener('contextmenu', evt => evt.preventDefault()); // give way to perspective control

/* Kungsgatan view */
export const INITIAL_VIEW_STATE = {
  longitude: 18.063810,
  latitude: 59.335342,
  // zoom: 19.8,
  zoom: 19,
  maxZoom: 21.3,
  // minZoom: 17,
  bearing: 120,
  pitch: 35
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }

  componentDidMount() {
    this._animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _animate() {
    const {
      loopLength = 2550, // red 2250 (1800 acclerated), whole cycle 3000 (2550 acclerated)
      animationSpeed = 30 // unit time per second
    } = this.props;
    const timestamp = Date.now() / 1000;
    const loopTime = loopLength / animationSpeed;

    this.setState({
      time: ((timestamp % loopTime) / loopTime) * loopLength
    });
    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
  }

  _renderLayers() {
    const { time } = this.state;
    return [
      new ScatterplotLayer({
        id: 'pedestrians',
        data: DataPedestrians,
        opacity: 0.8,
        fp64: true,
        getPosition: (d) => {
          for (let i = 0; i < d.trajectory.length; i += 1) {
            if (d.trajectory[i][2] === Math.floor(time)) {
              return [d.trajectory[i][0], d.trajectory[i][1], 0];
            }
          }
        },
        getRadius: 0.27,
        getColor: [253, 128, 93],
        updateTriggers: {
          getPosition: time
        }
      }),
      // new ScatterplotLayer({
      //   id: 'test',
      //   data: TEST,
      //   opacity: 0.001,
      //   fp64: true,
      //   getPosition: d => d.coordinates,
      //   getRadius: 0.27,
      //   getColor: [253, 0, 0]
      // }),
      // new TripsLayer({
      //   id: 'pedestrian_path',
      //   data: DataPedestrians,
      //   getPath: d => d.trajectory,
      //   // getColor: d => (d.violation === 0 ? [253, 128, 93] : [23, 184, 190]),
      //   getColor: [253, 128, 93],
      //   opacity: 1.0,
      //   trailLength: 30,
      //   currentTime: time
      // }),
      new PathLayer({
        id: 'env_zebras',
        data: DataZebras,
        getPath: f => f.line,
        positionFormat: `XY`,
        getColor: [255, 255, 255, 30],
        getWidth: 0.6
      }),
      new PathLayer({
        id: 'env_lanes',
        data: DataLanes,
        getPath: d => d.line,
        positionFormat: `XY`,
        getColor: [255, 255, 255, 30],
        getWidth: 0.1
      }),
      new PolygonLayer({
        id: 'env_buffer',
        data: DataBuffer,
        stroked: false,
        extruded: true,
        wireframe: true,
        getPolygon: d => d.contour,
        getElevation: d => d.height,
        getFillColor: [255, 255, 255, 30],
        getLineColor: [255, 255, 255, 70]
      }),
      new PolygonLayer({
        id: 'env_lights',
        data: DataLights,
        stroked: false,
        extruded: true,
        wireframe: true,
        getPolygon: d => d.contour,
        getElevation: 0.7,
        getLineColor: [255, 255, 255, 70],
        getFillColor: () => {
          let color = null;
          if (time < 20) {
            color = [18, 131, 18, 120]; // green
          } else if (time < 1800) {
            color = [255, 0, 0, 120]; // red
          } else {
            color = [18, 131, 18, 120]; // green
          }
          return color;
        },
        updateTriggers: {
          getFillColor: time
        }
      }),
      new PathLayer({
        id: 'vehicles',
        data: DataVehicles,
        fp64: false,
        getPath: (d) => {
          for (let i = 0; i < d.vertices.length; i += 1) {
            if (d.vertices[i][2] === Math.floor(time)) {
              return [d.vertices[i][0], d.vertices[i][1]];
            }
          }
        },
        opacity: 0.018,
        positionFormat: `XY`,
        getColor: [253, 128, 93],
        getWidth: 2.4,
        updateTriggers: {
          getPath: time
        }
      }),
      new PolygonLayer({
        id: 'buildings',
        data: DataBuildings,
        extruded: true,
        wireframe: true,
        getPolygon: d => d.polygon,
        getElevation: d => d.height,
        getFillColor: [255, 255, 255, 10],
        getLineColor: [255, 255, 255, 75]
      })
    ];
  }

  render() {
    const {viewState, controller = true, baseMap = true } = this.props;
    const { time } = this.state;

    // display time acclerates the 20s of 30-50s into 5 seconds
    let displayTime = Math.floor(time / 30);
    if (time > 900 && time < 1050) {
      displayTime = Math.floor(time / 7.5) - 90;
    } else if (time >= 1050) {
      displayTime = Math.floor(time / 30) + 15;
    }

    return (
      <div>
        <div className="left_simulation">
          <DeckGL
            layers={this._renderLayers()}
            initialViewState={INITIAL_VIEW_STATE}
            viewState={viewState}
            controller={controller}
          >
            {baseMap && (
              <StaticMap
                reuseMaps
                mapStyle='mapbox://styles/jessiezh/cjsq7mefu006m1fs38j8jiyjg'
                // mapStyle="mapbox://styles/mapbox/dark-v9"
                preventStyleDiffing={true}
                mapboxApiAccessToken={MAPBOX_TOKEN}
              />
            )}
          </DeckGL>
        </div>
        <div className="left_graph">
          Overall statistics goes here
        </div>
        <div className="right_graph">
          Some other graphs
        </div>
        <div className={time > 900 && time < 1050 ? 'timer_acc' : 'timer_nom'}>
          {displayTime}
          <span className="second">s</span>
        </div>
        <div className="light_outline">
          <span className={time < 1800 ? 'light_red' : 'light_green'} />
        </div>
      </div>
    );
  }
}
