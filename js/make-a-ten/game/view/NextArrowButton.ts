// Copyright 2015-2026, University of Colorado Boulder

/**
 * Button for showing "next" label and a arrow button.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { type EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import type StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import ArrowShape from '../../../../../scenery-phet/js/ArrowShape.js';
import PhetColorScheme from '../../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../../scenery/js/layout/nodes/HBox.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import RectangularPushButton, { type RectangularPushButtonOptions } from '../../../../../sun/js/buttons/RectangularPushButton.js';

// constants
const LABEL_FONT = new PhetFont( { size: 20, weight: 'bold' } );

type SelfOptions = EmptySelfOptions;
export type NextArrowButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content'>;

class NextArrowButton extends RectangularPushButton {

  public constructor( buttonText: string, providedOptions?: NextArrowButtonOptions ) {

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

    const options = optionize<NextArrowButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 12,
      yMargin: 10,
      content: labelArrowBox
    }, providedOptions );

    super( options );
  }
}

export default NextArrowButton;
