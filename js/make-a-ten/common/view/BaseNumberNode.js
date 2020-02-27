// Copyright 2016-2019, University of Colorado Boulder

/**
 * Creates image views for base numbers.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Dimension2 from '../../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import Image from '../../../../../scenery/js/nodes/Image.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import imageDigit0 from '../../../../mipmaps/digit-0_png.js';
import imageDigit1 from '../../../../mipmaps/digit-1_png.js';
import imageDigit2 from '../../../../mipmaps/digit-2_png.js';
import imageDigit3 from '../../../../mipmaps/digit-3_png.js';
import imageDigit4 from '../../../../mipmaps/digit-4_png.js';
import imageDigit5 from '../../../../mipmaps/digit-5_png.js';
import imageDigit6 from '../../../../mipmaps/digit-6_png.js';
import imageDigit7 from '../../../../mipmaps/digit-7_png.js';
import imageDigit8 from '../../../../mipmaps/digit-8_png.js';
import imageDigit9 from '../../../../mipmaps/digit-9_png.js';
import imagePaperBackground1000 from '../../../../mipmaps/paper-background-1000_png.js';
import imagePaperBackground100 from '../../../../mipmaps/paper-background-100_png.js';
import imagePaperBackground10 from '../../../../mipmaps/paper-background-10_png.js';
import imagePaperBackground1 from '../../../../mipmaps/paper-background-1_png.js';
import makeATen from '../../../makeATen.js';

// place => mipmap info
const BACKGROUND_IMAGE_MAP = {
  0: imagePaperBackground1,
  1: imagePaperBackground10,
  2: imagePaperBackground100,
  3: imagePaperBackground1000
};

// digit => mipmap info
const DIGIT_IMAGE_MAP = {
  1: imageDigit1,
  2: imageDigit2,
  3: imageDigit3,
  4: imageDigit4,
  5: imageDigit5,
  6: imageDigit6,
  7: imageDigit7,
  8: imageDigit8,
  9: imageDigit9
};

// place => x/y offsets for the first digit in each place
const PLACE_X_OFFSET = { 0: 48, 1: 108, 2: 70, 3: 94 };
const PLACE_Y_OFFSET = { 0: 65, 1: 85, 2: 163, 3: 197 };

// digit => horizontal offset for that digit (applied to all places, includes digit-specific information)
const DIGIT_X_OFFSET = { 1: 93, 2: -7, 3: -7, 4: -9, 5: -18, 6: -5, 7: -24, 8: -2, 9: -10 };

// digit => horizontal offset, customized for each single digit base number
const FIRST_PLACE_DIGIT_X_OFFSET = { 1: -61, 2: 0, 3: 0, 4: 0, 5: 5, 6: 0, 7: 15, 8: 10, 9: 15 };

// place => horizontal locations of the zeros in the base number
const ZERO_OFFSET = {
  0: [],
  1: [ 335 ],
  2: [ 560, 314 ],
  3: [ 825, 580, 335 ]
};

// Scale was increased from 72dpi (pixels) to 300dpi, so that we can have crisper graphics.
const SCALE = 72 / 300;

/**
 * @constructor
 * @extends Node
 *
 * @param {BaseNumber} baseNumber
 * @param {number} opacity
 */
function BaseNumberNode( baseNumber, opacity ) {
  Node.call( this, { scale: SCALE } );

  // Location of the initial digit
  let x = PLACE_X_OFFSET[ baseNumber.place ] + DIGIT_X_OFFSET[ baseNumber.digit ];
  const y = PLACE_Y_OFFSET[ baseNumber.place ];

  // We need to slightly offset some
  if ( baseNumber.place === 0 ) {
    x += FIRST_PLACE_DIGIT_X_OFFSET[ baseNumber.digit ];
  }

  // Translate everything by our offset
  this.translation = baseNumber.offset;

  // The paper behind the numbers
  this.addChild( new Image( BACKGROUND_IMAGE_MAP[ baseNumber.place ], {
    imageOpacity: opacity
  } ) );

  // The initial (non-zero) digit
  this.addChild( new Image( DIGIT_IMAGE_MAP[ baseNumber.digit ], {
    x: x,
    y: y
  } ) );

  // Add the zeros
  const digitZeroOffsets = ZERO_OFFSET[ baseNumber.place ];
  for ( let i = 0; i < digitZeroOffsets.length; i++ ) {
    this.addChild( new Image( imageDigit0, {
      x: digitZeroOffsets[ i ],
      y: y
    } ) );
  }
}

makeATen.register( 'BaseNumberNode', BaseNumberNode );

inherit( Node, BaseNumberNode, {}, {
  /**
   * @public {Object} - Maps place (0-3) to a {Dimension2} with the width/height
   */
  PAPER_NUMBER_DIMENSIONS: _.mapValues( BACKGROUND_IMAGE_MAP, function( mipmap ) {
    return new Dimension2( mipmap[ 0 ].width * SCALE, mipmap[ 0 ].height * SCALE );
  } ),

  /**
   * @public {Array.<Vector2>} - Maps place (0-3) to a {Vector2} that is the offset of the upper-left corner of the
   *                             BaseNumberNode relative to a 1-digit BaseNumberNode.
   */
  IMAGE_OFFSETS: [
    new Vector2( 0, 0 ),
    new Vector2( -70, -( PLACE_Y_OFFSET[ 1 ] - PLACE_Y_OFFSET[ 0 ] ) * SCALE ),
    new Vector2( -70 - ( ZERO_OFFSET[ 2 ][ 0 ] - ZERO_OFFSET[ 1 ][ 0 ] ) * SCALE, -( PLACE_Y_OFFSET[ 2 ] - PLACE_Y_OFFSET[ 0 ] ) * SCALE ),
    new Vector2( -70 - ( ZERO_OFFSET[ 3 ][ 0 ] - ZERO_OFFSET[ 1 ][ 0 ] ) * SCALE, -( PLACE_Y_OFFSET[ 3 ] - PLACE_Y_OFFSET[ 0 ] ) * SCALE )
  ]
} );

export default BaseNumberNode;