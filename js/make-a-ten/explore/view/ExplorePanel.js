// Copyright 2015, University of Colorado Boulder

/**
 * Panel that contains a 100, 10 and 1, which can be clicked/dragged to create draggable paper numbers.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var makeATen = require( 'MAKE_A_TEN/makeATen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Panel = require( 'SUN/Panel' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PaperNumberNode = require( 'MAKE_A_TEN/make-a-ten/common/view/PaperNumberNode' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );

  /**
   * @constructor
   *
   * @param {MakeATenExploreScreenView} screenView
   */
  function ExplorePanel( screenView, options ) {

    options = _.extend( {
      fill: MakeATenConstants.PAPER_NUMBER_REPO_PANEL_BACKGROUND_COLOR,
      stroke: 'black',
      lineWidth: 1.5,
      xMargin: 30,
      yMargin: 5,
      resize: false
    }, options );

    // @private {MakeATenExploreScreenView}
    this.screenView = screenView;

    function createTarget( numberValue ) {
      var node = new Node( {
        cursor: 'pointer',
        // empirically determined stacking
        children: [ new Vector2( -8, -8 ), new Vector2( 0, 0 ) ].map( function( offset ) {
          // TODO: no need to duplicate these types of images?
          var image = new Image( PaperNumberNode.getNumberImage( numberValue ) );
          image.scale( 0.64, 0.55 );
          image.translation = offset;
          return image;
        } )
      } );

      node.addInputListener( {
        down: function( event ) {
          // Ignore non-left mouse buttons
          if ( event.pointer.isMouse && event.domEvent && event.domEvent.button !== 0 ) {
            return;
          }

          // We want this relative to the screen view, so it is guaranteed to be the proper view coordinates.
          var viewPosition = screenView.globalToLocalPoint( event.pointer.point );

          // Create and start dragging the new paper number node
          screenView.createAndDragNumber( event, numberValue, viewPosition );
        }
      } );

      return node;
    }

    this.hundredTarget = createTarget( 100 );
    this.tenTarget = createTarget( 10 );
    this.oneTarget = createTarget( 1 );

    var box = new HBox( {
      children: [
        this.hundredTarget,
        this.tenTarget,
        this.oneTarget
      ],
      spacing: 30
    } );

    Panel.call( this, box, options );
  }

  makeATen.register( 'ExplorePanel', ExplorePanel );

  return inherit( Panel, ExplorePanel, {
    getOriginLocation: function( digits ) {
      var target;
      switch ( digits ) {
        case 1:
          target = this.oneTarget; break;
        case 2:
          target = this.tenTarget; break;
        case 3:
          target = this.hundredTarget; break;
        default:
          // Probably something big, no better place to send it
          target = this.hundredTarget;
      }
      return this.screenView.getUniqueLeafTrailTo( this ).localToGlobalPoint( target.center );
    }
  } );
} );