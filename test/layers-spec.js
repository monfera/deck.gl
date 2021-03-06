// Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
import test from 'tape-catch';

/* eslint-disable func-style */
/* eslint-disable no-console */

import 'luma.gl/headless';
import {Mat4, Scene, createGLContext} from 'luma.gl';

import {
  Layer,

  // DeckGLOverlay,
  // HexagonLayer,
  ChoroplethLayer,
  ScatterplotLayer,
  ArcLayer,
  GridLayer
} from '../src';

// Import private method to test that layers can successfully be updated
import {updateLayers} from '../src/layer-manager';

import CHOROPLETHS from '../example/data/sf.zip.geo.json';
// const HEXAGONS_FILE = './example/data/hexagons.csv';
// const POINTS_FILE = './example/data/sf.bike.parking.csv';

const gl = createGLContext();

const FIXTURE = {

  layerState: {
    oldLayers: [],
    gl,
    scene: new Scene(gl)
  },

  mapSize: {
    width: 800,
    height: 640
  },

  mapState: {
    latitude: 37.751537058389985,
    longitude: -122.42694203247012,
    zoom: 11.5
  },

  choropleths: [], // CHOROPLETHS,
  hexagons: [],
  points: [{position: {x: 100, y: 100}, color:[255, 0, 0]}],
  arcs: [{position: {x0: 0, y0: 0, x1: 1, y1: 3}, color:[255, 0, 0]}]

};

test('GridLayer#constructor', t => {
  const {mapSize, mapState, points} = FIXTURE;

  const layer = new GridLayer({
    id: 'gridLayer',
    ...mapSize,
    ...mapState,
    isPickable: false,
    opacity: 0.06,
    data: points
  });

  t.ok(layer, 'GridLayer created');
  t.end();
});

test('ChoroplethLayer#constructor', t => {
  const {mapSize, mapState, choropleths} = FIXTURE;
  const layer = new ChoroplethLayer({
    id: 'choroplethLayer',
    ...mapSize,
    ...mapState,
    data: [],
    opacity: 0.8,
    isPickable: false,
    drawContour: true
  });

  t.ok(layer, 'ChoroplethLayer created');
  t.end();
});

test('ScatterplotLayer#constructor', t => {
  const {mapSize, mapState, points} = FIXTURE;

  const layer = new ScatterplotLayer({
    id: 'scatterplotLayer',
    ...mapSize,
    ...mapState,
    data: points,
    isPickable: true
  });
  t.ok(layer instanceof ScatterplotLayer, 'ScatterplotLayer created');

  const emptyLayer = new ScatterplotLayer({
    id: 'scatterplotLayer',
    ...mapSize,
    ...mapState,
    data: [],
    isPickable: true
  });
  t.ok(emptyLayer instanceof ScatterplotLayer, 'Empty ScatterplotLayer created');

  const {layerState} = FIXTURE;
  t.doesNotThrow(
    () => updateLayers({...layerState, newLayers: [layer, emptyLayer]}),
    undefined,
    'ScatterplotLayer update does not throw');

  t.end();
});

test('ArcLayer#constructor', t => {
  const {mapSize, mapState, arcs} = FIXTURE;

  const layer = new ArcLayer({
    id: 'arcLayer',
    ...mapSize,
    ...mapState,
    data: arcs,
    isPickable: true
  });
  t.ok(layer instanceof ArcLayer, 'ArcLayer created');

  const emptyLayer = new ArcLayer({
    id: 'arcLayer',
    ...mapSize,
    ...mapState,
    data: [],
    isPickable: true
  });
  t.ok(emptyLayer instanceof ArcLayer, 'Empty ArcLayer created');

  t.throws(
    () => new ArcLayer({
      id: 'arcLayer',
      ...mapSize,
      ...mapState,
      data: null,
      isPickable: true
    }),
    'Null ArcLayer threw exception'
  );

  const {layerState} = FIXTURE;
  t.doesNotThrow(
    () => updateLayers({
      ...layerState,
      newLayers: [layer, emptyLayer]
    }),
    undefined,
    'ArcLayer update does not throw');

  t.end();
});
