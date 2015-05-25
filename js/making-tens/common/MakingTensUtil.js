// Copyright 2002-2014, University of Colorado Boulder

/**
 * Util methods
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  var MakingTensUtil = {
    isBetween: function( value, a, b ) {
      var min = Math.min( a, b );
      var max = Math.max( a, b );
      return value > min && value < max;
    }
  };


  return MakingTensUtil;

} );