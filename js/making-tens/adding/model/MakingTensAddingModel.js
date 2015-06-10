// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MakingTensCommonModel = require( 'MAKING_TENS/making-tens/common/model/MakingTensCommonModel' );

  /**
   *
   * @param addingScreenBounds
   * @constructor
   */
  function MakingTensAddingModel( addingScreenBounds ) {
    MakingTensCommonModel.call( this, addingScreenBounds, {
      leftTerm: 0,
      rightTerm: 0,
      activeTerm: "none"
    } );
  }

  return inherit( MakingTensCommonModel, MakingTensAddingModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      MakingTensCommonModel.prototype.step.call( this, dt );
    }
  } );
} );