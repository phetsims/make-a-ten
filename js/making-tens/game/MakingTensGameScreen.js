// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var MakingTensGameModel = require( 'MAKING_TENS/making-tens/game/model/MakingTensGameModel' );
  var MakingTensGameScreenView = require( 'MAKING_TENS/making-tens/game/view/MakingTensGameScreenView' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var MakingTensUtil = require( 'MAKING_TENS/making-tens/common/MakingTensUtil' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  var gameHomeScreenImage = require( 'image!MAKING_TENS/game-home-screen.png' );
  var gameNavBarImage = require( 'image!MAKING_TENS/game-nav-bar.png' );

  // strings
  var screenGameString = require( 'string!MAKING_TENS/screen.game' );

  /**
   * @constructor
   */
  function MakingTensGameScreen() {
    var homeScreenIcon = MakingTensUtil.createIconWithBackgroundColor( gameHomeScreenImage, MakingTensSharedConstants.EXPLORE_SCREEN_BACKGROUND_COLOR );
    var navigationBarIcon = MakingTensUtil.createIconWithBackgroundColor( gameNavBarImage, MakingTensSharedConstants.EXPLORE_SCREEN_BACKGROUND_COLOR );

    Screen.call( this, screenGameString, homeScreenIcon,
      function() { return new MakingTensGameModel(  ); },
      function( model ) { return new MakingTensGameScreenView( model ); }, {
        backgroundColor: MakingTensSharedConstants.GAME_SCREEN_BACKGROUND_COLOR,
        navigationBarIcon: navigationBarIcon
      }
    );
  }

  makingTens.register( 'MakingTensGameScreen', MakingTensGameScreen );

  return inherit( Screen, MakingTensGameScreen );
} );