// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Panel = require( 'SUN/Panel' );
  var Vector2 = require( 'DOT/Vector2' );
  var MakeATenCommonView = require( 'MAKE_A_TEN/make-a-ten/common/view/MakeATenCommonView' );
  var PaperNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/PaperNumber' );
  var MakeATenExplorerNode = require( 'MAKE_A_TEN/make-a-ten/explore/view/MakeATenExplorerNode' );
  var ArrowCueNode = require( 'MAKE_A_TEN/make-a-ten/explore/view/ArrowCueNode' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var CheckBox = require( 'SUN/CheckBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // strings
  var makeATenHideTotalString = require( 'string!MAKE_A_TEN/make-a-ten.hide.total' );

  // These offsets are with respect to ViewPort Bounds not layout bounds
  // this is done to make sure the sumEquationNode is always at top left even after window resize and scale
  var SUM_NODE_OFFSET_X = 30;
  var SUM_NODE_OFFSET_Y = 30;
  var EQUATION_FONT = new PhetFont( { size: 60, weight: 'bold' } );
  var EQUATION_COLOR = 'rgb(63,63,183)';

  /**
   * @param {MakeATenExploreModel} makeATenExploreModel
   * @constructor
   */
  function MakeATenExploreScreenView( makeATenExploreModel ) {
    var self = this;

    var addPaperNumberCallback = this.addPaperNumber.bind( this );
    var canPlaceNumberCallback = this.canPlaceNumberAt.bind( this );

    MakeATenCommonView.call( this, makeATenExploreModel, addPaperNumberCallback );

    // @public {BooleanProperty} - Whether the total (sum) is hidden
    this.hideTotalProperty = new BooleanProperty( false );

    var sumText = new Text( '0', { font: EQUATION_FONT, fill: EQUATION_COLOR } );
    var equalsSignNode = new Text( '=', { font: EQUATION_FONT, fill: EQUATION_COLOR } );

    var spaceBetweenSumAndEquals = 15; // spacing between equation elements
    // Perform the layout by placing everything in an HBox.
    this.equationHBox = new HBox( {
      children: [
        sumText,
        equalsSignNode
      ], spacing: spaceBetweenSumAndEquals
    } );

    makeATenExploreModel.sumProperty.linkAttribute( sumText, 'text' );
    this.addChild( this.equationHBox );

    var explorerNodes = [];
    // Create the composite nodes that contain the number collections
    var exploreHundredsNode = new MakeATenExplorerNode( 100, addPaperNumberCallback,
      this.tryToCombineNumbers, canPlaceNumberCallback, this );
    explorerNodes.push( exploreHundredsNode );
    var exploreTensNode = new MakeATenExplorerNode( 10, addPaperNumberCallback,
      this.tryToCombineNumbers, canPlaceNumberCallback, this );
    explorerNodes.push( exploreTensNode );
    var exploreOnesNode = new MakeATenExplorerNode( 1,
      addPaperNumberCallback,
      this.tryToCombineNumbers, canPlaceNumberCallback, this );
    explorerNodes.push( exploreOnesNode );

    // Add a non-scrolling panel
    var creatorNodeHBox = new HBox( { children: explorerNodes, spacing: 30 } );

    // PaperNumber ContainerPanel
    this.paperNumbersContainerPanel = new Panel( creatorNodeHBox, {
      fill: MakeATenConstants.PAPER_NUMBER_REPO_PANEL_BACKGROUND_COLOR,
      stroke: 'black',
      lineWidth: 1.5,
      bottom: this.layoutBounds.bottom - 15,
      centerX: (this.layoutBounds.width / 2) - 12,
      xMargin: 30,
      yMargin: 5,
      resize: false

    } );

    this.addChild( this.paperNumbersContainerPanel );
    this.addChild( this.paperNumberLayerNode );


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

    var hideTotalText = new Text( makeATenHideTotalString, {
      font: new PhetFont( {
        size: 25,
        weight: 'bold'
      } ),
      fill: 'black'
    } );

    this.hideTotalCheckBox = new CheckBox( hideTotalText, this.hideTotalProperty, {
      spacing: 10,
      boxWidth: 30
    } );
    this.addChild( this.hideTotalCheckBox );

    this.hideTotalCheckBox.right = this.layoutBounds.right - 110;
    this.hideTotalCheckBox.bottom = this.layoutBounds.bottom - 20;

    this.hideTotalCheckBox.touchArea = this.hideTotalCheckBox.localBounds.dilatedXY( 10, 4 );

    this.hideTotalProperty.link( function( hideTotal ) {
      self.equationHBox.visible = !hideTotal;
    } );

    var repositoryPanelBounds = this.paperNumbersContainerPanel.bounds;
    this.returnZoneBounds = repositoryPanelBounds.withMaxY( this.layoutBounds.bottom );

    this.addChild( new ArrowCueNode( makeATenExploreModel.arrowCue ) );

    this.interactionAttemptedProperty.link( function( interactionAttempted ) {
      if ( interactionAttempted ) {
        makeATenExploreModel.arrowCue.visible = true;
      }
    } );

    this.interactionSucceededProperty.link( function( interactionSucceeded ) {
      if ( interactionSucceeded ) {
        makeATenExploreModel.arrowCue.fadeAway();
      }
    } );

    this.layoutControls();
  }

  makeATen.register( 'MakeATenExploreScreenView', MakeATenExploreScreenView );

  return inherit( MakeATenCommonView, MakeATenExploreScreenView, {
    /**
     * @override
     */
    layoutControls: function() {
      MakeATenCommonView.prototype.layoutControls.call( this );

      var visibleBounds = this.visibleBoundsProperty.value;

      this.paperNumbersContainerPanel.centerX = visibleBounds.centerX;
      this.paperNumbersContainerPanel.bottom = visibleBounds.bottom - 10;

      this.hideTotalCheckBox.left = this.paperNumbersContainerPanel.right + 20;
      this.hideTotalCheckBox.bottom = visibleBounds.bottom - 10;

      this.equationHBox.left = visibleBounds.left + SUM_NODE_OFFSET_X;
      this.equationHBox.top = visibleBounds.top + SUM_NODE_OFFSET_Y;
    },

    /**
     * Used to determine if the user has placed the picked number sufficiently away from
     * the container panel. if not return the number back to the container itself
     *
     * @param {PaperNumber} paperNumber
     * @param {Vector2} droppedPosition
     */
    canPlaceNumberAt: function( paperNumber, droppedPosition ) {
      var paperNumberDimension = paperNumber.getDimension();

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
     * @override
     * Intercept the addPaperNumber function and delegate it to the MakeATenCommonModel
     * This interception allows to hook functionality to see if the user leaves the Paper over the explorer carousel
     * in order to return them to the origin
     * @public
     * @param paperNumber
     */
    addPaperNumber: function( paperNumber ) {
      var self = this;

      MakeATenCommonView.prototype.addPaperNumber.call( this, paperNumber );

      // TODO: surely there are better ways of doing this
      // see if the user has dropped the paperNumber on Explorer panel, if yes return it to origin
      paperNumber.endDragEmitter.addListener( function() {

        var panelBounds = self.returnZoneBounds;
        var paperNumberDimension = paperNumber.getDimension(); // local
        var paperCenter = new Vector2( paperNumber.positionProperty.value.x + paperNumberDimension.width * 0.5,
          paperNumber.positionProperty.value.y + paperNumberDimension.height * 0.5 );

        if ( panelBounds.containsPoint( paperCenter ) ) {
          var baseNumbers = paperNumber.baseNumbers;

          //create as many number of papernumber nodes as the base numbers and animate each of them
          for ( var i = 0; i < baseNumbers.length; i++ ) {
            var digits = baseNumbers[ i ].digitLength;

            // We have reference to the explorer's digit collection, give that value as the initial
            // position based on the digit length
            var initialPos = self.explorePanelPositions[ digits ];
            var paperNumberPart = new PaperNumber( baseNumbers[ i ].numberValue, initialPos );
            self.makeATenModel.addPaperNumber( paperNumberPart );

            //Each part's position needs to offset from the currentPosition, so the split begins at the
            // right place
            paperNumberPart.positionProperty.value = paperNumber.positionProperty.value.plus( baseNumbers[ i ].offset );
            paperNumberPart.returnToOrigin( true, MakeATenConstants.ANIMATION_VELOCITY / 1.5 );// true is for animate and return
          }

          paperNumber.returnToOrigin( false );
        }

      } );
    },

    /**
     * @override
     */
    reset: function() {
      MakeATenCommonView.prototype.reset.call( this );

      this.hideTotalProperty.reset();
    }
  } );
} );