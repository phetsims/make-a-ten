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
  var Panel = require( 'SUN/Panel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PaperNumberNode = require( 'MAKING_TENS/making-tens/common/view/PaperNumberNode' );
  var SumEquationNode = require( 'MAKING_TENS/making-tens/explore/view/SumEquationNode' );
  var MakingTensExplorerNode = require( 'MAKING_TENS/making-tens/explore/view/MakingTensExplorerNode' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var ArithmeticRules = require( 'MAKING_TENS/making-tens/common/model/ArithmeticRules' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Checkbox = require( 'SUN/CheckBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // images
  var mockupImage = require( 'image!MAKING_TENS/explore-mockup.png' );

  // strings
  var hideTotalString = require( 'string!MAKING_TENS/making-tens.hide.total' );


  /**
   * @param {MakingTensExploreModel} makingTensExploreModel
   * @constructor
   */
  function MakingTensExploreScreenView( makingTensExploreModel ) {
    var self = this;
    ScreenView.call( this, { layoutBounds: MakingTensSharedConstants.LAYOUT_BOUNDS } );
    self.makingTensExploreModel = makingTensExploreModel;

    self.paperNumberLayerNode = new Node();

    var addUserCreatedNumberModel = makingTensExploreModel.addUserCreatedNumberModel.bind( makingTensExploreModel );
    var combineNumbersIfApplicableCallback = this.combineNumbersIfApplicable.bind( this );

    function handlePaperNumberAdded( addedNumberModel ) {
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
    makingTensExploreModel.residentNumberModels.forEach( handlePaperNumberAdded );

    // Observe new items
    makingTensExploreModel.residentNumberModels.addItemAddedListener( handlePaperNumberAdded );

    var sumEquationNode = new SumEquationNode( makingTensExploreModel );
    self.addChild( sumEquationNode );
    sumEquationNode.left = this.layoutBounds.minX + 20;
    sumEquationNode.top = this.layoutBounds.minY + 20;

    // shape carousel
    var shapeContainerCarousel = new Node();
    self.addChild( shapeContainerCarousel );


    var explorerNodes = [];
    // Create the composite nodes that contain the number collections
    var exploreHundredsNode = new MakingTensExplorerNode( 100, addUserCreatedNumberModel, combineNumbersIfApplicableCallback );
    explorerNodes.push( exploreHundredsNode );
    var exploreTensNode = new MakingTensExplorerNode( 10, addUserCreatedNumberModel, combineNumbersIfApplicableCallback );
    explorerNodes.push( exploreTensNode );
    var exploreOnesNode = new MakingTensExplorerNode( 1, addUserCreatedNumberModel, combineNumbersIfApplicableCallback );
    explorerNodes.push( exploreOnesNode );


    // Add a non-scrolling panel
    var creatorNodeHBox = new HBox( { children: explorerNodes, spacing: 30 } );
    shapeContainerCarousel.addChild( new Panel( creatorNodeHBox, {
      fill: MakingTensSharedConstants.SHAPE_CAROUSEL_BACKGROUND_COLOR,
      stroke: 'black',
      lineWidth: 1.5,
      bottom:  self.layoutBounds.maxY - 15,
      centerX: (self.layoutBounds.width / 2) - 12,
      xMargin: 30,
      yMargin: 5,
      resize: false

    } ) );


    self.addChild( self.paperNumberLayerNode );

    //Show the mock-up and a slider to change its transparency
    var mockupOpacityProperty = new Property( 0.4 );
    var image = new Image( mockupImage, { pickable: false } );
    mockupOpacityProperty.linkAttribute( image, 'opacity' );
    this.addChild( image );
    this.addChild( new HSlider( mockupOpacityProperty, { min: 0, max: 1 }, { top: 10, left: 500 } ) );

    var sumTextNode = new Text( hideTotalString, { font: new PhetFont( { size: 25, weight: 'bold' } ), fill: "black" } );
    var showSumCheckBox = new Checkbox( sumTextNode, self.makingTensExploreModel.hideTotalProperty, {
      spacing: 10,
      boxWidth: 30
    } );
    this.addChild( showSumCheckBox );

    showSumCheckBox.right = this.layoutBounds.maxX - 110;
    showSumCheckBox.bottom = this.layoutBounds.maxY - 20;

    self.makingTensExploreModel.hideTotalProperty.link( function( hideTotal ) {
      sumEquationNode.visible = !hideTotal;
    } );

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
        if ( ArithmeticRules.canAddNumbers( numberA, numberB ) ) {
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