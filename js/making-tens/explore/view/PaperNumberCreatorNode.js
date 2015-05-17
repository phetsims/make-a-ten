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
  var Vector2 = require( 'DOT/Vector2' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var PaperNumberNode = require( 'MAKING_TENS/making-tens/common/view/PaperNumberNode' );
  var PaperNumberModel = require( 'MAKING_TENS/making-tens/common/model/PaperNumberModel' );

  /**
   * @param {number} numberValue
   * @param {Function} addShapeToModel - A function for adding the created number  to the model
   * @constructor
   */
  function PaperNumberCreatorNode( numberValue, addShapeToModel ) {

    Node.call( this, { cursor: 'pointer' } );
    var self = this;

    // Create the node that the user will click upon to add a model element to the view.
    var representation = new PaperNumberNode( new PaperNumberModel( numberValue, new Vector2( 0, 0 ) ) );
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
        this.paperNumberModel = addShapeToModel( numberValue, initialPosition );
        this.paperNumberModel.userControlled = true;

      },

      translate: function( translationParams ) {
        this.paperNumberModel.setDestination( this.paperNumberModel.position.plus( translationParams.delta ) );
      },

      end: function( event, trail ) {
        this.paperNumberModel.userControlled = false;
        this.paperNumberModel = null;
      }
    } ) );

  }

  return inherit( Node, PaperNumberCreatorNode );
} );