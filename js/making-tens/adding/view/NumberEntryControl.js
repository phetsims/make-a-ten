// Copyright 2002-2014, University of Colorado Boulder

/**
 * A composite Scenery node that brings together a keypad and a box where the entered values are displayed.  Kind of
 * looks like a calculator, though it doesn't behave as one.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Keypad = require( 'MAKING_TENS/making-tens/adding/view/Keypad' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var READOUT_FONT = new PhetFont( 25 );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function NumberEntryControl( options ) {
    Node.call( this );
    var self = this;
    options = _.extend( {
      maxDigits: 5
    }, options );

    // Add the keypad.
    this.keypad = new Keypad( { maxDigits: options.maxDigits } );
    this.addChild( this.keypad );

    // Add the number readout background.
    var testString = new Text( '', { font: READOUT_FONT } );
    _.times( options.maxDigits, function() { testString.text += '9'; } );
    var readoutBackground = new Rectangle( 0, 0, testString.width * 1.2, testString.height * 1.2, 4, 4, {
      fill: 'white',
      stroke: '#777777',
      lineWidth: 1.5,
      centerX: this.keypad.width / 2
    } );
    this.addChild( readoutBackground );

    // Add the digits.
    var digits = new Text( '', { font: READOUT_FONT } );
    this.addChild( digits );
    this.value = "0"; // @private
    this.keypad.digitString.link( function( digitString ) {
      digits.text = digitString;
      digits.center = readoutBackground.center;
      self.value = digitString;
    } );

    // Layout
    this.keypad.top = readoutBackground.bottom + 10;

    // Pass options through to parent class.
    this.mutate( options );
  }

  return inherit( Node, NumberEntryControl, {
    getValue: function() {
      return this.value;
    },

    setValue: function( value ) {
      this.keypad.digitString.set( value );
    },

    clear: function() {
      this.keypad.clear();
    },
    armForNewEntry: function() {
      this.keypad.armForNewEntry();
    }
  } );
} );