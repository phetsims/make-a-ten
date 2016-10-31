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
    // Initial layout bounds
    LAYOUT_BOUNDS: new Bounds2( 0, 0, 1024, 618 ),

    // Common colors
    SCREEN_BACKGROUND_COLOR: '#E8FFB0',
    EQUATION_FILL: 'rgb(63,63,183)',
    CUE_FILL: 'rgb(63,63,183)',

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

    /**
     * {Array.<Vector2>} - Offset from the origin of a paper number's coordinate system to the upper-left corner of
     * the corresponding image node for a given place, e.g. IMAGE_OFFSETS[ 0 ] is for the 1s place, IMAGE_OFFSETS[ 2 ]
     * is for the 100s place, etc.
     */
    IMAGE_OFFSETS: [
      new Vector2( 0, 0 ),
      new Vector2( -70, -4 ),
      new Vector2( -125, -22 ),
      new Vector2( -190, -28 )
    ],

    /**
     * {number} - Where is the boundary between paper number "move" targets and "split" targets, where 0 would be the
     * bottom of the paper number and 1 would be the top.
     */
    SPLIT_BOUNDARY_HEIGHT_PROPORTION: 0.38,

    /**
     * {number} - View coordinates per second for animation
     */
    ANIMATION_VELOCITY: 400,

    /**
     * {Object} - A map from digit length => how far away a number should be separated when it repels from another.
     */
    MOVE_AWAY_DISTANCE: { 1: 50, 2: 100, 3: 150, 4: 160 }
  };

  makeATen.register( 'MakeATenConstants', MakeATenConstants );

  return MakeATenConstants;
} );
