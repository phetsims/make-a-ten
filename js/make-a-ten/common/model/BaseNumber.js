// Copyright 2015, University of Colorado Boulder

/**
 * A number like 120 is composed of 2 number images in this simulation. The baseNumber object represents the "parts"
 * In case of 120, we will have 2 base number one for 100 and another for 20.
 * Each base number is placed at a position within its composite (ex:120).
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MakeATenUtil = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenUtil' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );

  // Precompute bounds for each digit
  var DIGIT_BOUNDS = [ 0, 1, 2, 3 ].map( function( place ) {
    var dimension = MakeATenConstants.PAPER_NUMBER_DIMENSIONS[ place ];
    var offset = MakeATenConstants.IMAGE_OFFSETS[ place ];
    return dimension.toBounds( offset.x, offset.y );
  } );

  /**
   * @constructor
   *
   * @param {number} digit - The digit (1 to 9, won't create for a 0).
   * @param {number} place - The decimal exponent for the number digit * 10^place.
   */
  function BaseNumber( digit, place ) {
    this.numberValue = digit * Math.pow( 10, place );

    // TODO: can't we pass this in?
    this.digitLength = MakeATenUtil.digitsInNumber( this.numberValue );

    // @public {number} - The place in the number (power of 10) that our digit would be multiplied by to sum, e.g.
    //                    place 2 with a digit 3 has a numberValue = 300, i.e. 3 * 10^2.
    this.place = place;

    // @public {Vector2} - The offset (relatve to the number origin) for the placement of the upper-left corner of the
    //                     image representing this place value.
    this.offset = MakeATenConstants.IMAGE_OFFSETS[ this.place ];

    // @public {Bounds2} - The bounds (relative to the number origin) that this digit place will take up.
    this.bounds = DIGIT_BOUNDS[ this.place ];
  }

  makeATen.register( 'BaseNumber', BaseNumber );

  return inherit( Object, BaseNumber );
} );
