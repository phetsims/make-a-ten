// Copyright 2016-2020, University of Colorado Boulder

/**
 * Explore screen of Make a Ten. Provides a panel where 100s, 10s or 1s can be dragged out, combined, and pulled
 * apart, and displays the total in the upper-left.
 *
 * @author Sharfudeen Ashraf
 */

import Property from '../../../../axon/js/Property.js';
import Screen from '../../../../joist/js/Screen.js';
import inherit from '../../../../phet-core/js/inherit.js';
import exploreHomeScreenImage from '../../../images/explore-home-screen_png.js';
import exploreNavBarImage from '../../../images/explore-nav-bar_png.js';
import makeATenStrings from '../../make-a-ten-strings.js';
import makeATen from '../../makeATen.js';
import MakeATenConstants from '../common/MakeATenConstants.js';
import MakeATenUtils from '../common/MakeATenUtils.js';
import MakeATenExploreModel from './model/MakeATenExploreModel.js';
import MakeATenExploreScreenView from './view/MakeATenExploreScreenView.js';

const screenExploreString = makeATenStrings.screen.explore;

/**
 * @constructor
 */
function MakeATenExploreScreen() {

  const options = {
    name: screenExploreString,
    backgroundColorProperty: new Property( MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
    homeScreenIcon: MakeATenUtils.createIconWithBackgroundColor( exploreHomeScreenImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR ),
    navigationBarIcon: MakeATenUtils.createIconWithBackgroundColor( exploreNavBarImage, MakeATenConstants.SCREEN_BACKGROUND_COLOR )
  };

  Screen.call( this,
    function() { return new MakeATenExploreModel(); },
    function( model ) { return new MakeATenExploreScreenView( model ); },
    options );
}

makeATen.register( 'MakeATenExploreScreen', MakeATenExploreScreen );

inherit( Screen, MakeATenExploreScreen );
export default MakeATenExploreScreen;