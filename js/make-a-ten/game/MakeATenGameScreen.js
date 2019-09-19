// Copyright 2016-2017, University of Colorado Boulder

/**
 * Game screen for make-a-ten. Includes 10 levels, where the goal for each is to combine the 2 numbers together into
 * one number by manipulating with the concept of making a ten. Each level can generate an infinite number of
 * challenges, so the score for each level is an integer (instead of a proportion like other sims).
 *
 * @author Sharfudeen Ashraf
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  const MakeATenGameModel = require( 'MAKE_A_TEN/make-a-ten/game/model/MakeATenGameModel' );
  const MakeATenGameScreenView = require( 'MAKE_A_TEN/make-a-ten/game/view/MakeATenGameScreenView' );
  const MakeATenUtil = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenUtil' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const gameHomeScreenImage = require( 'image!MAKE_A_TEN/game-home-screen.png' );
  const gameNavBarImage = require( 'image!MAKE_A_TEN/game-nav-bar.png' );

  // strings
  const screenGameString = require( 'string!MAKE_A_TEN/screen.game' );

  /**
   * @constructor
   */
  function MakeATenGameScreen() {

    const options = {
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
