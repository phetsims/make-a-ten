// Copyright 2015-2019, University of Colorado Boulder

/**
 * Button for showing "next" label and a arrow button.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Sam Reid
 */
define( require => {
  'use strict';

  // modules
  const ArrowShape = require( 'SCENERY_PHET/ArrowShape' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const LABEL_FONT = new PhetFont( { size: 20, weight: 'bold' } );

  /**
   * @constructor
   *
   * @param {string} buttonText
   * @param {Object} [options]
   */
  function NextArrowButton( buttonText, options ) {

    const arrowShape = new ArrowShape( 0, 0, 28.5, 0, {
      tailWidth: 2,
      headWidth: 8,
      headHeight: 8
    } );

    const labelArrowBox = new HBox( {
      children: [
        new Text( buttonText, { font: LABEL_FONT, fill: 'black', maxWidth: 150 } ),
        new Path( arrowShape, { fill: 'black' } )
      ],
      spacing: 15
    } );

    RectangularPushButton.call( this, _.extend( {
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 12,
      yMargin: 10,
      content: labelArrowBox
    }, options ) );
  }

  makeATen.register( 'NextArrowButton', NextArrowButton );

  return inherit( RectangularPushButton, NextArrowButton );
} );
