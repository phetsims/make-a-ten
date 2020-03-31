// Copyright 2015-2020, University of Colorado Boulder

/**
 * A scenery node that looks like a key pad and allows the user to enter digits.  The entered digits are not displayed
 * by this node - it is intended to be used in conjunction with a separate display of some sort.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Andrey Zelenkov (MLearner)
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import merge from '../../../../../phet-core/js/merge.js';
import NumberEntryControl from '../../../../../scenery-phet/js/NumberEntryControl.js';
import PhetColorScheme from '../../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import Panel from '../../../../../sun/js/Panel.js';
import makeATenStrings from '../../../makeATenStrings.js';
import makeATen from '../../../makeATen.js';

const submitString = makeATenStrings.submit;

/**
 * @param {Function} onSubmit - function( numberEntryValue: {number} ), called when the submit button is pressed.
 * @constructor
 */
function KeyboardPanel( onSubmit, maxDigits ) {

  const self = this;
  this.numberEntryControl = new NumberEntryControl( { maxDigits: maxDigits, readoutFont: new PhetFont( 25 ) } );

  const buttonOptions = {
    font: new PhetFont( 18 ),
    baseColor: PhetColorScheme.BUTTON_YELLOW,
    cornerRadius: 4,
    maxTextWidth: 100
  };

  const submitNumberButton = new TextPushButton( submitString, merge( {
    touchAreaXDilation: 20,
    touchAreaYDilation: 7,
    listener: function() {
      //The number entry panel uses string to show digits, cast it to number
      onSubmit( self.numberEntryControl.getValue() );
    }
  }, buttonOptions ) );


  const numberControlGroup = new VBox( {
    children: [ this.numberEntryControl, submitNumberButton ],
    spacing: 12
  } );

  Panel.call( this, numberControlGroup, {
    xMargin: 15,
    yMargin: 10,
    fill: 'lightgray',
    stroke: 'black',
    lineWidth: 1,
    scale: 1.3,
    resize: false,
    backgroundPickable: true
  } );
}

makeATen.register( 'KeyboardPanel', KeyboardPanel );

export default inherit( Panel, KeyboardPanel, {
  /**
   * Sets the readout value of the keypad
   * @public
   *
   * @param {number} value
   */
  setValue: function( value ) {
    assert && assert( typeof value === 'number' );

    this.numberEntryControl.setValue( value );
  }

} );