// Copyright 2015-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var MakeATenExploreScreen = require( 'MAKE_A_TEN/make-a-ten/explore/MakeATenExploreScreen' );
  var MakeATenAddingScreen = require( 'MAKE_A_TEN/make-a-ten/adding/MakeATenAddingScreen' );
  var MakeATenGameScreen = require( 'MAKE_A_TEN/make-a-ten/game/MakeATenGameScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var makeATenTitleString = require( 'string!MAKE_A_TEN/make-a-ten.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Beth Stade, Amanda McGarry',
      softwareDevelopment: 'Jonathan Olson, Sharfudeen Ashraf',
      team: 'Ariel Paul, Kathy Perkins',
      graphicArts: 'Amanda McGarry',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Ethan Johnson, Ben Roberts'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( makeATenTitleString, [ new MakeATenExploreScreen(), new MakeATenAddingScreen(), new MakeATenGameScreen() ], simOptions );
    sim.start();
  } );
} );
