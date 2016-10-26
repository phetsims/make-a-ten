// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var MakeATenAddingModel = require( 'MAKE_A_TEN/make-a-ten/adding/model/MakeATenAddingModel' );
  var MakeATenAddingScreenView = require( 'MAKE_A_TEN/make-a-ten/adding/view/MakeATenAddingScreenView' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  var MakeATenUtil = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenUtil' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  var addingHomeScreenImage = require( 'image!MAKE_A_TEN/adding-home-screen.png' );
  var addingNavBarImage = require( 'image!MAKE_A_TEN/adding-nav-bar.png' );

  // strings
  var screenAddingString = require( 'string!MAKE_A_TEN/screen.adding' );

  /**
   * @constructor
   */
  function MakeATenAddingScreen() {

    var homeScreenIcon = MakeATenUtil.createIconWithBackgroundColor( addingHomeScreenImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR );
    var navigationBarIcon = MakeATenUtil.createIconWithBackgroundColor( addingNavBarImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR );

    var options = {
      name: screenAddingString,
      backgroundColor: MakeATenConstants.SCREEN_BACKGROUND_COLOR,
      homeScreenIcon: homeScreenIcon,
      navigationBarIcon: navigationBarIcon
    };

    Screen.call( this,
      function() { return new MakeATenAddingModel(); },
      function( model ) { return new MakeATenAddingScreenView( model ); },
      options );
  }

  makeATen.register( 'MakeATenAddingScreen', MakeATenAddingScreen );

  return inherit( Screen, MakeATenAddingScreen );
} );