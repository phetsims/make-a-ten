// Copyright 2015, University of Colorado Boulder

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
  var Vector2 = require( 'DOT/Vector2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var MakingTensCommonView = require( 'MAKING_TENS/making-tens/common/view/MakingTensCommonView' );
  var SumEquationNode = require( 'MAKING_TENS/making-tens/common/view/SumEquationNode' );
  var PaperNumberModel = require( 'MAKING_TENS/making-tens/common/model/PaperNumberModel' );
  var MakingTensExplorerNode = require( 'MAKING_TENS/making-tens/explore/view/MakingTensExplorerNode' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var CheckBox = require( 'SUN/CheckBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // strings
  var hideTotalString = require( 'string!MAKING_TENS/making-tens.hide.total' );

  // These offsets are with respect to ViewPort Bounds not layout bounds
  // this is done to make sure the sumEquationNode is always at top left even after window resize and scale
  var sumNodeOffSetX = 30;
  var sumNodeOffSetY = 30;
  var TOUCH_AREA_EXPAND_X = 10;
  var TOUCH_AREA_EXPAND_Y = 4;

  /**
   * @param {MakingTensExploreModel} makingTensExploreModel
   * @constructor
   */
  function MakingTensExploreScreenView( makingTensExploreModel ) {
    var self = this;
    var paperNumberNodeLayer = new Node();
    MakingTensCommonView.call( this, makingTensExploreModel, MakingTensSharedConstants.LAYOUT_BOUNDS, paperNumberNodeLayer,
      self.addUserCreatedNumberModelToExplorerView.bind( self ) );

    var sumEquationNode = new SumEquationNode( makingTensExploreModel.sumProperty, MakingTensSharedConstants.EXPLORER_SCREEN_BACKGROUND_COLOR );
    self.addChild( sumEquationNode );

    // shape carousel
    this.shapeContainerCarousel = new Node();
    self.addChild( this.shapeContainerCarousel );
    self.addChild( paperNumberNodeLayer );

    var explorerNodes = [];
    // Create the composite nodes that contain the number collections
    var exploreHundredsNode = new MakingTensExplorerNode( 100, self.addUserCreatedNumberModelToExplorerView.bind( self ),
      self.combineNumbersIfApplicableCallback, self.canPlaceShape.bind( self ), self );
    explorerNodes.push( exploreHundredsNode );
    var exploreTensNode = new MakingTensExplorerNode( 10, self.addUserCreatedNumberModelToExplorerView.bind( self ),
      self.combineNumbersIfApplicableCallback, self.canPlaceShape.bind( self ), self );
    explorerNodes.push( exploreTensNode );
    var exploreOnesNode = new MakingTensExplorerNode( 1,
      self.addUserCreatedNumberModelToExplorerView.bind( self ),
      self.combineNumbersIfApplicableCallback, self.canPlaceShape.bind( self ), self );
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

    var carouselContainerStartPos = this.shapeContainerCarousel.leftTop.plus(
      new Vector2( this.shapeContainerCarousel.xMargin, this.shapeContainerCarousel.yMargin ) );

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

    var sumTextNode = new Text( hideTotalString, {
      font: new PhetFont(
        {
          size: 25,
          weight: 'bold'
        } ),
      fill: 'black'
    } );

    var showSumCheckBox = new CheckBox( sumTextNode, makingTensExploreModel.hideTotalProperty, {
      spacing: 10,
      boxWidth: 30
    } );
    this.addChild( showSumCheckBox );

    showSumCheckBox.right = this.layoutBounds.maxX - 110;
    showSumCheckBox.bottom = this.layoutBounds.maxY - 20;

    showSumCheckBox.touchArea = showSumCheckBox.
      localBounds.dilatedXY( TOUCH_AREA_EXPAND_X, TOUCH_AREA_EXPAND_Y );

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

    this.availableViewBoundsProperty.lazyLink( function( newBounds ) {
      sumEquationNode.left = newBounds.minX + sumNodeOffSetX;
      sumEquationNode.top = newBounds.minY + sumNodeOffSetY;
    } );

    var shareContainerBounds = this.shapeContainerCarousel.bounds;
    this.returnZoneBounds = new Bounds2( shareContainerBounds.minX, shareContainerBounds.minY,
      shareContainerBounds.maxX, this.layoutBounds.maxY );
  }

  return inherit( MakingTensCommonView, MakingTensExploreScreenView, {

    /**
     *
     * @param {PaperNumberModel} paperNumberModel
     * @param {Vector2} droppedPosition
     */
    canPlaceShape: function( paperNumberModel, droppedPosition ) {

      var paperNumberBounds = paperNumberModel.getBounds();
      var widthPart = paperNumberBounds.width * 0.3;
      var heightPart = paperNumberBounds.height * 0.3;
      var maxY = Math.min( droppedPosition.y, this.layoutBounds.maxY );
      var bounds2 = Bounds2.rect( droppedPosition.x, maxY, widthPart, heightPart );
      var intersects = this.returnZoneBounds.intersectsBounds( bounds2 );
      return !intersects;
    },

    /**
     * Intercept the addUserCreatedNumber function and delegate it to the MakingTensCommonModel
     * This interception allows to hook functionality to see if the user leaves the Paper over the explorer carousel
     * in order to return them to the origin
     * @public
     * @param paperNumberModel
     */
    addUserCreatedNumberModelToExplorerView: function( paperNumberModel ) {
      var thisNode = this;
      this.makingTensModel.addUserCreatedNumberModel( paperNumberModel );

      // see if the user has dropped the paperNumber on Explorer panel, if yes return it to origin
      paperNumberModel.on( 'endDrag', function() {

        var panelBounds = thisNode.returnZoneBounds;
        var paperNumberBounds = paperNumberModel.getBounds(); // local
        var paperCenter = new Vector2( paperNumberModel.position.x + paperNumberBounds.width * 0.5,
          paperNumberModel.position.y + paperNumberBounds.height * 0.5 );

        if ( panelBounds.containsPoint( paperCenter ) ) {
          var baseNumbers = paperNumberModel.baseNumbers;
          var baseNumberPositions = paperNumberModel.baseNumberPositions;

          //create as many number of papernumber nodes as the base numbers and animate each of them
          for ( var i = 0; i < baseNumbers.length; i++ ) {
            var digits = (baseNumbers[ i ] + '').length;

            // We have reference to the explorer's digit collection, give that value as the initial
            // position based on the digit length
            var initialPos = thisNode.explorePanelPositions[ digits ];
            var paperNumberPart = new PaperNumberModel( baseNumbers[ i ], initialPos );
            thisNode.makingTensModel.addUserCreatedNumberModel( paperNumberPart );

            //Each part's position needs to offset from the currentPosition, so the split begins at the
            // right place
            paperNumberPart.position = paperNumberModel.position.plus( baseNumberPositions[ i ] );
            paperNumberPart.returnToOrigin( true, MakingTensSharedConstants.ANIMATION_VELOCITY / 1.5 );// true is for animate and return
          }

          paperNumberModel.returnToOrigin();
        }
      } );

    }

  } );
} );