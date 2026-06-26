// Copyright 2016-2026, University of Colorado Boulder

/**
 * Adding screen for Make a Ten. Allows entering two numbers with a keypad, so that the user can experiment with adding
 * with the sim's usual constraints.
 *
 * @author Sharfudeen Ashraf
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import addingHomeScreen_svg from '../../images/addingHomeScreen_svg.js';
import addingNavBar_svg from '../../images/addingNavBar_svg.js';
import MakeATenStrings from '../MakeATenStrings.js';
import MakeATenConstants from '../common/MakeATenConstants.js';
import MakeATenUtils from '../common/MakeATenUtils.js';
import MakeATenAddingModel from './model/MakeATenAddingModel.js';
import MakeATenAddingScreenView from './view/MakeATenAddingScreenView.js';

class MakeATenAddingScreen extends Screen<MakeATenAddingModel, MakeATenAddingScreenView> {
  public constructor() {

    const options = {
      name: MakeATenStrings.screen.addingStringProperty,
      backgroundColorProperty: new Property( MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
      homeScreenIcon: MakeATenUtils.createIconWithBackgroundColor( addingHomeScreen_svg, MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
      navigationBarIcon: MakeATenUtils.createIconWithBackgroundColor( addingNavBar_svg, MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
      tandem: Tandem.OPT_OUT
    } as const;

    super(
      () => new MakeATenAddingModel(),
      model => new MakeATenAddingScreenView( model ),
      options );
  }
}

export default MakeATenAddingScreen;
