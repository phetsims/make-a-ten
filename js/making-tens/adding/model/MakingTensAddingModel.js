// Copyright 2015, University of Colorado Boulder

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


  function MakingTensAddingModel( addingScreenBounds ) {

    //background style for active Term. When a term is highlighted (ie keyboard is active, indicate to the user using a different background)
    this.activeNumberDisplayStyle = { fill: null, stroke: '#000', lineDash: [ 5, 5 ] };
    this.normalNumberDisplayStyle = { fill: null, stroke: null, lineDash: [ 0, 0 ] };

    MakingTensCommonModel.call( this, addingScreenBounds, {
      leftTerm: '',
      rightTerm: '',
      activeTerm: 'none',
      leftTermBackgroundStyle: this.normalNumberDisplayStyle,
      rightTermBackgroundStyle: this.normalNumberDisplayStyle
    } );
  }

  return inherit( MakingTensCommonModel, MakingTensAddingModel, {

    /**
     *
     * @param {number} dt
     */
    step: function( dt ) {
      MakingTensCommonModel.prototype.step.call( this, dt );
    },

    /**
     * creates PaperNumbers based on the values entered through keyboard
     */
    createTerms: function() {
      var self = this;
      this.residentNumberModels.clear();
      var valuesToCreate = [ self.leftTerm, self.rightTerm ];
      var xOffSet = 200;
      _.each( valuesToCreate, function( numberValue ) {
        if ( numberValue === '' || numberValue === 0 ) {
          return;
        }
        var initialPosition = new Vector2( xOffSet, self.screenBounds.height / 3.5 );
        self.addUserCreatedNumberModel( new PaperNumberModel( numberValue, initialPosition ) );
        xOffSet += 350;
      } );
    },

    reset: function() {
      this.residentNumberModels.clear();
      this.leftTerm = '';
      this.rightTerm = '';
      this.activeTerm = 'none';
    }

  } );
} );