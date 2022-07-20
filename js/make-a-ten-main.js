// Copyright 2015-2021, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sharfudeen Ashraf
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import MakeATenAddingScreen from './make-a-ten/adding/MakeATenAddingScreen.js';
import MakeATenExploreScreen from './make-a-ten/explore/MakeATenExploreScreen.js';
import MakeATenGameScreen from './make-a-ten/game/MakeATenGameScreen.js';
import makeATenStrings from './makeATenStrings.js';

const makeATenTitleString = makeATenStrings[ 'make-a-ten' ].title;

const simOptions = {
  credits: {
    leadDesign: 'Beth Stade, Amanda McGarry',
    softwareDevelopment: 'Jonathan Olson, Sharfudeen Ashraf',
    team: 'Ariel Paul, Kathy Perkins',
    graphicArts: 'Mariah Hermsmeyer, Amanda McGarry',
    qualityAssurance: 'Steele Dalton, Bryce Griebenow, Ethan Johnson, Ben Roberts'
  }
};

simLauncher.launch( () => {
  const sim = new Sim( makeATenTitleString, [ new MakeATenExploreScreen(), new MakeATenAddingScreen(), new MakeATenGameScreen() ], simOptions );
  sim.start();
} );