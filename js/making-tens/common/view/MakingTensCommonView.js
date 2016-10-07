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
  var ScreenView = require( 'JOIST/ScreenView' );
  var DotRectangle = require( 'DOT/Rectangle' ); // eslint-disable-line require-statement-match
  var Property = require( 'AXON/Property' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var PaperNumberNode = require( 'MAKING_TENS/making-tens/common/view/PaperNumberNode' );
  var ArithmeticRules = require( 'MAKING_TENS/making-tens/common/model/ArithmeticRules' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );

  // constants
  // Debug flag to show the view bounds, the region within which the user can move the numbers
  var showAvailableBounds = false;

  /**
   *
   * @param {MakingTensModel} makingTensModel
   * @param {Bounds2} screenBounds
   * @param {Function} addPaperNumber - callback
   * @constructor
   */
  function MakingTensCommonView( makingTensModel, screenBounds, addPaperNumber ) {
    var self = this;
    ScreenView.call( this, { layoutBounds: screenBounds } );
    self.makingTensModel = makingTensModel;

    self.paperNumberLayerNode = new Node();

    self.addPaperNumber = addPaperNumber || makingTensModel.addPaperNumber.bind( makingTensModel );
    self.tryToCombineNumbers = this.tryToCombineNumbers.bind( this );

    self.paperNumberNodes = [];
    // Associate Model Id with its corresponding Node
    // https://github.com/phetsims/making-tens/issues/199
    self.paperNumberNodeMap = {};

    function handlePaperNumberAdded( addedNumberModel ) {
      // Add a representation of the number.
      var paperNumberNode = new PaperNumberNode( addedNumberModel, self, self.addPaperNumber,
        self.tryToCombineNumbers  );
      self.paperNumberLayerNode.addChild( paperNumberNode );

      // Move the shape to the front of this layer when grabbed by the user.
      addedNumberModel.userControlledProperty.link( function( userControlled ) {
        if ( userControlled ) {
          paperNumberNode.moveToFront();
        }
      } );

      self.paperNumberNodeMap[ addedNumberModel.id ] = paperNumberNode;
      self.paperNumberNodes.push( paperNumberNode );
    }

    makingTensModel.paperNumbers.addItemRemovedListener( function removalListener( removedNumberModel ) {
      var removedPaperNumberNode = self.findPaperNumberNode( removedNumberModel );
      self.paperNumberLayerNode.removeChild( removedPaperNumberNode );
      self.paperNumberNodes = _.without( self.paperNumberNodes, removedPaperNumberNode );
      delete self.paperNumberNodeMap[ removedNumberModel.id ];
    } );

    //Initial Number Node creation
    makingTensModel.paperNumbers.forEach( handlePaperNumberAdded );

    // Observe new items
    makingTensModel.paperNumbers.addItemAddedListener( handlePaperNumberAdded );

    // used to prevent numbers from moving outside the visible model bounds when dragged
    this.availableViewBoundsProperty = new Property( null );// filled by layout method

    // For debugging the visible bounds
    if ( showAvailableBounds ) {
      this.viewBoundsPath = new Path( null, { pickable: false, stroke: 'red', lineWidth: 10 } );
      this.addChild( this.viewBoundsPath );
    }

    this.availableViewBoundsProperty.lazyLink( function( newBounds ) {
      makingTensModel.paperNumbers.forEach( function( numberModel ) {
        numberModel.constrainPosition( newBounds, numberModel.position );
      } );
    } );

    this.availableViewBoundsProperty.linkAttribute( makingTensModel, 'viewPortBounds' );
  }

  makingTens.register( 'MakingTensCommonView', MakingTensCommonView );

  return inherit( ScreenView, MakingTensCommonView, {

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
              paperNumberNode1.paperNumber.opacity = MakingTensSharedConstants.HOVER_OPACITY;
            }
            else {
              paperNumberNode2.paperNumber.opacity = MakingTensSharedConstants.HOVER_OPACITY;
            }
          }
        }
      }
    },

    findPaperNumberNode: function( paperNumber ) {
      var self = this;
      var allPaperNumberNodes = self.paperNumberLayerNode.children;
      var node = _.find( allPaperNumberNodes, function( node ) {
        return node.paperNumber === paperNumber;
      } );
      return node;
    },

    /**
     * When user drops a node on another node , add if the arthimetic rules match
     * @param {PaperNumberNode} draggedPaperNumber
     * @param {Vector} droppedPoint (on screen coordinates)
     */
    tryToCombineNumbers: function( draggedPaperNumber, droppedPoint ) {
      var self = this;
      var draggedNode = self.findPaperNumberNode( draggedPaperNumber );
      var allPaperNumberNodes = self.paperNumberLayerNode.children;
      var droppedNodes = draggedNode.findAttachableNodes( allPaperNumberNodes );

      //check them in reverse order (the one on the top should get more priority)
      droppedNodes.reverse();

      //Show Arrow cue if user hasn't succeeded in combining or splitting a number
      if ( !self.makingTensModel.interactionSucceeded && self.makingTensModel.arrowCueModel ) {
        self.makingTensModel.arrowCueModel.positionAt( draggedPaperNumber );
        self.makingTensModel.interactionAttempted = true;
      }

      for ( var i = 0; i < droppedNodes.length; i++ ) {
        var numberA = draggedPaperNumber.numberValue;
        var numberB = droppedNodes[ i ].paperNumber.numberValue;
        if ( ArithmeticRules.canAddNumbers( numberA, numberB ) ) {
          var droppedPaperNumber = droppedNodes[ i ].paperNumber;
          self.makingTensModel.collapseNumberModels( draggedPaperNumber, droppedPaperNumber );
          return;
        }
        else {

          // repel numbers - show rejection
          var paperNumber1 = draggedNode.paperNumber;
          var paperNumber2 = droppedNodes[ i ].paperNumber;
          self.makingTensModel.repelAway( paperNumber1, paperNumber2 );
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
      // Show it for debugging
      if ( showAvailableBounds ) {
        this.viewBoundsPath.shape = Shape.bounds( this.availableViewBoundsProperty.get() );
      }

    }
  } );
} );