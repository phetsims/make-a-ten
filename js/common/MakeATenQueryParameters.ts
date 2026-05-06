// Copyright 2016-2026, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import getGameLevelsSchema from '../../../vegas/js/getGameLevelsSchema.js';

const MakeATenQueryParameters = QueryStringMachine.getAll( {

  // Chooses the game levels that appear on the Game screen.
  gameLevels: getGameLevelsSchema( 10 ),

  // Initializes the Explore screen with specific numbers, spaced horizontally,
  // e.g. ?exploreNumbers=10,51, where 0 indicates none.
  exploreNumbers: {
    type: 'array',
    elementSchema: {
      type: 'number'
    },
    defaultValue: [ 10 ]
  }
} );

export default MakeATenQueryParameters;
