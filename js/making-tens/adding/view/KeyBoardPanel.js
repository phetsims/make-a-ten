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
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var NumberEntryControl = require( 'SCENERY_PHET/NumberEntryControl' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var makingTensKeypadSubmitString = require( 'string!MAKING_TENS/making-tens.keypad.submit' );

  /**
   * @param {Function} onSubmit -- TODO: docs?!?
   * @constructor
   */
  function KeyBoardPanel( onSubmit, maxDigits ) {

    var self = this;
    this.numberEntryControl = new NumberEntryControl( { maxDigits: maxDigits, readoutFont: new PhetFont( 25 ) } );

    var buttonOptions = {
      font: new PhetFont( 18 ),
      baseColor: '#F2E916',
      cornerRadius: 4
    };

    var submitNumberButton = new TextPushButton( makingTensKeypadSubmitString, _.extend( {
      listener: function() {
        //The number entry panel uses string to show digits, cast it to number
        onSubmit( self.numberEntryControl.getValue() );
      }
    }, buttonOptions ) );


    var numberControlGroup = new VBox( {
      children: [ this.numberEntryControl, submitNumberButton ],
      spacing: 12
    });

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

  makingTens.register( 'KeyBoardPanel', KeyBoardPanel );

  return inherit( Panel, KeyBoardPanel, {
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