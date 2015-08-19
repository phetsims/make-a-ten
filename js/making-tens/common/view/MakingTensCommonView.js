// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var DotRectangle = require( 'DOT/Rectangle' );
  var Property = require( 'AXON/Property' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var PaperNumberNode = require( 'MAKING_TENS/making-tens/common/view/PaperNumberNode' );
  var ArithmeticRules = require( 'MAKING_TENS/making-tens/common/model/ArithmeticRules' );

  // constants
  // Debug flag to show the view bounds, the region within which the user can move the numbers
  var showAvailableBounds = false;

  /**
   *
   * @param {MakingTensModel} makingTensModel
   * @param {Bounds2} screenBounds
   * @param {Node} paperNumberNodeLayer
   * @param {Function} addUserCreatedNumberModel - callback
   * @constructor
   */
  function MakingTensCommonView( makingTensModel, screenBounds, paperNumberNodeLayer, addUserCreatedNumberModel ) {
    var self = this;
    ScreenView.call( this, { layoutBounds: screenBounds } );
    self.makingTensModel = makingTensModel;

    self.paperNumberLayerNode = new Node();
    paperNumberNodeLayer.addChild( self.paperNumberLayerNode );

    self.addUserCreatedNumberModel = addUserCreatedNumberModel || makingTensModel.addUserCreatedNumberModel.bind( makingTensModel );
    self.combineNumbersIfApplicableCallback = this.combineNumbersIfApplicable.bind( this );

    function handlePaperNumberAdded( addedNumberModel ) {
      // Add a representation of the number.
      var paperNumberNode = new PaperNumberNode( addedNumberModel, self, self.addUserCreatedNumberModel, self.combineNumbersIfApplicableCallback );
      self.paperNumberLayerNode.addChild( paperNumberNode );

      // Move the shape to the front of this layer when grabbed by the user.
      addedNumberModel.userControlledProperty.link( function( userControlled ) {
        if ( userControlled ) {
          paperNumberNode.moveToFront();
        }
      } );

      makingTensModel.residentNumberModels.addItemRemovedListener( function removalListener( removedNumberModel ) {
        if ( removedNumberModel === addedNumberModel ) {
          self.paperNumberLayerNode.removeChild( paperNumberNode );
          makingTensModel.residentNumberModels.removeItemRemovedListener( removalListener );
        }
      } );
    }

    //Initial Number Node creation
    makingTensModel.residentNumberModels.forEach( handlePaperNumberAdded );

    // Observe new items
    makingTensModel.residentNumberModels.addItemAddedListener( handlePaperNumberAdded );

    // used to prevent numbers from moving outside the visible model bounds when dragged
    this.availableViewBoundsProperty = new Property( null );// filled by layout method

    // For debugging the visible bounds
    if ( showAvailableBounds ) {
      this.viewBoundsPath = new Path( null, { pickable: false, stroke: 'red', lineWidth: 10 } );
      this.addChild( this.viewBoundsPath );
    }

    this.availableViewBoundsProperty.lazyLink( function( newBounds ) {
      makingTensModel.residentNumberModels.forEach( function( numberModel ) {
        var newPos = numberModel.constrainPosition( newBounds, numberModel.position );
        numberModel.setDestination( newPos, false );
      } );
    } );
  }

  return inherit( ScreenView, MakingTensCommonView, {

    findPaperNumberNode: function( paperNumberModel ) {
      var self = this;
      var allPaperNumberNodes = self.paperNumberLayerNode.children;
      var node = _.find( allPaperNumberNodes, function( node ) {
        return node.paperNumberModel === paperNumberModel;
      } );
      return node;
    },

    /**
     * When user drops a node on another node , add if the arthimetic rules match
     * @param {PaperNumberNode} draggedPaperNumberModel
     * @param {Vector} droppedPoint (on screen coordinates)
     */
    combineNumbersIfApplicable: function( draggedPaperNumberModel, droppedPoint ) {
      var self = this;
      var draggedNode = self.findPaperNumberNode( draggedPaperNumberModel );
      var allPaperNumberNodes = self.paperNumberLayerNode.children;
      var droppedNodes = draggedNode.findAttachableNodes( allPaperNumberNodes, droppedPoint );

      //check them in reverse order (the one on the top should get more priority)
      droppedNodes.reverse();

      for ( var i = 0; i < droppedNodes.length; i++ ) {
        var numberA = draggedPaperNumberModel.numberValue;
        var numberB = droppedNodes[ i ].paperNumberModel.numberValue;
        if ( ArithmeticRules.canAddNumbers( numberA, numberB ) ) {
          var droppedPaperNumberModel = droppedNodes[ i ].paperNumberModel;
          self.makingTensModel.collapseNumberModels( draggedPaperNumberModel, droppedPaperNumberModel );
          return;
        }
        else {

          // repel numbers - show rejection
          var paperNumberModel1 = draggedNode.paperNumberModel;
          var paperNumberModel2 = droppedNodes[ i ].paperNumberModel;
          self.makingTensModel.repelAway( paperNumberModel1, paperNumberModel2 );
          return;
        }
      }

    },

    layout: function( width, height ) {
      this.resetTransform();

      var scale = this.getLayoutScale( width, height );
      this.setScaleMagnitude( scale );

      var offsetX = 0;
      var offsetY = 0;

      // Move to bottom vertically
      if ( scale === width / this.layoutBounds.width ) {
        offsetY = (height / scale - this.layoutBounds.height);
      }

      // center horizontally
      else if ( scale === height / this.layoutBounds.height ) {
        offsetX = (width - this.layoutBounds.width * scale) / 2 / scale;
      }
      this.translate( offsetX, offsetY );

      this.availableViewBoundsProperty.value = new DotRectangle( -offsetX, -offsetY, width / scale, height / scale );
      // Show it for debugging
      if ( showAvailableBounds ) {
        this.viewBoundsPath.shape = Shape.bounds( this.availableViewBoundsProperty.get() );
      }

    }
  } );
} );