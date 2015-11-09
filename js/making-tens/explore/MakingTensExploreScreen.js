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
  var MakingTensExploreScreenView = require( 'MAKING_TENS/making-tens/explore/view/MakingTensExploreScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // strings
  var screenExploreString = require( 'string!MAKING_TENS/screen.explore' );

  /**
   * Creates the icon for this screen.
   * @returns {Node}
   */
  var createScreenIcon = function() {

    var width = Screen.HOME_SCREEN_ICON_SIZE.width;
    var height = Screen.HOME_SCREEN_ICON_SIZE.height;

    //TODO PlaceHolder
    var background = new Rectangle( 0, 0, width, height, { fill: 'white' } );
    return new Node( { children: [ background ] } );
  };

  /**
   * @constructor
   */
  function MakingTensExploreScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = createScreenIcon();
    var makingTensExplorerScreenBounds = MakingTensSharedConstants.LAYOUT_BOUNDS;
    Screen.call( this, screenExploreString, icon,
      function() { return new MakingTensExploreModel( makingTensExplorerScreenBounds ); },
      function( model ) { return new MakingTensExploreScreenView( model ); },
      { backgroundColor: MakingTensSharedConstants.EXPLORER_SCREEN_BACKGROUND_COLOR }
    );
  }

  return inherit( Screen, MakingTensExploreScreen );
} );