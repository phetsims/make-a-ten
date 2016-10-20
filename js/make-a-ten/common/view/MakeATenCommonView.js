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
  var arrayRemove = require( 'PHET_CORE/arrayRemove' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var DotRectangle = require( 'DOT/Rectangle' ); // eslint-disable-line require-statement-match
  var Property = require( 'AXON/Property' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PaperNumberNode = require( 'MAKE_A_TEN/make-a-ten/common/view/PaperNumberNode' );
  var ArithmeticRules = require( 'MAKE_A_TEN/make-a-ten/common/model/ArithmeticRules' );
  var MakeATenSharedConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenSharedConstants' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );

  /**
   * @constructor
   *
   * @param {MakeATenModel} makeATenModel
   * @param {Function} [addPaperNumber] - callback
   */
  function MakeATenCommonView( makeATenModel, addPaperNumber ) {
    var self = this;
    ScreenView.call( this, { layoutBounds: MakeATenSharedConstants.LAYOUT_BOUNDS } );
    this.makeATenModel = makeATenModel;

    this.paperNumberLayerNode = new Node();

    this.addPaperNumber = addPaperNumber || makeATenModel.addPaperNumber.bind( makeATenModel );
    this.tryToCombineNumbers = this.tryToCombineNumbers.bind( this );

    this.paperNumberNodes = []; // @private {Array.<PaperNumberNode>} - All PaperNumberNodes available
    this.paperNumberNodeMap = {}; // @private {number} PaperNumber.id => {PaperNumberNode} - lookup map for efficiency

    function handlePaperNumberAdded( addedNumberModel ) {
      var paperNumberNode = new PaperNumberNode( addedNumberModel, self.availableViewBoundsProperty, self.addPaperNumber, self.tryToCombineNumbers );
      self.addPaperNumberNode( paperNumberNode );
    }

    makeATenModel.paperNumbers.addItemRemovedListener( function removalListener( removedNumberModel ) {
      self.removePaperNumberNode( self.findPaperNumberNode( removedNumberModel ) );
    } );

    //Initial Number Node creation
    makeATenModel.paperNumbers.forEach( handlePaperNumberAdded );

    // Observe new items
    makeATenModel.paperNumbers.addItemAddedListener( handlePaperNumberAdded );

    // used to prevent numbers from moving outside the visible model bounds when dragged
    this.availableViewBoundsProperty = new Property( null );// filled by layout method

    this.availableViewBoundsProperty.lazyLink( function( newBounds ) {
      makeATenModel.paperNumbers.forEach( function( numberModel ) {
        numberModel.constrainPosition( newBounds, numberModel.position );
      } );
    } );

    this.availableViewBoundsProperty.linkAttribute( makeATenModel, 'viewPortBounds' );

    // Create and add the Reset All Button in the bottom right, which resets the model
    this.resetAllButton = new ResetAllButton( {
      listener: function() {
        makeATenModel.reset();
      },
      right: this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10
    } );
    this.addChild( this.resetAllButton );
  }

  makeATen.register( 'MakeATenCommonView', MakeATenCommonView );

  return inherit( ScreenView, MakeATenCommonView, {

    /**
     * @override
     * @param {number} dt
     */
    step: function( st ) {

      // if objects overlap  each other, both should'nt be a full solid,
      // the object hovering over should have some transparency -> issue #69
      var allPaperNumberNodes = this.paperNumberNodes;

      //reset the default opacity
      for ( var i = 0; i < allPaperNumberNodes.length; i++ ) {
        allPaperNumberNodes[ i ].paperNumber.resetOpacity();
      }

      for ( i = 0; i < allPaperNumberNodes.length; i++ ) {
        for ( var j = 0; j < allPaperNumberNodes.length; j++ ) {

          var paperNumberNode1 = allPaperNumberNodes[ i ];
          var paperNumberNode2 = allPaperNumberNodes[ j ];

          if ( paperNumberNode1 === paperNumberNode2 ) {
            continue;
          }

          if ( paperNumberNode1.getBounds().intersectsBounds( paperNumberNode2.getBounds() ) ) {

            var displayOrder1 = allPaperNumberNodes.indexOf( paperNumberNode1 );
            var displayOrder2 = allPaperNumberNodes.indexOf( paperNumberNode2 );

            //the node, that hovers over other, should have minimum opacity
            if ( displayOrder1 > displayOrder2 ) {
              paperNumberNode1.paperNumber.opacity = MakeATenSharedConstants.HOVER_OPACITY;
            }
            else {
              paperNumberNode2.paperNumber.opacity = MakeATenSharedConstants.HOVER_OPACITY;
            }
          }
        }
      }
    },

    /**
     * Adds a {PaperNumberNode} to the relevant layers, sets up listeners, and internally tracks it.
     * @public
     *
     * @param {PaperNumberNode} paperNumberNode
     */
    addPaperNumberNode: function( paperNumberNode ) {
      this.paperNumberNodeMap[ paperNumberNode.paperNumber.id ] = paperNumberNode;
      this.paperNumberNodes.push( paperNumberNode );

      this.paperNumberLayerNode.addChild( paperNumberNode );

      paperNumberNode.attachListeners();
    },

    /**
     * Removes a {PaperNumberNode} from the relevant layers, removes listeners, and removes internal tracking.
     * @public
     *
     * @param {PaperNumberNode} paperNumberNode
     */
    removePaperNumberNode: function( paperNumberNode ) {
      arrayRemove( this.paperNumberNodes, paperNumberNode );
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
     * @param {PaperNumberNode} draggedPaperNumber
     * @param {Vector} droppedPoint (on screen coordinates)
     */
    tryToCombineNumbers: function( draggedPaperNumber, droppedPoint ) {
      var draggedNode = this.findPaperNumberNode( draggedPaperNumber );
      var allPaperNumberNodes = this.paperNumberLayerNode.children;
      var droppedNodes = draggedNode.findAttachableNodes( allPaperNumberNodes );

      //check them in reverse order (the one on the top should get more priority)
      droppedNodes.reverse();

      //Show Arrow cue if user hasn't succeeded in combining or splitting a number
      if ( !this.makeATenModel.interactionSucceeded && this.makeATenModel.arrowCue ) {
        this.makeATenModel.arrowCue.positionAt( draggedPaperNumber );
        this.makeATenModel.interactionAttempted = true;
      }

      for ( var i = 0; i < droppedNodes.length; i++ ) {
        var numberA = draggedPaperNumber.numberValue;
        var numberB = droppedNodes[ i ].paperNumber.numberValue;
        if ( ArithmeticRules.canAddNumbers( numberA, numberB ) ) {
          var droppedPaperNumber = droppedNodes[ i ].paperNumber;
          this.makeATenModel.collapseNumberModels( draggedPaperNumber, droppedPaperNumber );
          return;
        }
        else {

          // repel numbers - show rejection
          var paperNumber1 = draggedNode.paperNumber;
          var paperNumber2 = droppedNodes[ i ].paperNumber;
          this.makeATenModel.repelAway( paperNumber1, paperNumber2 );
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

    layout: function( width, height ) {
      this.resetTransform();

      var scale = this.getLayoutScale( width, height );
      this.setScaleMagnitude( scale );

      var offsetX = 0;
      var offsetY = 0;

      // Move to bottom vertically
      if ( scale === width / this.layoutBounds.width ) {
        offsetY = (height / scale - this.layoutBounds.height);
      }

      // center horizontally
      else if ( scale === height / this.layoutBounds.height ) {
        offsetX = (width - this.layoutBounds.width * scale) / 2 / scale;
      }
      this.translate( offsetX, offsetY );

      this.availableViewBoundsProperty.value = new DotRectangle( -offsetX, -offsetY, width / scale, height / scale );
    }
  } );
} );