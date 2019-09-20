// Copyright 2015-2019, University of Colorado Boulder

/**
 * A scenery node that looks like a key pad and allows the user to enter digits.  The entered digits are not displayed
 * by this node - it is intended to be used in conjunction with a separate display of some sort.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Andrey Zelenkov (MLearner)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const NumberEntryControl = require( 'SCENERY_PHET/NumberEntryControl' );
  const Panel = require( 'SUN/Panel' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const submitString = require( 'string!MAKE_A_TEN/submit' );

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

    const submitNumberButton = new TextPushButton( submitString, _.extend( {
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

  return inherit( Panel, KeyboardPanel, {
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

} );