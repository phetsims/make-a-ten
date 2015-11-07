// Copyright 2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var MakingTensExploreScreen = require( 'MAKING_TENS/making-tens/explore/MakingTensExploreScreen' );
  var MakingTensAddingScreen = require( 'MAKING_TENS/making-tens/adding/MakingTensAddingScreen' );
  var MakingTensGameScreen = require( 'MAKING_TENS/making-tens/game/MakingTensGameScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!MAKING_TENS/making-tens.title' );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( phet.chipper.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new MakingTensExploreScreen(), new MakingTensAddingScreen(), new MakingTensGameScreen() ], simOptions );
    sim.start();
  } );
} );