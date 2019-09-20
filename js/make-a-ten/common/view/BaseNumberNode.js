// Copyright 2016-2019, University of Colorado Boulder

/**
 * Creates image views for base numbers.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Vector2 = require( 'DOT/Vector2' );

  // images
  const imageDigit0 = require( 'mipmap!MAKE_A_TEN/digit-0.png' );
  const imageDigit1 = require( 'mipmap!MAKE_A_TEN/digit-1.png' );
  const imageDigit2 = require( 'mipmap!MAKE_A_TEN/digit-2.png' );
  const imageDigit3 = require( 'mipmap!MAKE_A_TEN/digit-3.png' );
  const imageDigit4 = require( 'mipmap!MAKE_A_TEN/digit-4.png' );
  const imageDigit5 = require( 'mipmap!MAKE_A_TEN/digit-5.png' );
  const imageDigit6 = require( 'mipmap!MAKE_A_TEN/digit-6.png' );
  const imageDigit7 = require( 'mipmap!MAKE_A_TEN/digit-7.png' );
  const imageDigit8 = require( 'mipmap!MAKE_A_TEN/digit-8.png' );
  const imageDigit9 = require( 'mipmap!MAKE_A_TEN/digit-9.png' );
  const imagePaperBackground1 = require( 'mipmap!MAKE_A_TEN/paper-background-1.png' );
  const imagePaperBackground10 = require( 'mipmap!MAKE_A_TEN/paper-background-10.png' );
  const imagePaperBackground100 = require( 'mipmap!MAKE_A_TEN/paper-background-100.png' );
  const imagePaperBackground1000 = require( 'mipmap!MAKE_A_TEN/paper-background-1000.png' );

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

  return BaseNumberNode;
} );
