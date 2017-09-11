// Copyright 2015, University of Colorado Boulder

/**
 * Explore screen of Make a Ten. Provides a panel where 100s, 10s or 1s can be dragged out, combined, and pulled
 * apart, and displays the total in the upper-left.
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  var MakeATenExploreModel = require( 'MAKE_A_TEN/make-a-ten/explore/model/MakeATenExploreModel' );
  var MakeATenExploreScreenView = require( 'MAKE_A_TEN/make-a-ten/explore/view/MakeATenExploreScreenView' );
  var MakeATenUtil = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenUtil' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // images
  var exploreHomeScreenImage = require( 'image!MAKE_A_TEN/explore-home-screen.png' );
  var exploreNavBarImage = require( 'image!MAKE_A_TEN/explore-nav-bar.png' );

  // strings
  var screenExploreString = require( 'string!MAKE_A_TEN/screen.explore' );

  /**
   * @constructor
   */
  function MakeATenExploreScreen() {

    var options = {
      name: screenExploreString,
      backgroundColorProperty: new Property( MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
      homeScreenIcon: MakeATenUtil.createIconWithBackgroundColor( exploreHomeScreenImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
      navigationBarIcon: MakeATenUtil.createIconWithBackgroundColor( exploreNavBarImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR )
    };

    Screen.call( this,
      function() { return new MakeATenExploreModel(); },
      function( model ) { return new MakeATenExploreScreenView( model ); },
      options );
  }

  makeATen.register( 'MakeATenExploreScreen', MakeATenExploreScreen );

  return inherit( Screen, MakeATenExploreScreen );
} );
