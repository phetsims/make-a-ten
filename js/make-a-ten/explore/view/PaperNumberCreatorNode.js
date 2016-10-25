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
  var ScreenView = require( 'JOIST/ScreenView' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var PaperNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/PaperNumber' );
  var PaperNumberNode = require( 'MAKE_A_TEN/make-a-ten/common/view/PaperNumberNode' );
  var MakeATenSharedConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenSharedConstants' );
  var Image = require( 'SCENERY/nodes/Image' );

  /**
   * @param {number} numberValue
   * @param {Function} addNumberToModel  - A function for adding the created number  to the model
   * @param {Function} tryToCombineNumbers
   * @param {Function} canPlaceNumber - A function to determine if the PaperNumber can be placed on the board
   * @constructor
   */
  function PaperNumberCreatorNode( numberValue, addNumberToModel, tryToCombineNumbers, canPlaceNumber,
                                   makeATenView ) {
    Node.call( this );
    var self = this;

    // Create the node that the user will click upon to add a model element to the view.
    var representation = new Image( PaperNumberNode.getNumberImage( numberValue ) );
    representation.scale( 0.64, 0.55 );
    this.addChild( representation );

    var paperNumber;
    var parentScreenView = null; // needed for coordinate transforms

    // Add the listener that will allow the user to click on this and create a new shape, then position it in the model.
    var paperNumberNodeCreatorDragHandler = new SimpleDragHandler( {

      // Allow moving a finger (touch) across this node to interact with it
      allowTouchSnag: true,

      start: function( event, trail ) {

        // find the parent screen if not already found by moving up the scene graph
        if ( !parentScreenView ) {
          var testNode = self;
          while ( testNode !== null ) {
            if ( testNode instanceof ScreenView ) {
              parentScreenView = testNode;
              break;
            }
            testNode = testNode.parents[ 0 ]; // move up the scene graph by one level
          }
          assert && assert( parentScreenView, 'unable to find parent screen view' );
        }

        // Determine the initial position of the new element as a function of the event position and this node's bounds.
        var upperLeftCornerGlobal = self.parentToGlobalPoint( self.leftTop );
        var initialPosition = parentScreenView.globalToLocalPoint( upperLeftCornerGlobal );

        // Create and add the new model element.
        paperNumber = new PaperNumber( numberValue, initialPosition );

        //offset based on clicked position
        var selectedPositionOffset = upperLeftCornerGlobal.minus( event.pointer.point );
        // check if the touched point is within the bottom portion of the node else move appropriate distance - issue #41
        var allowedGlobalCreationBounds = self.getGlobalObjectCreationBounds();
        var offsetY = -allowedGlobalCreationBounds.height - selectedPositionOffset.y;
        var selectedPosition = initialPosition.plus( new Vector2( 0, offsetY ) );

        paperNumber.setDestination( selectedPosition );
        paperNumber.userControlledProperty.value = true;
        addNumberToModel( paperNumber );

      },

      translate: function( translationParams ) {
        if ( !paperNumber ) {
          return;
        }
        var newPos = paperNumber.positionProperty.value.plus( translationParams.delta );
        paperNumber.constrainPosition( makeATenView.availableViewBoundsProperty.value, newPos );
      },

      end: function( event, trail ) {
        if ( !paperNumber ) {
          return;
        }
        paperNumber.userControlledProperty.value = false;
        var droppedPoint = event.pointer.point;
        var droppedViewPoint = parentScreenView.globalToLocalPoint( event.pointer.point );

        //check if the user has dropped the number within the panel, if "yes" return to origin
        if ( !canPlaceNumber( paperNumber, droppedViewPoint ) ) {
          paperNumber.returnToOrigin( true );
          paperNumber = null;
          return;
        }
        tryToCombineNumbers( paperNumber, droppedPoint );
        paperNumber = null;
      }
    } );

    this.addInputListener( paperNumberNodeCreatorDragHandler );

    // show proper cursor to indicate the paperNumber can be dragged out
    paperNumberNodeCreatorDragHandler.move = function( event ) {
      var allowedGlobalCreationBounds = self.getGlobalObjectCreationBounds();
      if ( allowedGlobalCreationBounds.containsPoint( event.pointer.point ) ) {
        self.cursor = 'pointer';
      }
      else {
        self.cursor = 'default';
      }
    };

    paperNumberNodeCreatorDragHandler.out = function() {
      self.cursor = 'default';
    };


  }

  makeATen.register( 'PaperNumberCreatorNode', PaperNumberCreatorNode );

  return inherit( Node, PaperNumberCreatorNode, {

    /**
     * returns {Bound2}  the bounds only within which a new PaperNumber can be pulled out and created
     */
    getGlobalObjectCreationBounds: function() {
      var localNodeBounds = this.localBounds;
      var pullBounds = Bounds2.rect( localNodeBounds.x, localNodeBounds.height * MakeATenSharedConstants.SPLIT_BOUNDARY_HEIGHT_PROPORTION,
        localNodeBounds.width, localNodeBounds.height );
      var globalCreationBounds = this.localToGlobalBounds( pullBounds );
      return globalCreationBounds;
    }

  } );

} );