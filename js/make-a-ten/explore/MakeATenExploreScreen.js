// Copyright 2016-2020, University of Colorado Boulder

/**
 * Explore screen of Make a Ten. Provides a panel where 100s, 10s or 1s can be dragged out, combined, and pulled
 * apart, and displays the total in the upper-left.
 *
 * @author Sharfudeen Ashraf
 */

import Property from '../../../../axon/js/Property.js';
import Screen from '../../../../joist/js/Screen.js';
import exploreHomeScreenImage from '../../../images/explore-home-screen_png.js';
import exploreNavBarImage from '../../../images/explore-nav-bar_png.js';
import makeATen from '../../makeATen.js';
import makeATenStrings from '../../makeATenStrings.js';
import MakeATenConstants from '../common/MakeATenConstants.js';
import MakeATenUtils from '../common/MakeATenUtils.js';
import MakeATenExploreModel from './model/MakeATenExploreModel.js';
import MakeATenExploreScreenView from './view/MakeATenExploreScreenView.js';

class MakeATenExploreScreen extends Screen {
  constructor() {

    const options = {
      name: makeATenStrings.screen.explore,
      backgroundColorProperty: new Property( MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
      homeScreenIcon: MakeATenUtils.createIconWithBackgroundColor( exploreHomeScreenImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
      navigationBarIcon: MakeATenUtils.createIconWithBackgroundColor( exploreNavBarImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR )
    };

    super(
      function() { return new MakeATenExploreModel(); },
      function( model ) { return new MakeATenExploreScreenView( model ); },
      options );
  }
}

makeATen.register( 'MakeATenExploreScreen', MakeATenExploreScreen );
export default MakeATenExploreScreen;