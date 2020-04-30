// Copyright 2015-2020, University of Colorado Boulder

/**
 * Model for the Adding screen of Make a Ten.
 *
 * @author Sharfudeen Ashraf
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import makeATen from '../../../makeATen.js';
import AdditionTerms from '../../common/model/AdditionTerms.js';
import MakeATenCommonModel from '../../common/model/MakeATenCommonModel.js';

/**
 * @constructor
 */
function MakeATenAddingModel() {
  // @public {AdditionTerms}
  this.additionTerms = new AdditionTerms();

  MakeATenCommonModel.call( this );
}

makeATen.register( 'MakeATenAddingModel', MakeATenAddingModel );

inherit( MakeATenCommonModel, MakeATenAddingModel, {
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

export default MakeATenAddingModel;