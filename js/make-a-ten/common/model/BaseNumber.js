// Copyright 2016-2019, University of Colorado Boulder

/**
 * A number like 120 is composed of 2 number images in this simulation. The baseNumber object represents the "parts"
 * In case of 120, we will have 2 base number one for 100 and another for 20.
 * Each base number is placed at a position within its composite (ex:120).
 *
 * @author Sharfudeen Ashraf
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import makeATen from '../../../makeATen.js';
import MakeATenUtils from '../MakeATenUtils.js';
import BaseNumberNode from '../view/BaseNumberNode.js';

// Precompute bounds for each digit
const DIGIT_BOUNDS = [ 0, 1, 2, 3 ].map( function( place ) {
  const dimension = BaseNumberNode.PAPER_NUMBER_DIMENSIONS[ place ];
  const offset = BaseNumberNode.IMAGE_OFFSETS[ place ];
  return dimension.toBounds( offset.x, offset.y );
} );

/**
 * @constructor
 *
 * @param {number} digit - The digit (1 to 9, won't create for a 0).
 * @param {number} place - The decimal exponent for the number digit * 10^place.
 */
function BaseNumber( digit, place ) {
  // @public {number} - The numeric value, e.g. 200 if digit is 2 and place is 2
  this.numberValue = digit * Math.pow( 10, place );

  // @public {number} - Number of digits in our numeric value
  this.digitLength = MakeATenUtils.digitsInNumber( this.numberValue );

  // @public {number} - The place in the number (power of 10) that our digit would be multiplied by to sum, e.g.
  //                    place 2 with a digit 3 has a numberValue = 300, i.e. 3 * 10^2.
  this.place = place;

  // @public {Vector2} - The offset (relatve to the number origin) for the placement of the upper-left corner of the
  //                     image representing this place value.
  this.offset = BaseNumberNode.IMAGE_OFFSETS[ this.place ];

  // @public {Bounds2} - The bounds (relative to the number origin) that this digit place will take up.
  this.bounds = DIGIT_BOUNDS[ this.place ];

  // @public {number} - The leading digit of the number, e.g. 2 for 200.
  this.digit = digit;
}

makeATen.register( 'BaseNumber', BaseNumber );

inherit( Object, BaseNumber );
export default BaseNumber;