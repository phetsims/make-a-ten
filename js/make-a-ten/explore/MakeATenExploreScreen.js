// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var MakeATenExploreModel = require( 'MAKE_A_TEN/make-a-ten/explore/model/MakeATenExploreModel' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  var MakeATenUtil = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenUtil' );
  var MakeATenExploreScreenView = require( 'MAKE_A_TEN/make-a-ten/explore/view/MakeATenExploreScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  var exploreHomeScreenImage = require( 'image!MAKE_A_TEN/explore-home-screen.png' );
  var exploreNavBarImage = require( 'image!MAKE_A_TEN/explore-nav-bar.png' );

  // strings
  var screenExploreString = require( 'string!MAKE_A_TEN/screen.explore' );

  /**
   * @constructor
   */
  function MakeATenExploreScreen() {

    var homeScreenIcon = MakeATenUtil.createIconWithBackgroundColor( exploreHomeScreenImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR );
    var navigationBarIcon = MakeATenUtil.createIconWithBackgroundColor( exploreNavBarImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR );

    var options = {
      name: screenExploreString,
      backgroundColor: MakeATenConstants.SCREEN_BACKGROUND_COLOR,
      homeScreenIcon: homeScreenIcon,
      navigationBarIcon: navigationBarIcon
    };

    Screen.call( this,
      function() { return new MakeATenExploreModel(); },
      function( model ) { return new MakeATenExploreScreenView( model ); },
      options );
  }

  makeATen.register( 'MakeATenExploreScreen', MakeATenExploreScreen );

  return inherit( Screen, MakeATenExploreScreen );
} );