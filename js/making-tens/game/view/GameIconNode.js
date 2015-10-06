// Copyright 2002-2014, University of Colorado Boulder

/**
 * Convenience type for creating the icons used on the game level start buttons.
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var TITLE_FONT = new PhetFont( 10 );
  var EQUATION_FONT = new PhetFont( { size: 20 } );
  var EQUATION_COLOR = 'rgb(63,63,183)';

  /**
   *
   * @param {NumberChallenge} numberChallenge
   * @param {number} level
   * @param {string} levelString
   * @constructor
   */
  function GameIconNode( terms, levelString ) {
    Node.call( this );

    var expression = terms[ 0 ] + ' + ' + terms[ 1 ];
    var expressionNode = new Text( expression, { font: EQUATION_FONT, fill: EQUATION_COLOR } );
    this.addChild( expressionNode );

    var titleNode = new Text( levelString, { font: TITLE_FONT } );
    this.addChild( titleNode );
    titleNode.top = expressionNode.bottom + 10;

  }

  return inherit( Node, GameIconNode );
} );
