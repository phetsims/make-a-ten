// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var MakingTensAddingModel = require( 'MAKING_TENS/making-tens/adding/model/MakingTensAddingModel' );
  var MakingTensAddingScreenView = require( 'MAKING_TENS/making-tens/adding/view/MakingTensAddingScreenView' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // strings
  var screenAddingString = require( 'string!MAKING_TENS/screen.adding' );

  /**
   * Creates the icon for this screen.
   * @returns {Node}
   */
  var createScreenIcon = function() {

    var width = Screen.HOME_SCREEN_ICON_SIZE.width;
    var height = Screen.HOME_SCREEN_ICON_SIZE.height;

    //TODO PlaceHolder
    var background = new Rectangle( 0, 0, width, height, { fill: 'white' } );
    return new Node( { children: [ background ] } );

  };

  /**
   * @constructor
   */
  function MakingTensAddingScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = createScreenIcon();
    var makingTensAddingScreenBounds = MakingTensSharedConstants.LAYOUT_BOUNDS;
    Screen.call( this, screenAddingString, icon,
      function() { return new MakingTensAddingModel(makingTensAddingScreenBounds); },
      function( model ) { return new MakingTensAddingScreenView( model ); },
      { backgroundColor: MakingTensSharedConstants.ADDING_SCREEN_BACKGROUND_COLOR }
    );
  }

  return inherit( Screen, MakingTensAddingScreen );
} );