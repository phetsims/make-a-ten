// Copyright 2015-2017, University of Colorado Boulder

/**
 * Constants that are shared between the various portions of the Making Tens Simulation
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var makeATen = require( 'MAKE_A_TEN/makeATen' );

  var MakeATenConstants = {
    // Initial layout bounds
    LAYOUT_BOUNDS: new Bounds2( 0, 0, 1024, 618 ),

    // Common colors
    SCREEN_BACKGROUND_COLOR: '#E8FFB0',
    EQUATION_FILL: 'rgb(0,0,0)',
    CUE_FILL: 'rgb(63,63,183)',

    /**
     * {number} - Where is the boundary between paper number "move" targets and "split" targets, where 0 would be the
     * bottom of the paper number and 1 would be the top.
     */
    SPLIT_BOUNDARY_HEIGHT_PROPORTION: 0.55,

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
