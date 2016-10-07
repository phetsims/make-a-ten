// Copyright 2015, University of Colorado Boulder

/**
 * Enumeration for which term is actively being edited in the Adding screen.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );

  var ActiveTerm = Object.freeze( {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    NONE: 'NONE'
  } );

  makingTens.register( 'ActiveTerm', ActiveTerm );

  return ActiveTerm;
} );