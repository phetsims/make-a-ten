// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makingTens = require( 'MAKING_TENS/makingTens' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Panel = require( 'SUN/Panel' );
  var Vector2 = require( 'DOT/Vector2' );
  var MakingTensCommonView = require( 'MAKING_TENS/making-tens/common/view/MakingTensCommonView' );
  var PaperNumberModel = require( 'MAKING_TENS/making-tens/common/model/PaperNumberModel' );
  var MakingTensExplorerNode = require( 'MAKING_TENS/making-tens/explore/view/MakingTensExplorerNode' );
  var ArrowCueNode = require( 'MAKING_TENS/making-tens/explore/view/ArrowCueNode' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var CheckBox = require( 'SUN/CheckBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // strings
  var makingTensHideTotalString = require( 'string!MAKING_TENS/making-tens.hide.total' );

  // These offsets are with respect to ViewPort Bounds not layout bounds
  // this is done to make sure the sumEquationNode is always at top left even after window resize and scale
  var sumNodeOffSetX = 30;
  var sumNodeOffSetY = 30;
  var TOUCH_AREA_X_DILATION = 10;
  var TOUCH_AREA_Y_DILATION = 4;
  var EQUATION_FONT = new PhetFont( { size: 60, weight: 'bold' } );
  var EQUATION_COLOR = 'rgb(63,63,183)';

  /**
   * @param {MakingTensExploreModel} makingTensExploreModel
   * @constructor
   */
  function MakingTensExploreScreenView( makingTensExploreModel ) {
    var self = this;

    MakingTensCommonView.call( this, makingTensExploreModel, MakingTensSharedConstants.LAYOUT_BOUNDS,
      self.addPaperNumber.bind( self ) );

    var sumTextNode = new Text( '0', { font: EQUATION_FONT, fill: EQUATION_COLOR } );
    var equalsSignNode = new Text( '=', { font: EQUATION_FONT, fill: EQUATION_COLOR } );

    var spaceBetweenSumAndEquals = 15; // spacing between equation elements
    // Perform the layout by placing everything in an HBox.
    var equationHBox = new HBox( {
      children: [
        sumTextNode,
        equalsSignNode
      ], spacing: spaceBetweenSumAndEquals
    } );

    makingTensExploreModel.sumProperty.link( function( newSum ) {
      sumTextNode.text = newSum;
    } );
    self.addChild( equationHBox );


    var explorerNodes = [];
    var addPaperNumberCallback = self.addPaperNumber.bind( self );
    var canPlaceNumberCallback = self.canPlaceNumberAt.bind( self );

    // Create the composite nodes that contain the number collections
    var exploreHundredsNode = new MakingTensExplorerNode( 100, addPaperNumberCallback,
      self.tryToCombineNumbers, canPlaceNumberCallback, self );
    explorerNodes.push( exploreHundredsNode );
    var exploreTensNode = new MakingTensExplorerNode( 10, addPaperNumberCallback,
      self.tryToCombineNumbers, canPlaceNumberCallback, self );
    explorerNodes.push( exploreTensNode );
    var exploreOnesNode = new MakingTensExplorerNode( 1,
      addPaperNumberCallback,
      self.tryToCombineNumbers, canPlaceNumberCallback, self );
    explorerNodes.push( exploreOnesNode );

    // Add a non-scrolling panel
    var creatorNodeHBox = new HBox( { children: explorerNodes, spacing: 30 } );

    // PaperNumber ContainerPanel
    this.paperNumbersContainerPanel = new Panel( creatorNodeHBox, {
      fill: MakingTensSharedConstants.PAPER_NUMBER_REPO_PANEL_BACKGROUND_COLOR,
      stroke: 'black',
      lineWidth: 1.5,
      bottom:  self.layoutBounds.maxY - 15,
      centerX: (self.layoutBounds.width / 2) - 12,
      xMargin: 30,
      yMargin: 5,
      resize: false

    } );

    self.addChild( this.paperNumbersContainerPanel );
    self.addChild( self.paperNumberLayerNode );


    var carouselContainerStartPos = this.paperNumbersContainerPanel.leftTop.plus(
      new Vector2( this.paperNumbersContainerPanel.xMargin, this.paperNumbersContainerPanel.yMargin ) );

    var shapeCreatorHundredsContainerPos = carouselContainerStartPos.plus(
      creatorNodeHBox.children[ 0 ].leftTop );
    var shapeCreatorTensContainerPos = carouselContainerStartPos.plus(
      creatorNodeHBox.children[ 1 ].leftTop );
    var shapeCreatorSinglesContainer = carouselContainerStartPos.plus(
      creatorNodeHBox.children[ 2 ].leftTop );

    // used for sending PaperNumber models to its origin
    this.explorePanelPositions = {
      3: shapeCreatorHundredsContainerPos,
      2: shapeCreatorTensContainerPos,
      1: shapeCreatorSinglesContainer
    };

    var showSumTextNode = new Text( makingTensHideTotalString, {
      font: new PhetFont(
        {
          size: 25,
          weight: 'bold'
        } ),
      fill: 'black'
    } );

    var showSumCheckBox = new CheckBox( showSumTextNode, makingTensExploreModel.hideTotalProperty, {
      spacing: 10,
      boxWidth: 30
    } );
    this.addChild( showSumCheckBox );

    showSumCheckBox.right = this.layoutBounds.maxX - 110;
    showSumCheckBox.bottom = this.layoutBounds.maxY - 20;

    showSumCheckBox.touchArea = showSumCheckBox.
      localBounds.dilatedXY( TOUCH_AREA_X_DILATION, TOUCH_AREA_Y_DILATION );

    makingTensExploreModel.hideTotalProperty.link( function( hideTotal ) {
      equationHBox.visible = !hideTotal;
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

    this.availableViewBoundsProperty.lazyLink( function( newBounds ) {
      equationHBox.left = newBounds.minX + sumNodeOffSetX;
      equationHBox.top = newBounds.minY + sumNodeOffSetY;
    } );

    var repositoryPanelBounds = this.paperNumbersContainerPanel.bounds;
    this.returnZoneBounds = new Bounds2( repositoryPanelBounds.minX, repositoryPanelBounds.minY,
      repositoryPanelBounds.maxX, this.layoutBounds.maxY );

    this.addChild( new ArrowCueNode( makingTensExploreModel.arrowCueModel ) );

    makingTensExploreModel.interactionAttemptedProperty.link( function( interactionAttempted ) {
      if ( interactionAttempted ) {
        makingTensExploreModel.arrowCueModel.visible = true;
      }
    } );

    makingTensExploreModel.interactionSucceededProperty.link( function( interactionSucceeded ) {
      if ( interactionSucceeded ) {
        makingTensExploreModel.arrowCueModel.fadeAway();
      }
    } );

  }

  makingTens.register( 'MakingTensExploreScreenView', MakingTensExploreScreenView );

  return inherit( MakingTensCommonView, MakingTensExploreScreenView, {

    /**
     * Used to determine if the user has placed the picked number sufficiently away from
     * the container panel. if not return the number back to the container itself
     *
     * @param {PaperNumberModel} paperNumberModel
     * @param {Vector2} droppedPosition
     */
    canPlaceNumberAt: function( paperNumberModel, droppedPosition ) {
      var paperNumberDimension = paperNumberModel.getDimension();

      //  create a bounds using the dropped position and dimension of the paperNumber
      //  How far away the user has to drop the number varies with the size of the paper number
      var widthPart = paperNumberDimension.width * 0.3;
      var heightPart = paperNumberDimension.height * 0.3;
      var maxY = Math.min( droppedPosition.y, this.layoutBounds.maxY );
      var bounds2 = Bounds2.rect( droppedPosition.x, maxY, widthPart, heightPart );
      var intersects = this.returnZoneBounds.intersectsBounds( bounds2 );
      return !intersects;
    },

    /**
     * Intercept the addPaperNumber function and delegate it to the MakingTensCommonModel
     * This interception allows to hook functionality to see if the user leaves the Paper over the explorer carousel
     * in order to return them to the origin
     * @public
     * @param paperNumberModel
     */
    addPaperNumber: function( paperNumberModel ) {
      var thisNode = this;
      this.makingTensModel.addPaperNumber( paperNumberModel );

      // see if the user has dropped the paperNumber on Explorer panel, if yes return it to origin
      paperNumberModel.on( 'endDrag', function() {

        var panelBounds = thisNode.returnZoneBounds;
        var paperNumberDimension = paperNumberModel.getDimension(); // local
        var paperCenter = new Vector2( paperNumberModel.position.x + paperNumberDimension.width * 0.5,
          paperNumberModel.position.y + paperNumberDimension.height * 0.5 );

        if ( panelBounds.containsPoint( paperCenter ) ) {
          var baseNumbers = paperNumberModel.baseNumbers;

          //create as many number of papernumber nodes as the base numbers and animate each of them
          for ( var i = 0; i < baseNumbers.length; i++ ) {
            var digits = baseNumbers[ i ].digitLength;

            // We have reference to the explorer's digit collection, give that value as the initial
            // position based on the digit length
            var initialPos = thisNode.explorePanelPositions[ digits ];
            var paperNumberPart = new PaperNumberModel( baseNumbers[ i ].numberValue, initialPos );
            thisNode.makingTensModel.addPaperNumber( paperNumberPart );

            //Each part's position needs to offset from the currentPosition, so the split begins at the
            // right place
            paperNumberPart.position = paperNumberModel.position.plus( baseNumbers[ i ].position );
            paperNumberPart.returnToOrigin( true, MakingTensSharedConstants.ANIMATION_VELOCITY / 1.5 );// true is for animate and return
          }

          paperNumberModel.returnToOrigin();
        }

      } );
    }
  } );
} );