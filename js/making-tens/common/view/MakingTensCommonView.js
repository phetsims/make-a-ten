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
  var Node = require( 'SCENERY/nodes/Node' );
  var PaperNumberNode = require( 'MAKING_TENS/making-tens/common/view/PaperNumberNode' );
  var ArithmeticRules = require( 'MAKING_TENS/making-tens/common/model/ArithmeticRules' );

  /**
   * @param {MakingTensCommonModel} makingTensCommonModel
   * @constructor
   */
  function MakingTensCommonView( makingTensModel, screenBounds, paperNumberNodeLayer ) {
    var self = this;
    ScreenView.call( this, { layoutBounds: screenBounds } );
    self.makingTensModel = makingTensModel;

    self.paperNumberLayerNode = new Node();
    paperNumberNodeLayer.addChild( self.paperNumberLayerNode );

    self.addUserCreatedNumberModel = makingTensModel.addUserCreatedNumberModel.bind( makingTensModel );
    self.combineNumbersIfApplicableCallback = this.combineNumbersIfApplicable.bind( this );

    function handlePaperNumberAdded( addedNumberModel ) {
      // Add a representation of the number.
      var paperNumberNode = new PaperNumberNode( addedNumberModel, self.addUserCreatedNumberModel, self.combineNumbersIfApplicableCallback );
      self.paperNumberLayerNode.addChild( paperNumberNode );

      // Move the shape to the front of this layer when grabbed by the user.
      addedNumberModel.userControlledProperty.link( function( userControlled ) {
        if ( userControlled ) {
          paperNumberNode.moveToFront();
        }
      } );

      makingTensModel.residentNumberModels.addItemRemovedListener( function removalListener( removedNumberModel ) {
        if ( removedNumberModel === addedNumberModel ) {
          self.paperNumberLayerNode.removeChild( paperNumberNode );
          makingTensModel.residentNumberModels.removeItemRemovedListener( removalListener );
        }
      } );
    }

    //Initial Number Node creation
    makingTensModel.residentNumberModels.forEach( handlePaperNumberAdded );

    // Observe new items
    makingTensModel.residentNumberModels.addItemAddedListener( handlePaperNumberAdded );
  }

  return inherit( ScreenView, MakingTensCommonView, {

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
          self.makingTensModel.collapseNumberModels( draggedPaperNumberModel, droppedPaperNumberModel );
          return;
        }
        else {

          // repel numbers - show rejection
          var paperNumberModel1 = draggedNode.paperNumberModel;
          var paperNumberModel2 = droppedNodes[ i ].paperNumberModel;
          self.makingTensModel.repelAway( paperNumberModel1, paperNumberModel2 );
          return;
        }
      }

    }
  } );
} );