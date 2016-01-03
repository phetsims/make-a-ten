// Copyright 2015, University of Colorado Boulder

/**
 *
 * A number like 120 is composed of  to 2 number images in this simulation. The baseNumber object represents the "parts"
 * In case of 120, we will have 2 base number one for 100 and another for 20.
 * Each base number is placed at a position within its composite (ex:120).
 *
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );


  /**
   *
   * @param {number} numberValue
   * @param {Vector2} position
   * @param {number} opacity
   * @constructor
   */
  function BaseNumber( numberValue, position, opacity ) {
    this.numberValue = numberValue;
    this.position = position;
    this.opacity = opacity;
    this.digitLength = (numberValue + '').length;
  }

  return inherit( Object, BaseNumber );


} );