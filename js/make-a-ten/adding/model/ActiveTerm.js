// Copyright 2016-2017, University of Colorado Boulder

/**
 * Enumeration for which term is actively being edited in the Adding screen.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const makeATen = require( 'MAKE_A_TEN/makeATen' );

  var ActiveTerm = Object.freeze( {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    NONE: 'NONE'
  } );

  makeATen.register( 'ActiveTerm', ActiveTerm );

  return ActiveTerm;
} );
