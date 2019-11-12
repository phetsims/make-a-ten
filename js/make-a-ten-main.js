// Copyright 2015-2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sharfudeen Ashraf
 */
define( require => {
  'use strict';

  // modules
  const MakeATenAddingScreen = require( 'MAKE_A_TEN/make-a-ten/adding/MakeATenAddingScreen' );
  const MakeATenExploreScreen = require( 'MAKE_A_TEN/make-a-ten/explore/MakeATenExploreScreen' );
  const MakeATenGameScreen = require( 'MAKE_A_TEN/make-a-ten/game/MakeATenGameScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  const makeATenTitleString = require( 'string!MAKE_A_TEN/make-a-ten.title' );

  const simOptions = {
    credits: {
      leadDesign: 'Beth Stade, Amanda McGarry',
      softwareDevelopment: 'Jonathan Olson, Sharfudeen Ashraf',
      team: 'Ariel Paul, Kathy Perkins',
      graphicArts: 'Mariah Hermsmeyer, Amanda McGarry',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Ethan Johnson, Ben Roberts'
    }
  };

  SimLauncher.launch( function() {
    const sim = new Sim( makeATenTitleString, [ new MakeATenExploreScreen(), new MakeATenAddingScreen(), new MakeATenGameScreen() ], simOptions );
    sim.start();
  } );
} );
