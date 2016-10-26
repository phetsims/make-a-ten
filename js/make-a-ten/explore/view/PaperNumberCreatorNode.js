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
  var Bounds2 = require( 'DOT/Bounds2' );
  var PaperNumberNode = require( 'MAKE_A_TEN/make-a-ten/common/view/PaperNumberNode' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  var Image = require( 'SCENERY/nodes/Image' );

  /**
   * @param {number} numberValue
   * @param {Function} addNumberToModel  - A function for adding the created number  to the model
   * @param {Function} tryToCombineNumbers
   * @param {Function} canPlaceNumber - A function to determine if the PaperNumber can be placed on the board
   * @param {MakeATenExploreScreenView} makeATenView
   * @constructor
   */
  function PaperNumberCreatorNode( numberValue, addNumberToModel, tryToCombineNumbers, canPlaceNumber,
                                   makeATenView ) {
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

        var viewPosition = makeATenView.globalToLocalPoint( event.pointer.point );

        // TODO: encapsulate?
        var newPaperNumberNode = makeATenView.createNumberForViewPosition( numberValue, viewPosition );

        newPaperNumberNode.moveDragHandler.tryToSnag( event );
      }
    } );
  }

  makeATen.register( 'PaperNumberCreatorNode', PaperNumberCreatorNode );

  return inherit( Node, PaperNumberCreatorNode, {
    /**
     * returns {Bound2}  the bounds only within which a new PaperNumber can be pulled out and created
     */
    getGlobalObjectCreationBounds: function() {
      var localNodeBounds = this.localBounds;
      var pullBounds = Bounds2.rect( localNodeBounds.x, localNodeBounds.height * MakeATenConstants.SPLIT_BOUNDARY_HEIGHT_PROPORTION,
        localNodeBounds.width, localNodeBounds.height );
      var globalCreationBounds = this.localToGlobalBounds( pullBounds );
      return globalCreationBounds;
    }

  } );

} );