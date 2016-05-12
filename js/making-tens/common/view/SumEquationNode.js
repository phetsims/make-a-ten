// Copyright 2015, University of Colorado Boulder

/**
 * The node that displays the sum of all paper numbers placed on the explorer screen
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Panel = require( 'SUN/Panel' );

  // constants
  var SPACING = 15; // spacing between equation elements
  var EQUATION_FONT = new PhetFont( { size: 60, weight: 'bold' } );
  var EQUATION_COLOR = 'rgb(63,63,183)';

  /**
   *
   * @param {Property<number>} sumProperty
   * @param {Color} backGroundColor
   * @constructor
   */
  function SumEquationNode( sumProperty, backGroundColor ) {
    var self = this;
    Node.call( this );

    var sumTextNode = new Text( '0', { font: EQUATION_FONT, fill: EQUATION_COLOR } );
    var equalsSignNode = new Text( '=', { font: EQUATION_FONT, fill: EQUATION_COLOR } );

    // Perform the layout by placing everything in an HBox.
    var equationHBoxNode = new HBox( {
      children: [
        sumTextNode,
        equalsSignNode
      ], spacing: SPACING
    } );

    self.addChild( new Panel( equationHBoxNode, {
      fill: backGroundColor,
      lineWidth: 0,
      xMargin: 30,
      yMargin: 5,
      resize: false
    } ) );

    sumProperty.link( function( newSum ) {
      sumTextNode.text = newSum;
    } );
  }

  makingTens.register( 'SumEquationNode', SumEquationNode );

  return inherit( Node, SumEquationNode, {} );

} );