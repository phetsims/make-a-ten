// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var MakingTensExploreModel = require( 'MAKING_TENS/making-tens/explore/model/MakingTensExploreModel' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var MakingTensUtil = require( 'MAKING_TENS/making-tens/common/MakingTensUtil' );
  var MakingTensExploreScreenView = require( 'MAKING_TENS/making-tens/explore/view/MakingTensExploreScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  var exploreHomeScreenImage = require( 'image!MAKING_TENS/explore-home-screen.png' );
  var exploreNavBarImage = require( 'image!MAKING_TENS/explore-nav-bar.png' );

  // strings
  var screenExploreString = require( 'string!MAKING_TENS/screen.explore' );

  /**
   * @constructor
   */
  function MakingTensExploreScreen() {
    var homeScreenIcon = MakingTensUtil.createIconWithBackgroundColor( exploreHomeScreenImage, MakingTensSharedConstants.EXPLORER_SCREEN_BACKGROUND_COLOR );
    var navigationBarIcon = MakingTensUtil.createIconWithBackgroundColor( exploreNavBarImage, MakingTensSharedConstants.EXPLORER_SCREEN_BACKGROUND_COLOR );

    Screen.call( this, screenExploreString, homeScreenIcon,
      function() { return new MakingTensExploreModel(); },
      function( model ) { return new MakingTensExploreScreenView( model ); }, {
        backgroundColor: MakingTensSharedConstants.EXPLORER_SCREEN_BACKGROUND_COLOR,
        navigationBarIcon: navigationBarIcon
      }
    );
  }

  return inherit( Screen, MakingTensExploreScreen );
} );