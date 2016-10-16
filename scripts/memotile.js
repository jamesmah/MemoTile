var game = {start: false,
            turnColorId: 0,
            otherColorId: 1,
            pStartColorId: 0,
            pNextColorId: 1
            };

function randTurnStart() {
  var firstToStart = Math.floor(Math.random() * 2);
  game.turnColorId = firstToStart;
  game.otherColorId = (firstToStart + 1) % 2;
  game.pStartColorId = firstToStart;
  game.pNextColorId = (firstToStart + 1) % 2;
}

var players = [new newPlayer('red'), new newPlayer('blue')];
$.each(players, function(i, player) {
  $('#characters-' + player.color + ' > img:eq(' + player.character + ')')
    .toggleClass('scale-160 hover-scale-160');
});

function newPlayer(color) {
  this.color = color;
  this.character = 1; // Initial pokemon
  this.score = 0;
  this.tilesMax = 0;
  this.tilesLeft = 0;
}


var grid = {array: [], // ij array of tiles
            opened: [], // using tileNumbers
            length: 0, // length
            size: 0, // total tiles
            };


function initTilesMax(players, gridSize, pOther) {
  $.each(players, function(i, player) {
    player.tilesMax = Math.floor(gridSize/2);
    player.tilesLeft = player.tilesMax;
  });
  players[pOther].tilesMax += gridSize % 2;
  players[pOther].tilesLeft = players[pOther].tilesMax;
}


$('html').css('cursor', 'url(images/mouse-' + players[game.turnColorId].color + '.png), auto');



function newGame() {
  $('#display-win').fadeOut();
  initTilesMax(players, grid.size, game.pStartColorId);
  grid.array = initArray(grid.size, game.pStartColorId, game.pNextColorId, players[game.otherColorId].tilesMax);
  grid.opened = [];

  $('#player-start').text(players[game.pStartColorId].color.toUpperCase() + ' START');
  $('#player-start').css('color',players[game.pStartColorId].color);
  $('#display-win').fadeIn();
  
}

$('#display-win').click(function() {
  game.start = true;
  placeGridTiles(grid.array, grid.length, players);
  displayTilesLeft(players, game.turnColorId, game.otherColorId);
  $('#display-grid > div > img, .tilesleft').hide();
  $('#display-win').fadeOut();
  $('#display-grid > div > img, .tilesleft').fadeIn();
  setTimeout(function() {
    $('#display-grid > div > img').fadeOut();
  }, grid.length * grid.length * grid.length * 20 + 100);
  setTimeout(function() {
    $('#display-grid > div').addClass('hover-' + players[game.pStartColorId].color);
    initGridButtons();
  }, grid.length * grid.length * grid.length * 20 + 700);
});



function initGridButtons() {
  $('#display-grid > div').click(function() {
    var tileNumber = $( '#display-grid > div' ).index($(event.target).closest('div'));
    $('#display-grid > div:eq(' + tileNumber + ')').removeClass('hover-red hover-blue');
    $('#display-grid > div:eq(' + tileNumber + ') > img').addClass('hopping');
    $('#display-grid > div > img:eq(' + tileNumber + ')').fadeIn();

    if (grid.opened[tileNumber] !== true) {
      grid.opened[tileNumber] = true;
      $('#tilesleft-' + players[grid.array[tileNumber]].color + ' > img:eq(' + (players[grid.array[tileNumber]].tilesLeft - 1) + ')').fadeOut();
      if ( --players[grid.array[tileNumber]].tilesLeft === 0) {
        players[grid.array[tileNumber]].score++;
        $('#player-wins').text(players[grid.array[tileNumber]].color.toUpperCase() + ' WINS!');
        $('#player-wins').css('color',players[grid.array[tileNumber]].color);
        displayScore(grid.array[tileNumber], players[grid.array[tileNumber]].score);
        switchTurn(game.pNextColorId);
        game.pNextColorId = game.pStartColorId;
        game.pStartColorId = (game.pStartColorId + 1) % 2;
        newGame();
      }
      else if (grid.array[tileNumber] !== game.turnColorId) {
        displaySwitchturn();
      }
    }
  });
}


// switch to input colorId
function switchTurn(colorId) {
  game.turnColorId = colorId;
  game.otherColorId = (colorId + 1) % 2;
  $('.hover-red, .hover-blue').toggleClass('hover-red hover-blue');
  $('html').css('cursor', 'url(images/mouse-' + players[game.turnColorId].color + '.png), auto');
}

function displaySwitchturn() {
  switchTurn(game.otherColorId);
  $('#player-turn').text(players[game.turnColorId].color.toUpperCase() + '\'S TURN');
  $('#player-turn').css('color',players[game.turnColorId].color);
  $('#display-switchturn').fadeIn();
  setTimeout(function() {
    $('#display-switchturn').fadeOut();
  },1000);
}


function displayTilesLeft(players, pTurn, pOther) {
  $('.tilesleft > img').remove();
  
  for (var i = 0; i < players[0].tilesLeft; i++) {
    var $newImg = $('<img>');
    $newImg.attr("src","images/" + players[0].color + players[0].character + ".svg");
    $('#tilesleft-' + players[0].color).append($newImg);
  }

  for (var j = 0; j < players[1].tilesLeft; j++) {
    var $newImg = $('<img>');
    $newImg.attr("src","images/" + players[1].color + players[1].character + ".svg");
    $('#tilesleft-' + players[1].color).append($newImg);
  }

}


