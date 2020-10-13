// Copyright 2015-2020, University of Colorado Boulder

/**
 * Model for the Adding screen of Make a Ten.
 *
 * @author Sharfudeen Ashraf
 */

import makeATen from '../../../makeATen.js';
import AdditionTerms from '../../common/model/AdditionTerms.js';
import MakeATenCommonModel from '../../common/model/MakeATenCommonModel.js';

class MakeATenAddingModel extends MakeATenCommonModel {
  constructor() {
    super();

    // @public {AdditionTerms}
    this.additionTerms = new AdditionTerms();
  }

  /**
   * Clears the play area and places paper numbers corresponding to the additionTerms.
   * @public
   */
  setupTerms() {
    this.removeAllPaperNumbers();
    this.addMultipleNumbers( [
      this.additionTerms.leftTermProperty.value,
      this.additionTerms.rightTermProperty.value
    ] );
  }

  /**
   * Resets values to their original state
   * @public
   * @override
   */
  reset() {
    super.reset();

    this.additionTerms.reset();
  }
}

makeATen.register( 'MakeATenAddingModel', MakeATenAddingModel );

export default MakeATenAddingModel;