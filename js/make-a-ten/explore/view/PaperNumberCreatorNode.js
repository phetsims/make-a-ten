// Copyright 2015, University of Colorado Boulder

/**
 * A Scenery node that can be clicked upon to create Paper Number Nodes
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PaperNumberNode = require( 'MAKE_A_TEN/make-a-ten/common/view/PaperNumberNode' );
  var Image = require( 'SCENERY/nodes/Image' );

  /**
   * @param {number} numberValue
   * @param {MakeATenExploreScreenView} makeATenView
   * @constructor
   */
  function PaperNumberCreatorNode( numberValue, makeATenView ) {
    Node.call( this, {
      cursor: 'pointer'
    } );

    // Create the node that the user will click upon to add a model element to the view.
    var representation = new Image( PaperNumberNode.getNumberImage( numberValue ) );
    representation.scale( 0.64, 0.55 );
    this.addChild( representation );

    this.addInputListener( {
      down: function( event ) {
        // Ignore non-left mouse buttons
        if ( event.pointer.isMouse && event.domEvent && event.domEvent.button !== 0 ) {
          return;
        }

        // We want this relative to the screen view, so it is guaranteed to be the proper view coordinates.
        var viewPosition = makeATenView.globalToLocalPoint( event.pointer.point );

        makeATenView.createAndDragNumber( event, numberValue, viewPosition );
      }
    } );
  }

  makeATen.register( 'PaperNumberCreatorNode', PaperNumberCreatorNode );

  return inherit( Node, PaperNumberCreatorNode );

} );