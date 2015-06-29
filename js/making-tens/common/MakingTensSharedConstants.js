// Copyright 2002-2014, University of Colorado Boulder

/**
 * Constants that are shared between the various portions of the Making Tens Simulation
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );

  return {
    // layout bounds used throughout the simulation for laying out the screens
    LAYOUT_BOUNDS: new Bounds2( 0, 0, 1024, 618 ),
    CONTROL_PANEL_BACKGROUND_COLOR: 'rgb( 254, 241, 233 )',
    SHAPE_CAROUSEL_BACKGROUND_COLOR: 'rgb( 208, 222, 239 )',
    EXPLORER_SCREEN_BACKGROUND_COLOR: 'rgb( 217, 252, 146 )',
    GAME_SCREEN_BACKGROUND_COLOR: 'rgb( 217, 252, 146 )',
    ADDING_SCREEN_BACKGROUND_COLOR: 'rgb( 217, 252, 146 )',
    // velocity at which animated elements move
    ANIMATION_VELOCITY: 500, // In screen coordinates per second
    MOVE_AWAY_DISTANCE: 150 // when numbers cannot be added, the distance to move away from each in screen coordinates
  };
} );