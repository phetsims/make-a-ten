// Copyright 2015, University of Colorado Boulder

/**
 * Explore screenview of Make a Ten. Provides a panel where 100s, 10s or 1s can be dragged out, combined, and pulled
 * apart, and displays the total in the upper-left.
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Vector2 = require( 'DOT/Vector2' );
  var MakeATenCommonView = require( 'MAKE_A_TEN/make-a-ten/common/view/MakeATenCommonView' );
  var PaperNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/PaperNumber' );
  var ExplorePanel = require( 'MAKE_A_TEN/make-a-ten/explore/view/ExplorePanel' );
  var MoveCueNode = require( 'MAKE_A_TEN/make-a-ten/explore/view/MoveCueNode' );
  var SplitCueNode = require( 'MAKE_A_TEN/make-a-ten/explore/view/SplitCueNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var CheckBox = require( 'SUN/CheckBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var makeATenHideTotalString = require( 'string!MAKE_A_TEN/make-a-ten.hide.total' );

  // constants
  var EQUATION_FONT = new PhetFont( { size: 60, weight: 'bold' } );
  var EQUATION_COLOR = 'rgb(63,63,183)';

  /**
   * @param {MakeATenExploreModel} model
   * @constructor
   */
  function MakeATenExploreScreenView( model ) {
    var self = this;

    // @private {Function} - Called with function( paperNumberNode ) on number moves
    this.numberMoveListener = this.onNumberMove.bind( this );

    // @private {Function} - Called with function( paperNumberNode ) on number splits
    this.numberSplitListener = this.onNumberSplit.bind( this );

    // @private {Function} - Called with function( paperNumberNode ) when a number begins to be interacted with.
    this.numberInteractionListener = this.onNumberInteractionStarted.bind( this );

    // @private {Function} - Called with function( paperNumber ) when a number finishes animation
    this.numberAnimationFinishedListener = this.onNumberAnimationFinished.bind( this );

    // @private {Function} - Called with function( paperNumber ) when a number finishes being dragged
    this.numberDragFinishedListener = this.onNumberDragFinished.bind( this );

    MakeATenCommonView.call( this, model );

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

    model.sumProperty.linkAttribute( sumText, 'text' );

    this.addChild( this.equationHBox );

    this.explorePanel = new ExplorePanel( this );
    this.addChild( this.explorePanel );

    this.addChild( this.paperNumberLayerNode );

    this.addChild( new MoveCueNode( model.moveCue ) );
    this.addChild( new SplitCueNode( model.splitCue ) );

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

      this.explorePanel.centerX = visibleBounds.centerX;
      this.explorePanel.bottom = visibleBounds.bottom - 10;

      this.hideTotalCheckBox.left = this.explorePanel.right + 20;
      this.hideTotalCheckBox.bottom = visibleBounds.bottom - 10;

      this.equationHBox.left = visibleBounds.left + 30;
      this.equationHBox.top = visibleBounds.top + 30;
    },

    /**
     * Whether the paper number is predominantly over the explore panel (should be collected).
     * @private
     *
     * @param {PaperNumber} paperNumber
     * @returns {boolean}
     */
    isNumberInReturnZone: function( paperNumber ) {
      var panelBounds = this.explorePanel.bounds.withMaxY( this.visibleBoundsProperty.value.bottom );
      var paperCenter = paperNumber.positionProperty.value.plus( paperNumber.getLocalBounds().center );

      return panelBounds.containsPoint( paperCenter );
    },

    /**
     * @override
     */
    addPaperNumberNode: function( paperNumberNode ) {
      MakeATenCommonView.prototype.addPaperNumberNode.call( this, paperNumberNode );

      paperNumberNode.moveEmitter.addListener( this.numberMoveListener );
      paperNumberNode.splitEmitter.addListener( this.numberSplitListener );
      paperNumberNode.interactionStartedEmitter.addListener( this.numberInteractionListener );
      paperNumberNode.paperNumber.endAnimationEmitter.addListener( this.numberAnimationFinishedListener );
      paperNumberNode.paperNumber.endDragEmitter.addListener( this.numberDragFinishedListener );
    },

    /**
     * @override
     */
    removePaperNumberNode: function( paperNumberNode ) {
      paperNumberNode.paperNumber.endDragEmitter.removeListener( this.numberDragFinishedListener );
      paperNumberNode.paperNumber.endAnimationEmitter.removeListener( this.numberAnimationFinishedListener );
      paperNumberNode.interactionStartedEmitter.removeListener( this.numberInteractionListener );
      paperNumberNode.splitEmitter.removeListener( this.numberSplitListener );
      paperNumberNode.moveEmitter.removeListener( this.numberMoveListener );

      if ( this.model.moveCue.paperNumberProperty.value === paperNumberNode.paperNumber ) {
        this.model.moveCue.detach();
      }

      if ( this.model.splitCue.paperNumberProperty.value === paperNumberNode.paperNumber ) {
        this.model.splitCue.detach();
      }

      MakeATenCommonView.prototype.removePaperNumberNode.call( this, paperNumberNode );
    },

    /**
     * Called when a paper number node drag starts.
     * @private
     *
     * @param {PaperNumberNode} paperNumberNode
     */
    onNumberMove: function( paperNumberNode ) {
      this.model.moveCue.triggerFade();
    },

    /**
     * Called when a paper number node is split.
     * @private
     *
     * @param {PaperNumberNode} paperNumberNode
     */
    onNumberSplit: function( paperNumberNode ) {
      this.model.splitCue.triggerFade();
    },

    /**
     * Called when a paper number node starts being interacted with.
     * @private
     *
     * @param {PaperNumberNode} paperNumberNode
     */
    onNumberInteractionStarted: function( paperNumberNode ) {
      var paperNumber = paperNumberNode.paperNumber;
      this.model.moveCue.attachToNumber( paperNumber );
      if ( paperNumber.numberValueProperty.value > 1 ) {
        this.model.splitCue.attachToNumber( paperNumber );
      }
    },

    /**
     * Called when a paper number has finished animating to its destination.
     * @private
     *
     * @param {PaperNumber} paperNumber
     */
    onNumberAnimationFinished: function( paperNumber ) {
      // If it animated to the return zone, it's probably split and meant to be returned.
      if ( this.isNumberInReturnZone( paperNumber ) ) {
        this.model.removePaperNumber( paperNumber );
      }
    },

    /**
     * Called when a paper number has finished being dragged.
     * @private
     *
     * @param {PaperNumber} paperNumber
     */
    onNumberDragFinished: function( paperNumber ) {
      // Return it to the panel if it's been dropped in the panel.
      if ( this.isNumberInReturnZone( paperNumber ) ) {
        var baseNumbers = paperNumber.baseNumbers;

        // Split it into a PaperNumber for each of its base numbers, and animate them to their targets in the
        // explore panel.
        for ( var i = baseNumbers.length - 1; i >= 0; i-- ) {
          var baseNumber = baseNumbers[ i ];
          var basePaperNumber = new PaperNumber( baseNumber.numberValue, paperNumber.positionProperty.value );

          // Set its destination to the proper target (with the offset so that it will disappear once centered).
          var targetPosition = this.explorePanel.getOriginLocation( baseNumber.digitLength );
          var paperCenterOffset = new PaperNumber( baseNumber.numberValue, new Vector2() ).getLocalBounds().center;
          targetPosition = targetPosition.minus( paperCenterOffset );
          basePaperNumber.setDestination( targetPosition, true );

          // Add the new base paper number
          this.model.addPaperNumber( basePaperNumber );
        }

        // Remove the original paper number (as we have added its components).
        this.model.removePaperNumber( paperNumber );
      }
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