function initArray(gridSize, pStart, pOther, pOtherMax) {
  var array = [];
  for (var i = 0; i < gridSize; i++) {
    array[i] = pStart;
  }
  var pOtherTileCount = 0;
  var tempRand;
  while (pOtherTileCount < pOtherMax) {
    console.log(pOtherTileCount);
    tempRand = Math.floor(Math.random() * grid.size);
    if (array[tempRand] !== pOther) {
      array[tempRand] = pOther;
      pOtherTileCount++;
    }
  }
  return array;
}


$('.gridsize').hover(function() {
  $(this).find('img').fadeIn(200);
}, function() {
  $(this).find('img').fadeOut(200);
});

$('#button-menu').click(function() {
  toggleDisplayMenu();
});



function placeGridTiles(array, gridLength, players) {
  $('#display-grid > div').remove();

  for(var i = 0; i < grid.size; i++){
    var $newTileDiv = $('<div><img></div>');

    if (players !== null) {
      $newTileDiv.find('img').attr("src","images/" + players[array[i]].color + players[array[i]].character + ".svg");
    }
    // $newTileDiv.addClass('hover-red');
    // $newTileDiv.find('img').addClass('hopping');
    $('#display-grid').append($newTileDiv);
  }
  $('#display-grid > div').width('calc(' + (100 - (gridLength * 2) ) + '% / ' + gridLength + ')');
  $('#display-grid > div').height('calc(' + (100 - (gridLength * 2) ) + '% / ' + gridLength + ')');
}



function toggleDisplayMenu() {
  if ( $('#display-menu').css('display') === 'none') {
    clearTimeOuts();
    $('#button-menu').attr('class','button rotate180cw');
    $('#display-menu').slideDown(600);
    delayClass($('#button-menu'), 'button rotated180cw', 1000);
    delayClass($('#button-menu'), 'button rotated180cw hover-scale-110inv', 1100);
  }
  else {
    clearTimeOuts();
    $('#button-menu').attr('class','button rotate180ccw');
    $('#display-menu').slideUp();
    delayClass($('#button-menu'), 'button', 1000);
    delayClass($('#button-menu'), 'button hover-scale-110', 1100);
  }
}

var timeOuts = [];

function delayClass($element, className, duration) {
  timeOuts.push(setTimeout(function() {
    $element.attr('class', className);
  },duration));
}

function clearTimeOuts() {
  for (var i = 0; i < timeOuts.length; i++) {
    clearTimeout(timeOuts[i]);
  }
  timeOuts = [];
}



// ASIDE LEFT // ASIDE LEFT // ASIDE LEFT
$('#button-score').click(function() {
  displayScore(0, 0);
  displayScore(1, 0);
});

function displayScore(colorId, score) {
  var scoreDIV = $('.score:eq(' + colorId + ')');
  scoreDIV.slideUp(500);
  setTimeout(function() {
    players[colorId].score = score; // Global
    scoreDIV.text(score).slideDown(500);
  },500);
}


// DISPLAY MENU // DISPLAY MENU // DISPLAY MENU 
$('.characters img').click(function () {
  var colorId = $('.characters').index($(event.target).closest('.characters'));
  var tileNumber = $('#characters-' + players[colorId].color + ' > img').index($(event.target));

  if (tileNumber !== players[colorId].character) {
    $('#characters-' + players[colorId].color + ' > img:eq(' + tileNumber + ')')
      .toggleClass('scale-160 hover-scale-160');
    $('#characters-' + players[colorId].color + ' > img:eq(' + players[colorId].character + ')')
      .toggleClass('scale-160 hover-scale-160');
    players[colorId].character = tileNumber;
    updateCharImg(colorId);
    // console.log(colorId);
  }
});


$('.characters').hover(function() {
  var colorId = $('.characters').index($(event.target).closest('.characters'));
  $('html').css('cursor', 'url(images/mouse-' + players[colorId].color + '.png), auto');
}, function() {
  if (game.start) {
    $('html').css('cursor', 'url(images/mouse-' + players[game.turnColorId].color + '.png), auto');
  }
});


$('.gridsize').click(function() {
  randTurnStart();
  $('html').css('cursor', 'url(images/mouse-' + players[game.turnColorId].color + '.png), auto');

  // console.log(event.target);
  var gridId = $('.gridsize').index($(event.target).closest('.gridsize'));
  grid.length = gridId + 3;
  grid.size = (gridId + 3) * (gridId + 3);
  toggleDisplayMenu();
  $('aside *').fadeIn();
  $('#player-wins').text('');
  placeGridTiles(grid.array, grid.length, null);
  newGame();
});

//update to new charImg without effects
function updateCharImg(colorId) {
  if (game.start) {
    // colorId is 0(red) or 1(blue)
    // Update right aside imgs
    $('.tilesleft:eq(' + colorId + ') > img').attr('src','./images/' + players[colorId].color + players[colorId].character + '.svg');

    // Update display grid images
    for(var i = 0; i < grid.size; i++){
      if ( grid.array[i] === colorId) {
        $( '#display-grid img:eq(' + i + ')' ).attr("src","images/" + players[colorId].color + players[colorId].character + ".svg");
      }
    }
  }
}

