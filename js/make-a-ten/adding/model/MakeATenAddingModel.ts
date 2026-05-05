// Copyright 2015-2026, University of Colorado Boulder

/**
 * Model for the Adding screen of Make a Ten.
 *
 * @author Sharfudeen Ashraf
 */

import CountingCommonModel from '../../../../../counting-common/js/common/model/CountingCommonModel.js';
import MakeATenConstants from '../../common/MakeATenConstants.js';
import AdditionTerms from '../../common/model/AdditionTerms.js';

class MakeATenAddingModel extends CountingCommonModel {
  public constructor() {
    super( MakeATenConstants.MAX_SUM );

    // @public {AdditionTerms}
    this.additionTerms = new AdditionTerms();
  }

  /**
   * Clears the play area and places counting objects corresponding to the additionTerms.
   */
  public setupTerms(): void {
    this.removeAllCountingObjects();
    this.addMultipleNumbers( [
      this.additionTerms.leftTermProperty.value,
      this.additionTerms.rightTermProperty.value
    ] );
  }

  /**
   * Resets values to their original state
   */
  public override reset(): void {
    super.reset();

    this.additionTerms.reset();
  }
}

export default MakeATenAddingModel;
