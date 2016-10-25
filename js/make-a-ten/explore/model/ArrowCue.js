// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Vector2 = require( 'DOT/Vector2' );
  var Dimension2 = require( 'DOT/Dimension2' );

  var CUE_IMAGE_DIMENSION = new Dimension2( 50, 50 );

  /**
   *
   * @constructor
   */
  function ArrowCue() {
    // @public {Property.<Vector2>}
    this.moveArrowCuePositionProperty = new Property( new Vector2() );

    // @public {Property.<Vector2>}
    this.splitArrowCuePositionProperty = new Property( new Vector2() );

    // @public {NumberProperty}
    this.opacityProperty = new NumberProperty( 1 );

    // @public {NumberProperty}
    this.targetOpacityProperty = new NumberProperty( 1 );

    // @public {BooleanProperty}
    this.visibleProperty = new BooleanProperty( false );
  }

  makeATen.register( 'ArrowCue', ArrowCue );

  return inherit( Object, ArrowCue, {

    /**
     *
     * @param {number} dt
     */
    step: function( dt ) {

      if ( !this.visible ) {
        return;
      }

      var opacityReductionFactor = dt * 3;

      if ( this.targetOpacityProperty.value !== this.opacityProperty.value ) {
        this.opacityProperty.value -= this.opacityProperty.value * opacityReductionFactor;
      }

      if ( Math.abs( this.opacityProperty.value ) < dt ) {
        this.targetOpacityProperty.value = this.opacityProperty.value = 0;
        this.visible = false;
      }
    },

    fadeAway: function() {
      this.targetOpacityProperty.value = 0;
    },

    /**
     *
     * @param {PaperNumber} paperNumber
     */
    positionAt: function( paperNumber ) {
      var paperNumberDimension = paperNumber.getDimension();

      var rightTop = new Vector2( paperNumber.positionProperty.value.x + paperNumberDimension.width - CUE_IMAGE_DIMENSION.width / 2,
        paperNumber.positionProperty.value.y + paperNumberDimension.height * 0.15 - CUE_IMAGE_DIMENSION.height / 2 );

      var bottomCenter = new Vector2( paperNumber.positionProperty.value.x + paperNumberDimension.width * 0.5 - CUE_IMAGE_DIMENSION.width / 2,
        paperNumber.positionProperty.value.y + paperNumberDimension.height * 0.8 - CUE_IMAGE_DIMENSION.height / 2 );

      this.moveArrowCuePositionProperty.value = bottomCenter;
      this.splitArrowCuePositionProperty.value = rightTop;
    }

  } );


} );
