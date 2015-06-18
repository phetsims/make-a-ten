// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var MakingTensGameModel = require( 'MAKING_TENS/making-tens/game/model/MakingTensGameModel' );
  var MakingTensGameScreenView = require( 'MAKING_TENS/making-tens/game/view/MakingTensGameScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // strings
  var makingTensGameScreenTitleString = require( 'string!MAKING_TENS/making-tens.game.name' );

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
  function MakingTensGameScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = createScreenIcon();

    Screen.call( this, makingTensGameScreenTitleString, icon,
      function() { return new MakingTensGameModel(); },
      function( model ) { return new MakingTensGameScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, MakingTensGameScreen );
} );