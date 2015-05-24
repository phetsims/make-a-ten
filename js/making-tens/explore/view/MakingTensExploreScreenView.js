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
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var HSlider = require( 'SUN/HSlider' );
  var Property = require( 'AXON/Property' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PaperNumberNode = require( 'MAKING_TENS/making-tens/common/view/PaperNumberNode' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var NumberAdditionRules = require( 'MAKING_TENS/making-tens/common/model/NumberAdditionRules' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // images
  var mockupImage = require( 'image!MAKING_TENS/explore-mockup.png' );

  // constants
  var SHAPE_CAROUSEL_SIZE = new Dimension2( 390, 125 );


  /**
   * @param {MakingTensExploreModel} makingTensExploreModel
   * @constructor
   */
  function MakingTensExploreScreenView( makingTensExploreModel ) {
    var self = this;
    ScreenView.call( this, { layoutBounds: MakingTensSharedConstants.LAYOUT_BOUNDS } );
    self.makingTensExploreModel = makingTensExploreModel;

    self.paperNumberLayerNode = new Node();
    self.addChild( self.paperNumberLayerNode );

    var addUserCreatedNumberModel = makingTensExploreModel.addUserCreatedNumberModel.bind( makingTensExploreModel );
    var combineNumbersIfApplicableCallback = this.combineNumbersIfApplicable.bind( this );

    function handleParticleAdded( addedNumberModel ) {
      // Add a representation of the number.
      var paperNumberNode = new PaperNumberNode( addedNumberModel, addUserCreatedNumberModel, combineNumbersIfApplicableCallback );
      self.paperNumberLayerNode.addChild( paperNumberNode );

      // Move the shape to the front of this layer when grabbed by the user.
      addedNumberModel.userControlledProperty.link( function( userControlled ) {
        if ( userControlled ) {
          paperNumberNode.moveToFront();
        }
      } );

      makingTensExploreModel.residentNumberModels.addItemRemovedListener( function removalListener( removedNumberModel ) {
        if ( removedNumberModel === addedNumberModel ) {
          self.paperNumberLayerNode.removeChild( paperNumberNode );
          makingTensExploreModel.residentNumberModels.removeItemRemovedListener( removalListener );
        }
      } );
    }

    //Initial Number Node creation
    makingTensExploreModel.residentNumberModels.forEach( handleParticleAdded );

    // Observe new items
    makingTensExploreModel.residentNumberModels.addItemAddedListener( handleParticleAdded );

    // shape carousel
    var shapeContainerCarousel = new Rectangle( 0, 0, SHAPE_CAROUSEL_SIZE.width, SHAPE_CAROUSEL_SIZE.height, 15, 15, {
      fill: MakingTensSharedConstants.SHAPE_CAROUSEL_BACKGROUND_COLOR,
      stroke: 'black',
      lineWidth: 1.5,
      bottom:  self.layoutBounds.maxY - 15,
      centerX: (self.layoutBounds.width / 2) - 12
    } );
    self.addChild( shapeContainerCarousel );

    // Create the composite nodes that contain the shape placement board, the readout, the bucket, the shape creator
    // nodes, and the eraser button.
    /* var exploreHundredsNode = new ExploreNode( model.singleShapePlacementBoard, model.addUserCreatedMovableShape.bind( model ),
     model.movableShapes, model.singleModeBucket, { shapesLayer: singleBoardShapesLayer } );
     this.addChild( centerExploreNode );
     var exploreTensNode = new ExploreNode( model.leftShapePlacementBoard, model.addUserCreatedMovableShape.bind( model ),
     model.movableShapes, model.leftBucket, { shapesLayer: dualBoardShapesLayer } );
     this.addChild( leftExploreNode );
     var exploreOnesNode = new ExploreNode( model.rightShapePlacementBoard, model.addUserCreatedMovableShape.bind( model ),
     model.movableShapes, model.rightBucket, { shapesLayer: dualBoardShapesLayer } );
     this.addChild( rightExploreNode ); */


    //Show the mock-up and a slider to change its transparency
    var mockupOpacityProperty = new Property( 0.4 );
    var image = new Image( mockupImage, { pickable: false } );
    mockupOpacityProperty.linkAttribute( image, 'opacity' );
    this.addChild( image );
    this.addChild( new HSlider( mockupOpacityProperty, { min: 0, max: 1 }, { top: 10, left: 500 } ) );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        makingTensExploreModel.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );


  }

  return inherit( ScreenView, MakingTensExploreScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    },

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
        if ( NumberAdditionRules.canAddNumbers( numberA, numberB ) ) {
          var droppedPaperNumberModel = droppedNodes[ i ].paperNumberModel;
          self.makingTensExploreModel.collapseNumberModels( draggedPaperNumberModel, droppedPaperNumberModel );
          return;
        }
        else {
          // explode away the smaller model - show rejection
          var smallerModel = draggedNode.paperNumberModel;
          if ( draggedNode.paperNumberModel.numberValue > droppedNodes[ i ].paperNumberModel.numberValue ) {
            smallerModel = droppedNodes[ i ].paperNumberModel;
          }
          self.makingTensExploreModel.moveAway( smallerModel );
          return;
        }
      }

    }
  } );
} );