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
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var NumberEntryControl = require( 'MAKING_TENS/making-tens/adding/view/NumberEntryControl' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var Node = require( 'SCENERY/nodes/Node' );

  // strings
  var submitString = require( 'string!MAKING_TENS/making-tens.keypad.submit' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function KeyBoardPanel( options ) {

    var numberEntryControl = new NumberEntryControl( {
      maxDigits: 3
    } );

    var buttonOptions = {
      font: new PhetFont( 18 ),
      baseColor: '#F2E916',
      cornerRadius: 4
    };

    var submitNumberButton = new TextPushButton( submitString, _.extend( {
      listener: function() {

      }
    }, buttonOptions ) );

    submitNumberButton.top = numberEntryControl.bottom + 10;
    submitNumberButton.left = (numberEntryControl.bounds.width - submitNumberButton.bounds.width) / 2;

    var numberControlGroup = new Node( {
      children: [ numberEntryControl, submitNumberButton ]
    } );

    Panel.call( this, numberControlGroup, {
      xMargin: 30,
      yMargin: 15,
      fill: "lightgray",
      stroke: "black",
      lineWidth: 1,
      resize: false
    } );
  }

  return inherit( Panel, KeyBoardPanel, {} );

} );