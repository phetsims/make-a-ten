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
  var MakingTensUtil = require( 'MAKING_TENS/making-tens/common/MakingTensUtil' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  var addingHomeScreenImage = require( 'image!MAKING_TENS/adding-home-screen.png' );
  var addingNavBarImage = require( 'image!MAKING_TENS/adding-nav-bar.png' );

  // strings
  var screenAddingString = require( 'string!MAKING_TENS/screen.adding' );

  /**
   * @constructor
   */
  function MakingTensAddingScreen() {
    var homeScreenIcon = MakingTensUtil.createIconWithBackgroundColor( addingHomeScreenImage, MakingTensSharedConstants.ADDING_SCREEN_BACKGROUND_COLOR );
    var navigationBarIcon = MakingTensUtil.createIconWithBackgroundColor( addingNavBarImage, MakingTensSharedConstants.ADDING_SCREEN_BACKGROUND_COLOR );

    Screen.call( this, screenAddingString, homeScreenIcon,
      function() { return new MakingTensAddingModel(); },
      function( model ) { return new MakingTensAddingScreenView( model ); }, {
        backgroundColor: MakingTensSharedConstants.ADDING_SCREEN_BACKGROUND_COLOR,
        navigationBarIcon: navigationBarIcon
      }
    );
  }

  return inherit( Screen, MakingTensAddingScreen );
} );