// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var MakeATenGameModel = require( 'MAKE_A_TEN/make-a-ten/game/model/MakeATenGameModel' );
  var MakeATenGameScreenView = require( 'MAKE_A_TEN/make-a-ten/game/view/MakeATenGameScreenView' );
  var MakeATenSharedConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenSharedConstants' );
  var MakeATenUtil = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenUtil' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  var gameHomeScreenImage = require( 'image!MAKE_A_TEN/game-home-screen.png' );
  var gameNavBarImage = require( 'image!MAKE_A_TEN/game-nav-bar.png' );

  // strings
  var screenGameString = require( 'string!MAKE_A_TEN/screen.game' );

  /**
   * @constructor
   */
  function MakeATenGameScreen() {

    var homeScreenIcon = MakeATenUtil.createIconWithBackgroundColor( gameHomeScreenImage, MakeATenSharedConstants.EXPLORE_SCREEN_BACKGROUND_COLOR );
    var navigationBarIcon = MakeATenUtil.createIconWithBackgroundColor( gameNavBarImage, MakeATenSharedConstants.EXPLORE_SCREEN_BACKGROUND_COLOR );

    var options = {
      name: screenGameString,
      backgroundColor: MakeATenSharedConstants.GAME_SCREEN_BACKGROUND_COLOR,
      homeScreenIcon: homeScreenIcon,
      navigationBarIcon: navigationBarIcon
    };

    Screen.call( this,
      function() { return new MakeATenGameModel(); },
      function( model ) { return new MakeATenGameScreenView( model ); },
      options );
  }

  makeATen.register( 'MakeATenGameScreen', MakeATenGameScreen );

  return inherit( Screen, MakeATenGameScreen );
} );