// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf (For Ghent University)
 */
define( function( require ) {
  'use strict';

  // modules
  var MakingTensModel = require( 'MAKING_TENS/making-tens/model/MakingTensModel' );
  var MakingTensScreenView = require( 'MAKING_TENS/making-tens/view/MakingTensScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var makingTensSimString = require( 'string!MAKING_TENS/making-tens.name' );

  /**
   * @constructor
   */
  function MakingTensScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, makingTensSimString, icon,
      function() { return new MakingTensModel(); },
      function( model ) { return new MakingTensScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, MakingTensScreen );
} );