// Copyright 2015-2026, University of Colorado Boulder

/**
 * A scenery node that looks like a key pad and allows the user to enter digits.  The entered digits are not displayed
 * by this node - it is intended to be used in conjunction with a separate display of some sort.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Andrey Zelenkov (MLearner)
 */

import merge from '../../../../../phet-core/js/merge.js';
import NumberEntryControl from '../../../../../scenery-phet/js/NumberEntryControl.js';
import PhetColorScheme from '../../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../../scenery/js/layout/nodes/VBox.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import Panel from '../../../../../sun/js/Panel.js';
import MakeATenStrings from '../../../MakeATenStrings.js';

class KeyboardPanel extends Panel {

  private readonly numberEntryControl: NumberEntryControl;

  /**
   * @param onSubmit - function( numberEntryValue: {number} ), called when the submit button is pressed.
   * @param maxDigits
   */
  public constructor( onSubmit: ( numberEntryValue: number ) => void, maxDigits: number ) {

    const numberEntryControl = new NumberEntryControl( { maxDigits: maxDigits, readoutFont: new PhetFont( 25 ) } );

    const buttonOptions = {
      font: new PhetFont( 18 ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      cornerRadius: 4,
      maxTextWidth: 100
    };

    const submitNumberButton = new TextPushButton( MakeATenStrings.submitStringProperty, merge( {
      touchAreaXDilation: 20,
      touchAreaYDilation: 7,
      listener: () => {
        //The number entry panel uses string to show digits, cast it to number
        onSubmit( numberEntryControl.getValue() );
      }
    }, buttonOptions ) );

    const numberControlGroup = new VBox( {
      children: [ numberEntryControl, submitNumberButton ],
      spacing: 12
    } );

    super( numberControlGroup, {
      xMargin: 15,
      yMargin: 10,
      fill: 'lightgray',
      stroke: 'black',
      lineWidth: 1,
      scale: 1.3,
      resize: false,
      backgroundPickable: true
    } );

    this.numberEntryControl = numberEntryControl;
  }

  /**
   * Sets the readout value of the keypad
   */
  public setValue( value: number ): void {
    this.numberEntryControl.setValue( value );
  }
}

export default KeyboardPanel;
