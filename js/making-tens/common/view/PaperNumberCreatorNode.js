// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that can be clicked upon to create Paper Number Nodes
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var PaperNumberModel = require( 'MAKING_TENS/making-tens/common/model/PaperNumberModel' );
  var PaperImageCollection = require( 'MAKING_TENS/making-tens/common/model/PaperImageCollection' );
  var Image = require( 'SCENERY/nodes/Image' );

  /**
   * @param {number} numberValue
   * @param {Function} addShapeToModel - A function for adding the created number  to the model
   * @param {Function} canPlaceShape - A function to determine if the PaperNumber can be placed on the board
   * @constructor
   */
  function PaperNumberCreatorNode( numberValue, addShapeToModel, combineNumbersIfApplicableCallback, canPlaceShape, makingTensView ) {

    Node.call( this, { cursor: 'pointer' } );
    var self = this;

    // Create the node that the user will click upon to add a model element to the view.
    var representation = new Image( PaperImageCollection.getNumberImage( numberValue ) );
    representation.scale( 0.64, 0.55 );
    this.addChild( representation );

    // Add the listener that will allow the user to click on this and create a new shape, then position it in the model.
    this.addInputListener( new SimpleDragHandler( {

      parentScreen: null, // needed for coordinate transforms
      paperNumberModel: null,

      // Allow moving a finger (touch) across this node to interact with it
      allowTouchSnag: true,

      start: function( event, trail ) {

        // Find the parent screen by moving up the scene graph.
        var testNode = self;
        while ( testNode !== null ) {
          if ( testNode instanceof ScreenView ) {
            this.parentScreen = testNode;
            break;
          }
          testNode = testNode.parents[ 0 ]; // Move up the scene graph by one level
        }

        // Determine the initial position of the new element as a function of the event position and this node's bounds.
        var upperLeftCornerGlobal = self.parentToGlobalPoint( self.leftTop );
        var initialPositionOffset = upperLeftCornerGlobal.minus( event.pointer.point );
        var initialPosition = this.parentScreen.globalToLocalPoint( event.pointer.point.plus( initialPositionOffset ) );

        // Create and add the new model element.
        this.paperNumberModel = new PaperNumberModel( numberValue, initialPosition );
        this.paperNumberModel.userControlled = true;
        addShapeToModel( this.paperNumberModel );

      },

      translate: function( translationParams ) {
        var newPos = this.paperNumberModel.position.plus( translationParams.delta );
        newPos = this.paperNumberModel.constrainPosition( makingTensView.availableViewBoundsProperty.get(), newPos );
        this.paperNumberModel.setDestination( newPos );
      },

      end: function( event, trail ) {
        this.paperNumberModel.userControlled = false;
        var droppedPoint = event.pointer.point;
        var droppedScreenPoint = this.parentScreen.globalToLocalPoint( event.pointer.point );
        //check if the user has dropped the number within the panel itself, if "yes" return to origin
        if ( !canPlaceShape( this.paperNumberModel, droppedScreenPoint ) ) {
          this.paperNumberModel.returnToOrigin( true );
          this.paperNumberModel = null;
          return;
        }
        combineNumbersIfApplicableCallback( this.paperNumberModel, droppedPoint );
        this.paperNumberModel = null;
      }
    } ) );

  }

  return inherit( Node, PaperNumberCreatorNode );
} );