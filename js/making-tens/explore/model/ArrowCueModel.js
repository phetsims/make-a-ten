// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  var Dimension2 = require( 'DOT/Dimension2' );

  var CUE_IMAGE_DIMENSION = new Dimension2( 50, 50 );

  /**
   *
   * @constructor
   */
  function ArrowCueModel() {
    var thisModel = this;
    PropertySet.call( thisModel, {
      moveArrowCuePosition: new Vector2(),
      splitArrowCuePosition: new Vector2(),
      opacity: 1,
      targetOpacity: 1,
      visible: false
    } );
  }

  return inherit( PropertySet, ArrowCueModel, {

    /**
     *
     * @param {number} dt
     */
    step: function( dt ) {

      if ( !this.visible ) {
        return;
      }

      var opacityReductionFactor = dt * 3;

      if ( this.targetOpacity !== this.opacity ) {
        this.opacity -= this.opacity * opacityReductionFactor;
      }

      if ( Math.abs( this.opacity ) < dt ) {
        this.targetOpacity = this.opacity = 0;
        this.visible = false;
      }
    },

    fadeAway: function() {
      this.targetOpacity = 0;
    },

    /**
     *
     * @param {PaperNumberModel} paperNumberModel
     */
    positionAt: function( paperNumberModel ) {
      var paperNumberBounds = paperNumberModel.getBounds();

      var rightTop = new Vector2( paperNumberModel.position.x + paperNumberBounds.width - CUE_IMAGE_DIMENSION.width / 2,
        paperNumberModel.position.y + paperNumberBounds.height * 0.15 - CUE_IMAGE_DIMENSION.height / 2 );

      var bottomCenter = new Vector2( paperNumberModel.position.x + paperNumberBounds.width * 0.5 - CUE_IMAGE_DIMENSION.width / 2,
        paperNumberModel.position.y + paperNumberBounds.height * 0.8 - CUE_IMAGE_DIMENSION.height / 2 );

      this.moveArrowCuePosition = bottomCenter;
      this.splitArrowCuePosition = rightTop;
    }

  } );


} );
