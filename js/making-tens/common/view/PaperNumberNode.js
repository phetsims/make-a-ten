// Copyright 2002-2013, University of Colorado Boulder

/**
 *
 * Represents the view of the PaperNumberModel.
 * It uses one or more number images based on the "Tens" in a given number.
 * These collections of images are positioned in a way to give "stacked" appearance
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PaperImageCollection = require( 'MAKING_TENS/making-tens/common/model/PaperImageCollection' );
  var Vector2 = require( 'DOT/Vector2' );

  // how much 2 digit and single digit must offset from parent
  var NUMBER_IMAGE_OFFSET_DIMENSIONS = {
    2: new Vector2( 50, 50 ),
    1: new Vector2( 55, 22 ),
    0: new Vector2( 0, 0 )
  };

  /**
   *
   * @param {PaperNumberModel} paperNumberModel
   * @constructor
   */
  function PaperNumberNode( paperNumberModel ) {
    var thisNode = this;
    Node.call( thisNode );

    var imageNumberNode = new Node();
    thisNode.addChild( imageNumberNode );

    paperNumberModel.numberValueProperty.link( function( newNumber ) {
      var baseNumbers = paperNumberModel.baseNumbers;
      imageNumberNode.removeAllChildren();
      var paperNumberPos = paperNumberModel.position;
      var offsetX = 0;
      var offsetY = 0;
      var index = 1;
      var opacityValue = 1;
      _.each( baseNumbers, function( baseNumber ) {
        var baseNumberImage = PaperImageCollection.getNumberImageNode( baseNumber );
        var baseNumberImageNode = new Image( baseNumberImage, { x: paperNumberPos.x, y: paperNumberPos.y } );
        imageNumberNode.addChild( baseNumberImageNode );
        baseNumberImageNode.opacity = opacityValue;
        baseNumberImageNode.left = offsetX;
        baseNumberImageNode.top = offsetY;
        var offSetIndex = baseNumbers.length - index;
        offsetX += NUMBER_IMAGE_OFFSET_DIMENSIONS[ offSetIndex ].x;
        offsetY += NUMBER_IMAGE_OFFSET_DIMENSIONS[ offSetIndex ].y;
        index++;
        opacityValue = opacityValue - 0.03;
      } );

    } );

  }

  return inherit( Node, PaperNumberNode );
} );

