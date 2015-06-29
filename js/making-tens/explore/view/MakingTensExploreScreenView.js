// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Panel = require( 'SUN/Panel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var MakingTensCommonView = require( 'MAKING_TENS/making-tens/common/view/MakingTensCommonView' );
  var SumEquationNode = require( 'MAKING_TENS/making-tens/common/view/SumEquationNode' );
  var MakingTensExplorerNode = require( 'MAKING_TENS/making-tens/explore/view/MakingTensExplorerNode' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Checkbox = require( 'SUN/CheckBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // strings
  var hideTotalString = require( 'string!MAKING_TENS/making-tens.hide.total' );

  /**
   * @param {MakingTensExploreModel} makingTensExploreModel
   * @constructor
   */
  function MakingTensExploreScreenView( makingTensExploreModel ) {
    var self = this;
    var paperNumberNodeLayer = new Node();
    MakingTensCommonView.call( this, makingTensExploreModel, MakingTensSharedConstants.LAYOUT_BOUNDS, paperNumberNodeLayer );

    var sumEquationNode = new SumEquationNode( makingTensExploreModel.sumProperty, MakingTensSharedConstants.EXPLORER_SCREEN_BACKGROUND_COLOR );
    self.addChild( sumEquationNode );
    sumEquationNode.left = this.layoutBounds.minX + 20;
    sumEquationNode.top = this.layoutBounds.minY + 20;

    // shape carousel
    this.shapeContainerCarousel = new Node();
    self.addChild( this.shapeContainerCarousel );
    self.addChild( paperNumberNodeLayer );

    var explorerNodes = [];
    // Create the composite nodes that contain the number collections
    var exploreHundredsNode = new MakingTensExplorerNode( 100, self.addUserCreatedNumberModel, self.combineNumbersIfApplicableCallback, self.canPlaceShape.bind( self ) );
    explorerNodes.push( exploreHundredsNode );
    var exploreTensNode = new MakingTensExplorerNode( 10, self.addUserCreatedNumberModel, self.combineNumbersIfApplicableCallback, self.canPlaceShape.bind( self ) );
    explorerNodes.push( exploreTensNode );
    var exploreOnesNode = new MakingTensExplorerNode( 1, self.addUserCreatedNumberModel, self.combineNumbersIfApplicableCallback, self.canPlaceShape.bind( self ) );
    explorerNodes.push( exploreOnesNode );


    // Add a non-scrolling panel
    var creatorNodeHBox = new HBox( { children: explorerNodes, spacing: 30 } );
    this.shapeContainerCarousel.addChild( new Panel( creatorNodeHBox, {
      fill: MakingTensSharedConstants.SHAPE_CAROUSEL_BACKGROUND_COLOR,
      stroke: 'black',
      lineWidth: 1.5,
      bottom:  self.layoutBounds.maxY - 15,
      centerX: (self.layoutBounds.width / 2) - 12,
      xMargin: 30,
      yMargin: 5,
      resize: false

    } ) );


    var sumTextNode = new Text( hideTotalString, { font: new PhetFont( { size: 25, weight: 'bold' } ), fill: "black" } );
    var showSumCheckBox = new Checkbox( sumTextNode, makingTensExploreModel.hideTotalProperty, {
      spacing: 10,
      boxWidth: 30
    } );
    this.addChild( showSumCheckBox );

    showSumCheckBox.right = this.layoutBounds.maxX - 110;
    showSumCheckBox.bottom = this.layoutBounds.maxY - 20;

    makingTensExploreModel.hideTotalProperty.link( function( hideTotal ) {
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

  return inherit( MakingTensCommonView, MakingTensExploreScreenView, {
    /**
     *
     * @param {PaperNumberModel} paperNumberModel
     * @param {Vector2} droppedPosition
     */
    canPlaceShape: function( paperNumberModel, droppedPosition ) {
      var paperNumberBounds = paperNumberModel.getBounds();
      var widthPart = paperNumberBounds.width * 0.6;
      var heightPart = paperNumberBounds.height * 0.6;
      var bounds2 = new Bounds2( droppedPosition.x, droppedPosition.y, droppedPosition.x + widthPart, droppedPosition.y + heightPart );
      var intersects = this.shapeContainerCarousel.bounds.intersectsBounds( bounds2 );
      return !intersects;
    }

  } );
} );