// Copyright 2015-2026, University of Colorado Boulder

/**
 * Game screenview for make-a-ten. Includes 10 levels, where the goal for each is to combine the 2 numbers together into
 * one number by manipulating with the concept of making a ten. Each level can generate an infinite number of
 * challenges, so the score for each level is an integer (instead of a proportion like other sims).
 *
 * @author Sharfudeen Ashraf
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import CountingCommonScreenView from '../../../../counting-common/js/common/view/CountingCommonScreenView.js';
import type Bounds2 from '../../../../dot/js/Bounds2.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ButtonListener from '../../../../scenery/js/input/ButtonListener.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Easing from '../../../../twixt/js/Easing.js';
import TransitionNode from '../../../../twixt/js/TransitionNode.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import InfiniteStatusBar from '../../../../vegas/js/InfiniteStatusBar.js';
import RewardDialog from '../../../../vegas/js/RewardDialog.js';
import MakeATenStrings from '../../MakeATenStrings.js';
import AdditionTermsNode from '../../common/view/AdditionTermsNode.js';
import GameState from '../model/GameState.js';
import type Level from '../model/Level.js';
import MakeATenGameModel from '../model/MakeATenGameModel.js';
import InfoDialog from './InfoDialog.js';
import MakeATenRewardNode from './MakeATenRewardNode.js';
import NextArrowButton from './NextArrowButton.js';
import StartGameLevelNode from './StartGameLevelNode.js';

const patternLevel0LevelNumberStringProperty = MakeATenStrings.pattern.level[ '0levelNumberStringProperty' ];

class MakeATenGameScreenView extends CountingCommonScreenView {

  // The "left" half of the sliding layer, displayed first
  private readonly levelSelectionLayer: Node;

  // The "right" half of the sliding layer, will slide into view when the user selects a level
  private readonly challengeLayer: Node;

  private readonly transitionNode: TransitionNode;

  // Shows buttons that allow selecting the level to play
  private readonly startGameLevelNode: StartGameLevelNode;

  // Shows '?' in the corner that pops up the info dialog when clicked.
  private readonly infoButton: InfoButton;

  // Moves to the next challenge when clicked
  private readonly nextChallengeButton: NextArrowButton;

  // Status bar at the top of the screen
  private readonly gameStatusBar: InfiniteStatusBar;

  private readonly gameAudioPlayer: GameAudioPlayer;

  // See showReward()
  private rewardNode: MakeATenRewardNode | null;

  // See showReward()
  private rewardNodeBoundsListener: ( ( value: Bounds2 ) => void ) | null;

  private readonly rewardBarrier: Rectangle;
  private gameModel: MakeATenGameModel;

  public constructor( model: MakeATenGameModel ) {
    super( model );
    this.gameModel = model;

    this.finishInitialization();

    this.levelSelectionLayer = new Node();

    this.challengeLayer = new Node();

    const showingLeftProperty = new DerivedProperty( [ model.gameStateProperty ], gameState => gameState === 'CHOOSING_LEVEL' );

    this.transitionNode = new TransitionNode( this.visibleBoundsProperty, {
      content: this.levelSelectionLayer
    } );
    showingLeftProperty.lazyLink( isLeft => {
      const ANIMATION_OPTIONS = {
        duration: 0.4,
        targetOptions: {
          easing: Easing.QUADRATIC_IN_OUT
        }
      };
      if ( isLeft ) {
        this.transitionNode.slideRightTo( this.levelSelectionLayer, ANIMATION_OPTIONS );
      }
      else {
        this.transitionNode.slideLeftTo( this.challengeLayer, ANIMATION_OPTIONS );
      }
    } );
    this.addChild( this.transitionNode );

    this.startGameLevelNode = new StartGameLevelNode( model );
    this.levelSelectionLayer.addChild( this.startGameLevelNode );

    // Move our resetAllButton onto our level-selection layer
    this.resetAllButton.detach();
    this.levelSelectionLayer.addChild( this.resetAllButton );

    // info dialog, constructed lazily because Dialog requires sim bounds during construction
    let dialog: Dialog | null = null;

    this.infoButton = new InfoButton( {
      touchAreaDilation: 7,
      listener: () => {
        if ( !dialog ) {
          dialog = new InfoDialog( model.levels );
        }
        dialog.show();
      },
      scale: 0.7,
      top: this.layoutBounds.top + 20,
      right: this.layoutBounds.right - 20
    } );
    this.levelSelectionLayer.addChild( this.infoButton );

    // The node that display "12 + 100 = "
    const additionTermsNode = new AdditionTermsNode( model.additionTerms, false );
    additionTermsNode.left = this.layoutBounds.left + 38;
    additionTermsNode.top = this.layoutBounds.top + 75;
    this.challengeLayer.addChild( additionTermsNode );

    this.nextChallengeButton = new NextArrowButton( MakeATenStrings.nextStringProperty, {
      listener: () => {
        model.moveToNextChallenge();
      },
      top: this.layoutBounds.centerY,
      right: this.layoutBounds.right - 20
    } );
    this.challengeLayer.addChild( this.nextChallengeButton );
    model.gameStateProperty.link( gameState => {
      this.nextChallengeButton.visible = gameState === 'CORRECT_ANSWER';
    } );

    // Add the counting object layer from our supertype
    this.challengeLayer.addChild( this.countingObjectLayerNode );

    const currentLevelNumberProperty = new DerivedProperty( [ model.currentLevelProperty ], level => level.number );
    const currentLevelNumberStringProperty = new PatternStringProperty( patternLevel0LevelNumberStringProperty, {
      levelNumber: currentLevelNumberProperty
    }, {
      formatNames: [ 'levelNumber' ]
    } );
    const currentLevelDescriptionProperty = new DynamicProperty<string, string, Level>( model.currentLevelProperty, {
      derive: 'descriptionProperty'
    } );

    const levelNumberText = new Text( currentLevelNumberStringProperty, {
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      pickable: false,
      maxWidth: 120
    } );
    const levelDescriptionText = new Text( currentLevelDescriptionProperty, {
      font: new PhetFont( 18 ),
      pickable: false,
      maxWidth: 600
    } );
    const statusMessageNode = new HBox( {
      children: [ levelNumberText, levelDescriptionText ],
      spacing: 30
    } );

    this.gameStatusBar = new InfiniteStatusBar( this.layoutBounds, this.visibleBoundsProperty, statusMessageNode, model.currentScoreProperty, {
      floatToTop: true,
      barFill: new DerivedProperty( [ model.currentLevelProperty ], _.property( 'color' ) ),
      backButtonListener: model.moveToChoosingLevel.bind( model )
    } );
    this.challengeLayer.addChild( this.gameStatusBar );

    // Hook up the audio player to the sound settings.
    this.gameAudioPlayer = new GameAudioPlayer();

    // Trigger initial layout
    this.layoutControls();

    // Hook up the update function for handling changes to game state.
    model.gameStateProperty.link( this.onGameStateChange.bind( this ) );

    this.rewardNode = null;

    this.rewardNodeBoundsListener = null;

    this.rewardBarrier = Rectangle.bounds( this.visibleBoundsProperty.value, {
      fill: 'rgba(128,128,128,0.4)'
    } );
    this.visibleBoundsProperty.linkAttribute( this.rewardBarrier, 'rectBounds' );
    this.rewardBarrier.addInputListener( new ButtonListener( {
      fire: () => {
        this.hideReward();
      }
    } ) );

    model.levels.forEach( level => {
      level.scoreProperty.link( score => {
        if ( score === 10 ) {
          this.showReward();
        }
      } );
    } );
  }

  public override step( dt: number ): void {
    this.rewardNode && this.rewardNode.step( dt );
    this.transitionNode && this.transitionNode.step( dt );
  }

  /**
   * Shows the reward node.
   */
  private showReward(): void {
    this.gameAudioPlayer.gameOverPerfectScore();

    this.rewardNode = new MakeATenRewardNode();
    this.addChild( this.rewardBarrier );
    this.addChild( this.rewardNode );
    this.rewardNodeBoundsListener = this.visibleBoundsProperty.linkAttribute( this.rewardNode, 'canvasBounds' );

    const rewardDialog = new RewardDialog( this.gameModel.currentLevelProperty.value.number, 10, {
      dismissListener: () => {
        this.hideReward();
        rewardDialog.dispose();

      },
      newLevelButtonListener: () => {
        this.hideReward();
        this.gameModel.moveToChoosingLevel();
        rewardDialog.dispose();
      }
    } );
    rewardDialog.show();
  }

  /**
   * Hides the reward node.
   */
  private hideReward(): void {
    this.removeChild( this.rewardNode! );
    this.removeChild( this.rewardBarrier );
    this.visibleBoundsProperty.unlink( this.rewardNodeBoundsListener! );

    // fully release references
    this.rewardNode = null;
    this.rewardNodeBoundsListener = null;
  }

  /**
   * When the game state changes, update the view with the appropriate buttons and readouts.
   */
  private onGameStateChange( gameState: GameState ): void {
    if ( gameState === 'PRESENTING_INTERACTIVE_CHALLENGE' ) {
      // @ts-expect-error - currentChallengeProperty is populated for this state, but the Property type allows null.
      this.gameModel.setupChallenge( this.gameModel.currentChallengeProperty.value );
    }
    if ( gameState === 'CORRECT_ANSWER' ) {
      this.gameModel.incrementScore();
      this.gameAudioPlayer.correctAnswer();
    }
  }

  /**
   * @returns Amount in view coordinates to leave at the top of the screen.
   */
  public override getTopBoundsOffset(): number {
    return this.gameStatusBar.height;
  }
}

export default MakeATenGameScreenView;
