// Copyright 2015, University of Colorado Boulder

/**
 * A scenery node that looks like a key pad and allows the user to enter digits.  The entered digits are not displayed
 * by this node - it is intended to be used in conjunction with a separate display of some sort.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Andrey Zelenkov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var NumberEntryControl = require( 'SCENERY_PHET/NumberEntryControl' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var makeATenKeypadSubmitString = require( 'string!MAKE_A_TEN/make-a-ten.keypad.submit' );

  /**
   * @param {Function} onSubmit -- TODO: docs?!?
   * @constructor
   */
  function KeyboardPanel( onSubmit, maxDigits ) {

    var self = this;
    this.numberEntryControl = new NumberEntryControl( { maxDigits: maxDigits, readoutFont: new PhetFont( 25 ) } );

    var buttonOptions = {
      font: new PhetFont( 18 ),
      baseColor: '#F2E916',
      cornerRadius: 4,
      maxTextWidth: 100
    };

    var submitNumberButton = new TextPushButton( makeATenKeypadSubmitString, _.extend( {
      listener: function() {
        //The number entry panel uses string to show digits, cast it to number
        onSubmit( self.numberEntryControl.getValue() );
      }
    }, buttonOptions ) );


    var numberControlGroup = new VBox( {
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