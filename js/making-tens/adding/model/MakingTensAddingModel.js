// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var MakingTensCommonModel = require( 'MAKING_TENS/making-tens/common/model/MakingTensCommonModel' );
  var PaperNumberModel = require( 'MAKING_TENS/making-tens/common/model/PaperNumberModel' );

  /**
   *
   * @param addingScreenBounds
   * @constructor
   */
  function MakingTensAddingModel( addingScreenBounds ) {
    MakingTensCommonModel.call( this, addingScreenBounds, {
      leftTerm: "",
      rightTerm: "",
      activeTerm: "none"
    } );
  }

  return inherit( MakingTensCommonModel, MakingTensAddingModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      MakingTensCommonModel.prototype.step.call( this, dt );
    },

    createTerms: function() {
      var self = this;
      this.residentNumberModels.clear();
      var valuesToCreate = [ self.leftTerm, self.rightTerm ];
      var xOffSet = 200;
      _.each( valuesToCreate, function( numberValue ) {
        if ( numberValue === "" || numberValue === 0 ) {
          return;
        }
        var initialPosition = new Vector2( xOffSet, self.screenBounds.height / 4 );
        self.addUserCreatedNumberModel( new PaperNumberModel( numberValue, initialPosition ) );
        xOffSet += 350;
      } );
    },

    reset: function() {
      this.residentNumberModels.clear();
      this.leftTerm = "";
      this.rightTerm = "";
      this.activeTerm = "none";
    }

  } );
} );