// Copyright 2016-2017, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );

  var MakeATenQueryParameters = QueryStringMachine.getAll( {

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

  makeATen.register( 'MakeATenQueryParameters', MakeATenQueryParameters );

  return MakeATenQueryParameters;
} );
