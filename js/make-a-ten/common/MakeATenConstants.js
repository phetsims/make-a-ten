// Copyright 2015, University of Colorado Boulder

/**
 * Constants that are shared between the various portions of the Making Tens Simulation
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Vector2 = require( 'DOT/Vector2' );

  var MakeATenConstants = {
    // layout bounds used throughout the simulation for laying out the screens
    LAYOUT_BOUNDS: new Bounds2( 0, 0, 1024, 618 ),
    PAPER_NUMBER_REPO_PANEL_BACKGROUND_COLOR: 'rgb( 208, 222, 239 )',
    SCREEN_BACKGROUND_COLOR: '#E8FFB0',

    // TODO: These don't seem consistent. Here are the current sizes:
    // 1-digit numbers have image dimensions of 67x128
    // 2-digit numbers have image dimensions of (155,156)x(140,141)
    // 3-digit numbers have image dimensions of 215x177
    // 4-digit numbers have image dimensions of (271,272)x189
    PAPER_NUMBER_DIMENSIONS: {
      0: new Dimension2( 67, 128 ), // key is digitLength
      1: new Dimension2( 156, 141 ),
      2: new Dimension2( 215, 177 ),
      3: new Dimension2( 272, 189 )
    },

    // TODO: doc
    IMAGE_OFFSETS: [
      new Vector2( 0, 0 ),
      new Vector2( -70, -4 ),
      new Vector2( -125, -22 ),
      new Vector2( -190, -28 )
    ],

    HOVER_OPACITY: 0.95,

    //based on where the user clicked on the node, determine if it is split or move
    SPLIT_BOUNDARY_HEIGHT_PROPORTION: 0.4,
    // velocity at which animated elements move
    ANIMATION_VELOCITY: 400, // In screen coordinates per second
    MOVE_AWAY_DISTANCE: { 1: 50, 2: 100, 3: 150, 4: 160 } // when numbers cannot be added, the distance to move away from each in screen coordinates
  };

  makeATen.register( 'MakeATenConstants', MakeATenConstants );

  return MakeATenConstants;
} );