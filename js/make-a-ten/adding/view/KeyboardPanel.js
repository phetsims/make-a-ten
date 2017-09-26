// Copyright 2015-2017, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var NumberEntryControl = require( 'SCENERY_PHET/NumberEntryControl' );
  var Panel = require( 'SUN/Panel' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var submitString = require( 'string!MAKE_A_TEN/submit' );

  /**
   * @param {Function} onSubmit - function( numberEntryValue: {number} ), called when the submit button is pressed.
   * @constructor
   */
  function KeyboardPanel( onSubmit, maxDigits ) {

    var self = this;
    this.numberEntryControl = new NumberEntryControl( { maxDigits: maxDigits, readoutFont: new PhetFont( 25 ) } );

    var buttonOptions = {
      font: new PhetFont( 18 ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      cornerRadius: 4,
      maxTextWidth: 100
    };

    var submitNumberButton = new TextPushButton( submitString, _.extend( {
      touchAreaXDilation: 20,
      touchAreaYDilation: 7,
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