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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var CheckBox = require( 'SUN/CheckBox' );
  var MakeATenCommonView = require( 'MAKE_A_TEN/make-a-ten/common/view/MakeATenCommonView' );
  var PaperNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/PaperNumber' );
  var ExplorePanel = require( 'MAKE_A_TEN/make-a-ten/explore/view/ExplorePanel' );
  var MoveCueNode = require( 'MAKE_A_TEN/make-a-ten/explore/view/MoveCueNode' );
  var SplitCueNode = require( 'MAKE_A_TEN/make-a-ten/explore/view/SplitCueNode' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );

  // strings
  var makeATenHideTotalString = require( 'string!MAKE_A_TEN/make-a-ten.hide.total' );

  // constants
  var EQUATION_FONT = new PhetFont( { size: 60, weight: 'bold' } );

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

    // @private {BooleanProperty} - Whether the total (sum) is hidden
    this.hideSumProperty = new BooleanProperty( false );

    var sumText = new Text( '0', { font: EQUATION_FONT, fill: MakeATenConstants.EQUATION_FILL } );
    model.sumProperty.linkAttribute( sumText, 'text' );

    // @private {HBox} - Displays the sum of our numbers and an equals sign, e.g. "256 ="
    this.sumNode = new HBox( {
      children: [
        sumText,
        new Text( '=', { font: EQUATION_FONT, fill: MakeATenConstants.EQUATION_FILL } )
      ], spacing: 15
    } );

    this.addChild( this.sumNode );

    // @private {ExplorePanel} - Shows 100,10,1 that can be dragged.
    this.explorePanel = new ExplorePanel( this );
    this.addChild( this.explorePanel );

    this.addChild( this.paperNumberLayerNode );

    this.addChild( new MoveCueNode( model.moveCue ) );
    this.addChild( new SplitCueNode( model.splitCue ) );

    var hideSumText = new Text( makeATenHideTotalString, {
      font: new PhetFont( {
        size: 25,
        weight: 'bold'
      } ),
      fill: 'black'
    } );

    // @private {CheckBox} - When checked, hides the sum in the upper-left
    this.hideSumCheckBox = new CheckBox( hideSumText, this.hideSumProperty, {
      spacing: 10,
      boxWidth: 30
    } );
    this.hideSumCheckBox.touchArea = this.hideSumCheckBox.localBounds.dilatedXY( 10, 4 );
    this.addChild( this.hideSumCheckBox );

    this.hideSumProperty.link( function( hideSum ) {
      self.sumNode.visible = !hideSum;
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

      this.hideSumCheckBox.left = this.explorePanel.right + 20;
      this.hideSumCheckBox.bottom = visibleBounds.bottom - 10;

      this.sumNode.left = visibleBounds.left + 30;
      this.sumNode.top = visibleBounds.top + 30;
    },

    /**
     * Whether the paper number is predominantly over the explore panel (should be collected).
     * @private
     *
     * @param {PaperNumber} paperNumber
     * @returns {boolean}
     */
    isNumberInReturnZone: function( paperNumber ) {
      // Compute the local point on the number that would need to go into the return zone.
      // This point is a bit farther down than the exact center, as it was annoying to "miss" the return zone
      // slightly by being too high (while the mouse WAS in the return zone).
      var localBounds = paperNumber.getLocalBounds();
      var localReturnPoint = localBounds.center.plus( localBounds.centerBottom ).dividedScalar( 2 );

      // And the bounds of our panel
      var panelBounds = this.explorePanel.bounds.withMaxY( this.visibleBoundsProperty.value.bottom );

      // View coordinate of our return point
      var paperCenter = paperNumber.positionProperty.value.plus( localReturnPoint );

      return panelBounds.containsPoint( paperCenter );
    },

    /**
     * @override
     */
    addPaperNumberNode: function( paperNumberNode ) {
      MakeATenCommonView.prototype.addPaperNumberNode.call( this, paperNumberNode );

      // Add listeners
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
      // Remove listeners
      paperNumberNode.paperNumber.endDragEmitter.removeListener( this.numberDragFinishedListener );
      paperNumberNode.paperNumber.endAnimationEmitter.removeListener( this.numberAnimationFinishedListener );
      paperNumberNode.interactionStartedEmitter.removeListener( this.numberInteractionListener );
      paperNumberNode.splitEmitter.removeListener( this.numberSplitListener );
      paperNumberNode.moveEmitter.removeListener( this.numberMoveListener );

      // Detach any attached cues
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

      this.hideSumProperty.reset();
    }
  } );
} );
