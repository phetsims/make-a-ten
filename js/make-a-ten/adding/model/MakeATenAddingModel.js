// Copyright 2015-2019, University of Colorado Boulder

/**
 * Model for the Adding screen of Make a Ten.
 *
 * @author Sharfudeen Ashraf
 */
define( require => {
  'use strict';

  // modules
  const AdditionTerms = require( 'MAKE_A_TEN/make-a-ten/common/model/AdditionTerms' );
  const inherit = require( 'PHET_CORE/inherit' );
  const makeATen = require( 'MAKE_A_TEN/makeATen' );
  const MakeATenCommonModel = require( 'MAKE_A_TEN/make-a-ten/common/model/MakeATenCommonModel' );

  /**
   * @constructor
   */
  function MakeATenAddingModel() {
    // @public {AdditionTerms}
    this.additionTerms = new AdditionTerms();

    MakeATenCommonModel.call( this );
  }

  makeATen.register( 'MakeATenAddingModel', MakeATenAddingModel );

  return inherit( MakeATenCommonModel, MakeATenAddingModel, {
    /**
     * Clears the play area and places paper numbers corresponding to the additionTerms.
     * @public
     */
    setupTerms: function() {
      this.removeAllPaperNumbers();
      this.addMultipleNumbers( [
        this.additionTerms.leftTermProperty.value,
        this.additionTerms.rightTermProperty.value
      ] );
    },

    /**
     * @override
     */
    reset: function() {
      MakeATenCommonModel.prototype.reset.call( this );

      this.additionTerms.reset();
    }
  } );
} );
