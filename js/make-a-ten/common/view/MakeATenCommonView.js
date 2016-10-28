// Copyright 2015, University of Colorado Boulder

/**
 * Common ScreenView for Make a Ten screens.
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Property = require( 'AXON/Property' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PaperNumberNode = require( 'MAKE_A_TEN/make-a-ten/common/view/PaperNumberNode' );
  var ArithmeticRules = require( 'MAKE_A_TEN/make-a-ten/common/model/ArithmeticRules' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );

  /**
   * @constructor
   *
   * @param {MakeATenModel} model
   */
  function MakeATenCommonView( model ) {
    var self = this;

    ScreenView.call( this, { layoutBounds: MakeATenConstants.LAYOUT_BOUNDS } );

    // @public {MakeATenModel}
    this.model = model;

    // @protected {Node} - Where all of the paper numbers are. NOTE: Subtypes need to add this as a child with the
    //                     proper place in layering (this common view doesn't do that).
    this.paperNumberLayerNode = new Node();

    // @private {Function}
    this.tryToCombineNumbersCallback = this.tryToCombineNumbers.bind( this );

    // @private {Function}
    this.addAndDragNumberCallback = this.addAndDragNumber.bind( this );

    // @private {number} PaperNumber.id => {PaperNumberNode} - lookup map for efficiency
    this.paperNumberNodeMap = {};

    // @public {Property.<Bounds2>} - The view coordinates where numbers can be dragged. Can update when the sim
    //                                is resized.
    this.availableViewBoundsProperty = new Property( MakeATenConstants.LAYOUT_BOUNDS );

    var paperNumberAddedListener = this.onPaperNumberAdded.bind( this );
    var paperNumberRemovedListener = this.onPaperNumberRemoved.bind( this );

    // Add nodes for every already-existing paper number
    model.paperNumbers.forEach( paperNumberAddedListener );

    // Add and remove nodes to match the model
    model.paperNumbers.addItemAddedListener( paperNumberAddedListener );
    model.paperNumbers.addItemRemovedListener( paperNumberRemovedListener );

    this.availableViewBoundsProperty.lazyLink( function( availableViewBounds ) {
      model.paperNumbers.forEach( function( paperNumber ) {
        paperNumber.setConstrainedDestination( availableViewBounds, paperNumber.positionProperty.value );
      } );
    } );

    // @protected {ResetAllButton}
    this.resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        self.reset();
      }
    } );
    this.addChild( this.resetAllButton );
  }

  makeATen.register( 'MakeATenCommonView', MakeATenCommonView );

  return inherit( ScreenView, MakeATenCommonView, {

    /**
     * Add a paper number to the model and immediately start dragging it with the provided event.
     * @public
     *
     * @param {Event} event - The Scenery event that triggered this.
     * @param {PaperNumber} paperNumber - The paper number to add and then drag
     */
    addAndDragNumber: function( event, paperNumber ) {
      // Add it and lookup the related node.
      this.model.addPaperNumber( paperNumber );

      var paperNumberNode = this.findPaperNumberNode( paperNumber );
      paperNumberNode.startSyntheticDrag( event );
    },

    /**
     * Creates and adds a PaperNumberNode.
     * @public
     *
     * @param {PaperNumber} paperNumber
     * @returns {PaperNumberNode} - The created node
     */
    onPaperNumberAdded: function( paperNumber ) {
      var paperNumberNode = new PaperNumberNode( paperNumber, this.availableViewBoundsProperty,
                                                 this.addAndDragNumberCallback, this.tryToCombineNumbersCallback );

      this.paperNumberNodeMap[ paperNumberNode.paperNumber.id ] = paperNumberNode;
      this.paperNumberLayerNode.addChild( paperNumberNode );
      paperNumberNode.attachListeners();

      return paperNumberNode;
    },

    /**
     * Handles removing the relevant PaperNumberNode
     * @public
     *
     * @param {PaperNumber} paperNumber
     */
    onPaperNumberRemoved: function( paperNumber ) {
      var paperNumberNode = this.findPaperNumberNode( paperNumber );

      delete this.paperNumberNodeMap[ paperNumberNode.paperNumber.id ];
      this.paperNumberLayerNode.removeChild( paperNumberNode );
      paperNumberNode.detachListeners();
    },

    /**
     * Given a {PaperNumber}, find our current display ({PaperNumberNode}) of it.
     * @public
     *
     * @param {PaperNumber} paperNumber
     * @returns {PaperNumberNode}
     */
    findPaperNumberNode: function( paperNumber ) {
      var result = this.paperNumberNodeMap[ paperNumber.id ];
      assert && assert( result, 'Did not find matching Node' );
      return result;
    },

    /**
     * When user drops a node on another node , add if the arthimetic rules match
     * @param {PaperNumber} draggedPaperNumber
     */
    tryToCombineNumbers: function( draggedPaperNumber ) {
      var draggedNode = this.findPaperNumberNode( draggedPaperNumber );
      var allPaperNumberNodes = this.paperNumberLayerNode.children;
      var droppedNodes = draggedNode.findAttachableNodes( allPaperNumberNodes );

      //check them in reverse order (the one on the top should get more priority)
      droppedNodes.reverse();

      for ( var i = 0; i < droppedNodes.length; i++ ) {
        var numberA = draggedPaperNumber.numberValueProperty.value;
        var numberB = droppedNodes[ i ].paperNumber.numberValueProperty.value;
        if ( ArithmeticRules.canAddNumbers( numberA, numberB ) ) {
          var droppedPaperNumber = droppedNodes[ i ].paperNumber;
          // TODO: some assumption was made here that seems bad, hard to add single digits
          this.model.collapseNumberModels( draggedPaperNumber, droppedPaperNumber );
          return;
        }
        else {

          // repel numbers - show rejection
          var paperNumber1 = draggedNode.paperNumber;
          var paperNumber2 = droppedNodes[ i ].paperNumber;
          this.model.repelAway( this.availableViewBoundsProperty.value, paperNumber1, paperNumber2 );
          return;
        }
      }

      // if the dragged number is  larger than the the node below it (dropped node), reorder
      // them in a way to bring small number on the top. see issue #39
      for ( i = 0; i < allPaperNumberNodes.length; i++ ) {
        if ( allPaperNumberNodes[ i ] === draggedNode ) {
          continue;
        }

        if ( allPaperNumberNodes[ i ].bounds.intersectsBounds( draggedNode.bounds ) ) {
          if ( draggedNode.bounds.width > allPaperNumberNodes[ i ].bounds.width ) {
            allPaperNumberNodes[ i ].moveToFront();
          }
        }

      }
    },

    /**
     * Meant for subtypes to override to do additional component layout. Can't override layout(), as it takes additional
     * parameters that we may not have access to.
     * @protected
     */
    layoutControls: function() {
      this.resetAllButton.right = this.visibleBoundsProperty.value.right - 10;
      this.resetAllButton.bottom = this.visibleBoundsProperty.value.bottom - 10;
    },

    /**
     * Some views may need to constrain the vertical room at the top (for dragging numbers) due to a status bar.
     * This should be overridden to return the value required.
     * @public
     *
     * @returns {number} - Amount in view coordinates to leave at the top of the screen
     */
    getTopBoundsOffset: function() {
      return 0;
    },

    /**
     * @override
     */
    layout: function( width, height ) {
      ScreenView.prototype.layout.call( this, width, height );

      // Some views may need to make extra room for a status bar
      var top = this.visibleBoundsProperty.value.minY + this.getTopBoundsOffset();
      this.availableViewBoundsProperty.value = this.visibleBoundsProperty.value.withMinY( top );

      this.layoutControls();
    },

    /**
     * To reset the view, should be overridden
     * @public
     */
    reset: function() {

    }
  } );
} );