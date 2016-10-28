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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );

  /**
   * @constructor
   *
   * @param {Level} level
   * @param {Function} fireCallback - Called when the button fires
   * @param {Object} [options] - Passed to Node
   */
  function LevelButton( level, fireCallback, options ) {

    Node.call( this );

    var buttonWidth = 150;
    var buttonHeight = 150;
    var buttonXMargin = 10;
    var buttonYMargin = 10;

    var iconScorePadding = 10;
    var maxContentWidth = buttonWidth - 2 * buttonXMargin;

    // Progress indicator (stars), scaled to fit
    var scoreCornerRadius = 10;
    var scoreNodeBackground = new Rectangle( 0, 0, maxContentWidth,
      buttonHeight * 0.2, scoreCornerRadius, scoreCornerRadius, {
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
    var iconSize = new Dimension2( maxContentWidth, buttonHeight - scoreNodeBackground.height -
                                                    2 * buttonYMargin - iconScorePadding );
    var adjustedIcon = LevelSelectionButton.createSizedImageNode( level.iconNode, iconSize );
    adjustedIcon.pickable = false;

    // Assemble the content.
    var contentNode = new Node();
    if ( scoreNodeBackground.width > adjustedIcon.width ) {
      adjustedIcon.centerX = scoreNodeBackground.centerX;
    }
    else {
      scoreNodeBackground.centerX = adjustedIcon.centerX;
    }
    scoreNodeBackground.top = adjustedIcon.bottom + iconScorePadding;
    scoreNode.center = scoreNodeBackground.center;
    contentNode.addChild( adjustedIcon );
    contentNode.addChild( scoreNodeBackground );
    contentNode.addChild( scoreNode );

    // Create the button
    this.addChild( new RectangularPushButton( {
      content: contentNode,
      xMargin: buttonXMargin,
      yMargin: buttonYMargin,
      baseColor: level.color,
      cornerRadius: 10,
      listener: fireCallback
    } ) );

    // Pass options to parent class
    this.mutate( options );
  }

  makeATen.register( 'LevelButton', LevelButton );

  return inherit( Node, LevelButton );
} );
