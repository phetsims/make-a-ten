// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );
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

    var homeScreenIcon = MakingTensUtil.createIconWithBackgroundColor( exploreHomeScreenImage, MakingTensSharedConstants.EXPLORE_SCREEN_BACKGROUND_COLOR );
    var navigationBarIcon = MakingTensUtil.createIconWithBackgroundColor( exploreNavBarImage, MakingTensSharedConstants.EXPLORE_SCREEN_BACKGROUND_COLOR );

    var options = {
      name: screenExploreString,
      backgroundColor: MakingTensSharedConstants.EXPLORE_SCREEN_BACKGROUND_COLOR,
      homeScreenIcon: homeScreenIcon,
      navigationBarIcon: navigationBarIcon
    };

    Screen.call( this,
      function() { return new MakingTensExploreModel(); },
      function( model ) { return new MakingTensExploreScreenView( model ); },
      options );
  }

  makingTens.register( 'MakingTensExploreScreen', MakingTensExploreScreen );

  return inherit( Screen, MakingTensExploreScreen );
} );