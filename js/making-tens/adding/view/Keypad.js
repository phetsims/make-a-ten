// Copyright 2002-2014, University of Colorado Boulder

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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var BackspaceIcon = require( 'SCENERY_PHET/BackspaceIcon' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Keypad( options ) {

    options = _.extend( {
      buttonFont: new PhetFont( { size: 20 } ),
      minButtonWidth: 35,
      minButtonHeight: 35,
      doubleWideZeroKey: true,
      xSpacing: 10,
      ySpacing: 10,
      keyColor: 'white',
      maxDigits: 8 // Maximum number of digits that the user may enter
    }, options );

    var self = this;

    // @public String of digits entered by the user
    this.digitString = new Property( '' );

    // @private Flag used when arming the keypad to start over on the next key stroke.
    this.armedForNewEntry = false;

    // function for creating a number key
    function createNumberKey( number, doubleWide ) {
      var minWidth = doubleWide ? options.minButtonWidth * 2 + options.xSpacing : options.minButtonWidth;
      return new RectangularPushButton( _.extend( {
        content: new Text( number.toString(), { font: options.buttonFont } ),
        baseColor: options.keyColor,
        minWidth: minWidth,
        minHeight: options.minButtonHeight,
        xMargin: 5,
        yMargin: 5,
        listener: function() {

          // If armed for new entry, clear the existing string.
          if ( self.armedForNewEntry ) {
            self.digitString.reset();
            self.armedForNewEntry = false;
          }

          // Add the digit to the string, but limit the length and prevent multiple leading zeros.
          if ( self.digitString.value === '0' ) {
            if ( number.toString !== 0 ) {
              // Replace the leading 0 with this digit.
              self.digitString.value = number.toString();
            }
            // else ignore the additional zero
          }
          else if ( self.digitString.value.length < options.maxDigits ) {
            self.digitString.value += number.toString();
          }
        }
      }, options ) );
    }

    // Create the backspace button.
    var backspaceIcon = new BackspaceIcon();
    backspaceIcon.scale( Math.min( options.minButtonWidth / backspaceIcon.width * 0.7, ( options.minButtonHeight * 0.65 ) / backspaceIcon.height ) );
    var backspaceButton = new RectangularPushButton( {
      content: backspaceIcon,
      minWidth: options.minButtonWidth,
      minHeight: options.minButtonHeight,
      xMargin: 1,
      baseColor: options.keyColor,
      listener: function() {
        if ( self.digitString.value.length > 0 ) {
          // Remove the last digit from the string.
          self.digitString.value = self.digitString.value.slice( 0, -1 );
        }
      }
    } );

    // The bottom row of buttons can vary based on options.
    var bottomButtonRowChildren = [ createNumberKey( 0, options.doubleWideZeroKey ) ];
    if ( !options.doubleWideZeroKey ) {
      bottomButtonRowChildren.push( new HStrut( options.minButtonWidth ) );
    }
    bottomButtonRowChildren.push( backspaceButton );

    // Add the buttons.
    VBox.call( this, {
      spacing: options.ySpacing, children: [
        new HBox( {
          spacing: options.xSpacing, children: [
            createNumberKey( 7 ),
            createNumberKey( 8 ),
            createNumberKey( 9 )
          ]
        } ),
        new HBox( {
          spacing: options.xSpacing, children: [
            createNumberKey( 4 ),
            createNumberKey( 5 ),
            createNumberKey( 6 )
          ]
        } ),
        new HBox( {
          spacing: options.xSpacing, children: [
            createNumberKey( 1 ),
            createNumberKey( 2 ),
            createNumberKey( 3 )
          ]
        } ),
        new HBox( { spacing: options.xSpacing, children: bottomButtonRowChildren } )
      ]
    } );

    // Pass options through to parent class
    this.mutate( options );
  }

  return inherit( VBox, Keypad, {

    // Clear anything that has been accumulated in the digitString field.
    clear: function() {
      this.digitString.reset();
    },

    // Set the keypad such that any new digit entry will clear the existing string and start over.
    armForNewEntry: function() {
      this.armedForNewEntry = true;
    }
  } );
} );
