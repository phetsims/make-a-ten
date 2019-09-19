// Copyright 2016-2017, University of Colorado Boulder

/**
 * Explore screen of Make a Ten. Provides a panel where 100s, 10s or 1s can be dragged out, combined, and pulled
 * apart, and displays the total in the upper-left.
 *
 * @author Sharfudeen Ashraf
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  const MakeATenExploreModel = require( 'MAKE_A_TEN/make-a-ten/explore/model/MakeATenExploreModel' );
  const MakeATenExploreScreenView = require( 'MAKE_A_TEN/make-a-ten/explore/view/MakeATenExploreScreenView' );
  const MakeATenUtil = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenUtil' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const exploreHomeScreenImage = require( 'image!MAKE_A_TEN/explore-home-screen.png' );
  const exploreNavBarImage = require( 'image!MAKE_A_TEN/explore-nav-bar.png' );

  // strings
  const screenExploreString = require( 'string!MAKE_A_TEN/screen.explore' );

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
