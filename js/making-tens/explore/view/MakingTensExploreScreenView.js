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
  var SumEquationNode = require( 'MAKING_TENS/making-tens/explore/view/SumEquationNode' );
  var MakingTensExplorerNode = require( 'MAKING_TENS/making-tens/explore/view/MakingTensExplorerNode' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Checkbox = require( 'SUN/CheckBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

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

    var sumEquationNode = new SumEquationNode( makingTensExploreModel );
    self.addChild( sumEquationNode );
    sumEquationNode.left = this.layoutBounds.minX + 20;
    sumEquationNode.top = this.layoutBounds.minY + 20;

    // shape carousel
    var shapeContainerCarousel = new Node();
    self.addChild( shapeContainerCarousel );
    self.addChild( paperNumberNodeLayer );

    var explorerNodes = [];
    // Create the composite nodes that contain the number collections
    var exploreHundredsNode = new MakingTensExplorerNode( 100, self.addUserCreatedNumberModel, self.combineNumbersIfApplicableCallback );
    explorerNodes.push( exploreHundredsNode );
    var exploreTensNode = new MakingTensExplorerNode( 10, self.addUserCreatedNumberModel, self.combineNumbersIfApplicableCallback );
    explorerNodes.push( exploreTensNode );
    var exploreOnesNode = new MakingTensExplorerNode( 1, self.addUserCreatedNumberModel, self.combineNumbersIfApplicableCallback );
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

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }

  } );
} );