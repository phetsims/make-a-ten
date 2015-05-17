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
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var HSlider = require( 'SUN/HSlider' );
  var Property = require( 'AXON/Property' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PaperNumberNode = require( 'MAKING_TENS/making-tens/common/view/PaperNumberNode' );
  var MakingTensSharedConstants = require( 'MAKING_TENS/making-tens/common/MakingTensSharedConstants' );


  // images
  var mockupImage = require( 'image!MAKING_TENS/explore-mockup.png' );

  /**
   * @param {MakingTensExploreModel} makingTensExploreModel
   * @constructor
   */
  function MakingTensExploreScreenView( makingTensExploreModel ) {

    ScreenView.call( this, { layoutBounds: MakingTensSharedConstants.LAYOUT_BOUNDS } );

    //Show the mock-up and a slider to change its transparency
    var mockupOpacityProperty = new Property( 0.4 );
    var image = new Image( mockupImage, { pickable: false } );
    mockupOpacityProperty.linkAttribute( image, 'opacity' );
    this.addChild( image );
    this.addChild( new HSlider( mockupOpacityProperty, { min: 0, max: 1 }, { top: 10, left: 500 } ) );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        makingTensExploreModel.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    var paperNumberLayerNode = new Node();
    this.addChild( paperNumberLayerNode );

    var addNewNumberModelCallBack = makingTensExploreModel.addNewNumber.bind( makingTensExploreModel );

    // a function that remembers the particle collection via closure
    function handleNumberAddListener() {
      return function handleParticleAdded( addedNumberModel ) {
        // Add a representation of the number.
        var paperNumberNode = new PaperNumberNode( addedNumberModel, addNewNumberModelCallBack );
        paperNumberLayerNode.addChild( paperNumberNode );

        makingTensExploreModel.residentNumbers.addItemRemovedListener( function removalListener( removedNumberModel ) {
          if ( removedNumberModel === addedNumberModel ) {
            paperNumberLayerNode.removeChild( paperNumberNode );
            makingTensExploreModel.residentNumbers.removeItemRemovedListener( removalListener );
          }
        } );
      };
    }

    //Initial Number Node creation
    makingTensExploreModel.residentNumbers.forEach( handleNumberAddListener() );

    // Observe new items
    makingTensExploreModel.residentNumbers.addItemAddedListener( handleNumberAddListener() );

  }

  return inherit( ScreenView, MakingTensExploreScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );