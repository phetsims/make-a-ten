// Copyright 2015, University of Colorado Boulder

/**
 * Button that will open a particular game level. Originally from LevelSelectionButton.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ScoreNode = require( 'MAKE_A_TEN/make-a-ten/game/view/ScoreNode' );
  var MakeATenUtil = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenUtil' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  /**
   * @constructor
   *
   * @param {Level} level
   * @param {Function} fireCallback - Called when the button fires
   * @param {Object} [options] - Passed to Node
   */
  function LevelButton( level, fireCallback, options ) {

    Node.call( this );

    options = _.extend( {
      // button size and appearance
      buttonWidth: 150,
      buttonHeight: 150,
      cornerRadius: 10,
      buttonXMargin: 10,
      buttonYMargin: 10,
      // progress indicator (stars)
      iconToscoreNodeYSpace: 10
    }, options );

    var maxContentWidth = options.buttonWidth - 2 * options.buttonXMargin;

    // Progress indicator (stars), scaled to fit
    var scoreNodeBackground = new Rectangle( 0, 0, maxContentWidth,
      options.buttonHeight * 0.2, options.cornerRadius, options.cornerRadius, {
        fill: 'white',
        stroke: 'black',
        lineWidth: 1,
        pickable: false
      } );
    var scoreNode = new ScoreNode( level.scoreProperty, {
      pickable: false
    } );
    var scoreNodeMinXMargin = 10;
    var scoreNodeMinYMargin = 5;
    scoreNode.scale( Math.min(
      ( scoreNodeBackground.width - 2 * scoreNodeMinXMargin ) / scoreNode.width,
      ( scoreNodeBackground.height - 2 * scoreNodeMinYMargin ) / scoreNode.height ) );

    // Icon, scaled and padded to fit and to make the button size correct.
    var iconSize = new Dimension2( maxContentWidth, options.buttonHeight - scoreNodeBackground.height -
                                                    2 * options.buttonYMargin - options.iconToscoreNodeYSpace );
    var adjustedIcon = MakeATenUtil.createSizedImageNode( level.iconNode, iconSize );
    adjustedIcon.pickable = false;

    // Assemble the content.
    var contentNode = new Node();
    if ( scoreNodeBackground.width > adjustedIcon.width ) {
      adjustedIcon.centerX = scoreNodeBackground.centerX;
    }
    else {
      scoreNodeBackground.centerX = adjustedIcon.centerX;
    }
    scoreNodeBackground.top = adjustedIcon.bottom + options.iconToscoreNodeYSpace;
    scoreNode.center = scoreNodeBackground.center;
    contentNode.addChild( adjustedIcon );
    contentNode.addChild( scoreNodeBackground );
    contentNode.addChild( scoreNode );

    // Create the button
    this.addChild( new RectangularPushButton( {
      content: contentNode,
      xMargin: options.buttonXMargin,
      yMargin: options.buttonYMargin,
      baseColor: level.color,
      cornerRadius: options.cornerRadius,
      listener: fireCallback
    } ) );

    // Pass options to parent class
    this.mutate( options );
  }

  makeATen.register( 'LevelButton', LevelButton );

  return inherit( Node, LevelButton );
} );
