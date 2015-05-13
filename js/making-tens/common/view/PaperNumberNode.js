// Copyright 2002-2013, University of Colorado Boulder

/**
 *
 * Represents the view of the PaperNumberModel.
 * It uses one or more number images based on the "Tens" in a given number.
 * These collections of images are positioned in a way to give "stacked" appearance
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  function PaperNumberNode() {
    var thisNode = this;
    Node.call( thisNode );
  }

  return inherit( Node, PaperNumberNode );
} );

