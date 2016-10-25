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
  var Vector2 = require( 'DOT/Vector2' );
  var MakeATenCommonModel = require( 'MAKE_A_TEN/make-a-ten/common/model/MakeATenCommonModel' );
  var ExpressionTerms = require( 'MAKE_A_TEN/make-a-ten/common/model/ExpressionTerms' );
  var PaperNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/PaperNumber' );
  var MakeATenSharedConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenSharedConstants' );

  /**
   *
   * @constructor
   */
  function MakeATenAddingModel() {
    // leftTerm,rightTerm,activeTerm and showBackground
    // TODO: what is the comment above?
    this.expressionTerms = new ExpressionTerms();

    MakeATenCommonModel.call( this );
  }

  makeATen.register( 'MakeATenAddingModel', MakeATenAddingModel );

  return inherit( MakeATenCommonModel, MakeATenAddingModel, {

    /**
     * creates PaperNumbers based on the values entered through keyboard
     */
    createTerms: function() {
      var self = this;
      this.paperNumbers.clear();
      var valuesToCreate = [ this.expressionTerms.leftTerm, this.expressionTerms.rightTerm ];

      var xOffSet = 200;
      _.each( valuesToCreate, function( numberValue ) {
        if ( numberValue ) {
          var initialPosition = new Vector2( xOffSet, MakeATenSharedConstants.LAYOUT_BOUNDS.height / 3.5 );
          //Keyboard Terms returns as String, so cast it to number
          self.addPaperNumber( new PaperNumber( numberValue, initialPosition ) );
          xOffSet += 350;
        }

      } );
    },

    /**
     * @override
     */
    reset: function() {
      MakeATenCommonModel.prototype.reset.call( this );

      this.expressionTerms.reset();
    }

  } );
} );