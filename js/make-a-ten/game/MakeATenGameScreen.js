// Copyright 2015, University of Colorado Boulder

/**
 * Game screen for make-a-ten. Includes 10 levels, where the goal for each is to combine the 2 numbers together into
 * one number by manipulating with the concept of making a ten. Each level can generate an infinite number of
 * challenges, so the score for each level is an integer (instead of a proportion like other sims).
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  var MakeATenGameModel = require( 'MAKE_A_TEN/make-a-ten/game/model/MakeATenGameModel' );
  var MakeATenGameScreenView = require( 'MAKE_A_TEN/make-a-ten/game/view/MakeATenGameScreenView' );
  var MakeATenUtil = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenUtil' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // images
  var gameHomeScreenImage = require( 'image!MAKE_A_TEN/game-home-screen.png' );
  var gameNavBarImage = require( 'image!MAKE_A_TEN/game-nav-bar.png' );

  // strings
  var screenGameString = require( 'string!MAKE_A_TEN/screen.game' );

  /**
   * @constructor
   */
  function MakeATenGameScreen() {

    var options = {
      name: screenGameString,
      backgroundColorProperty: new Property( MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
      homeScreenIcon: MakeATenUtil.createIconWithBackgroundColor( gameHomeScreenImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
      navigationBarIcon: MakeATenUtil.createIconWithBackgroundColor( gameNavBarImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR )
    };

    Screen.call( this,
      function() { return new MakeATenGameModel(); },
      function( model ) { return new MakeATenGameScreenView( model ); },
      options );
  }

  makeATen.register( 'MakeATenGameScreen', MakeATenGameScreen );

  return inherit( Screen, MakeATenGameScreen );
} );
