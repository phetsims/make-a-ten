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
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Vector2 = require( 'DOT/Vector2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Panel = require( 'SUN/Panel' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PaperNumberNode = require( 'MAKE_A_TEN/make-a-ten/common/view/PaperNumberNode' );
  var PaperNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/PaperNumber' );
  var MakeATenConstants = require( 'MAKE_A_TEN/make-a-ten/common/MakeATenConstants' );

  var MAX_SUM = 9999;

  /**
   * @constructor
   *
   * @param {MakeATenExploreScreenView} screenView
   * @param {NumberProperty} sumProperty
   * @param {Object} [options] - Passed to Node
   */
  function ExplorePanel( screenView, sumProperty, options ) {

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

      // We need to be disabled if adding this number would increase the sum past the maximum sum.
      new DerivedProperty( [ sumProperty ], function( sum ) {
        return sum + numberValue <= MAX_SUM;
      } ).linkAttribute( node, 'visible' );

      node.addInputListener( {
        down: function( event ) {
          // Ignore non-left mouse buttons
          if ( event.pointer.isMouse && event.domEvent && event.domEvent.button !== 0 ) {
            return;
          }

          // We want this relative to the screen view, so it is guaranteed to be the proper view coordinates.
          var viewPosition = screenView.globalToLocalPoint( event.pointer.point );
          var paperNumber = new PaperNumber( numberValue, new Vector2() );

          // Once we have the number's bounds, we set the position so that our pointer is in the middle of the drag target.
          paperNumber.setDestination( viewPosition.minus( paperNumber.getDragTargetOffset() ), false );

          // Create and start dragging the new paper number node
          screenView.addAndDragNumber( event, paperNumber );
        }
      } );

      return node;
    }

    // @private {Node}
    this.hundredTarget = createTarget( 100 );

    // @private {Node}
    this.tenTarget = createTarget( 10 );

    // @private {Node}
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
    /**
     * Given a specified number of digits for a paper number, return the view coordinates of the closest matching
     * target, so that it can animate back to this location.
     * @public
     *
     * @param {number} digits
     * @returns {Vector2}
     */
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

      // Trail to screenView, not including the screenView
      var trail = this.screenView.getUniqueLeafTrailTo( target );
      trail = trail.slice( 1, trail.length );

      // Transformed to view coordinates
      return trail.localToGlobalPoint( target.localBounds.center );
    }
  } );
} );
