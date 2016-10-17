$('html').css('cursor', 'url(./images/mouse-red.png), auto'); // Nice cursor!
var timeOuts = []; // Keep track of the timeOuts used for effects

 // Game information
var game = {firstRound: true, // First time chosing a grid size
            enableWinDisplay: false, // Prevent player from accidentally starting next round too quickly
            turnColorId: 0, // Current player turn
            otherColorId: 1,
            pStartColorId: 0, // Player who started the round
            pNextColorId: 1
            };

// Grid information
var grid = {array: [], // 1D array
            opened: [], // 1D array
            size: 0, // Length of 1D array
            length: 0 // Length of rows/cols
            };

// Initialise players            
var players = [new newPlayer('red'), new newPlayer('blue')];
function newPlayer(color) {
  this.color = color;
  this.character = 1; // Initial pokemon
  this.score = 0;
  this.tilesMax = 0;
  this.tilesLeft = 0;
}

// Update the size of the initial pokemon in the menu
$.each(players, function(i, player) {
  $('#characters-' + player.color + ' > img:eq(' + player.character + ')')
    .toggleClass('scale-160 hover-scale-160');
});


$('.characters').hover(function() {
  var colorId = $('.characters').index($(event.target).closest('.characters'));
  $('html').css('cursor', 'url(./images/mouse-' + players[colorId].color + '.png), auto');
}, function() {
  if (!game.firstRound) {
    $('html').css('cursor', 'url(./images/mouse-' + players[game.turnColorId].color + '.png), auto');
  }
});

// Grid image hover effect
$('.gridsize').hover(function() {
  $(this).find('img').fadeIn(200);
}, function() {
  $(this).find('img').fadeOut(200);
});

// Generate and display board after clicking on start screen
$('#clickheretostart').click(function() {
  if (game.enableWinDisplay) {
    game.enableWinDisplay = false;
    $('#display-win').fadeOut(); // Hide start screen
    grid.opened = [];
    grid.array = initArray(game.pStartColorId, game.pNextColorId, players[game.otherColorId].tilesMax);
    placeGridTiles(grid.array, grid.length, players);
    $('.tilesleft > img').remove();
    displayTilesLeft(players[0]);
    displayTilesLeft(players[1]);
    $('#display-grid > div > img, .tilesleft').hide().fadeIn();
    setTimeout(function() {
      $('#display-grid > div > img').fadeOut();
    }, grid.length * grid.length * grid.length * 20 + 100);
    setTimeout(function() {
      $('#display-grid > div').addClass('hover-' + players[game.pStartColorId].color);
      initGridButtons();
    }, grid.length * grid.length * grid.length * 20 + 700); 
  }
});

// Open and close menu
$('#button-menu').click(function() {
  toggleDisplayMenu();
});

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
  }
});

$('#button-score').click(function() {
  displayScore(0, 0);
  displayScore(1, 0);
});

$('.gridsize').click(function() {
  $('.tilesleft > img').fadeOut();
  randTurnStart();
  $('html').css('cursor', 'url(./images/mouse-' + players[game.turnColorId].color + '.png), auto');
  var gridId = $('.gridsize').index($(event.target).closest('.gridsize'));
  grid.length = gridId + 3;
  grid.size = (gridId + 3) * (gridId + 3);
  toggleDisplayMenu();
  $('aside#left *').fadeIn();
  $('#player-wins').text('');
  placeGridTiles(grid.array, grid.length, null);
  newGame();
  game.firstRound = false;
});

// Place a random starting player for a new game mode
function randTurnStart() {
  var firstToStart = Math.floor(Math.random() * 2);
  game.turnColorId = firstToStart;
  game.otherColorId = (firstToStart + 1) % 2;
  game.pStartColorId = firstToStart;
  game.pNextColorId = (firstToStart + 1) % 2;
}

// Update the player details after initialising grid size
function initTilesMax() {
  $.each(players, function(i, player) {
    player.tilesMax = Math.floor(grid.size/2);
    player.tilesLeft = player.tilesMax;
  });
  players[game.pStartColorId].tilesMax += grid.size % 2;
  players[game.pStartColorId].tilesLeft = players[game.pStartColorId].tilesMax;
}

// Initialise new game, show starting screen
function newGame() {
  $('#display-win').fadeOut(200);
  $('#clickheretostart').removeClass('hover-scale-120');
  initTilesMax();
  setTimeout(function(){
    $('#player-start').text(players[game.pStartColorId].color.toUpperCase() + ' START');
    $('#player-start').css('color', players[game.pStartColorId].color);
    $('#display-win').fadeIn();
  }, 200);
  setTimeout(function(){
    game.enableWinDisplay = true;
    $('#clickheretostart').addClass('hover-scale-120');
  }, 600);
}

function initGridButtons() {
  $('#display-grid > div').click(function() {
    var tileNumber = $( '#display-grid > div' ).index($(this));
    var colorId = grid.array[tileNumber];
    var player = players[colorId];
    if (grid.opened[tileNumber] !== true) {
      $(this).removeClass('hover-red hover-blue');
      $(this).find('img').fadeIn().addClass('hopping');
      grid.opened[tileNumber] = true;
      $('#tilesleft-' + player.color + ' > img:eq(' + (player.tilesLeft - 1) + ')').fadeOut();
      // Player wins if there are no tiles left
      if ( --player.tilesLeft === 0) {
        winRound(player, colorId);
      }
      // Switch player if opened the wrong grid
      else if (colorId !== game.turnColorId) {
        switchTurn(game.otherColorId);
        displaySwitchturn();
      }
    }
  });
}

function winRound(player, colorId) {
  player.score++;
  displayScore(colorId, player.score);
  $('#player-wins').text(player.color.toUpperCase() + ' WINS!')
                   .css('color', player.color);
  //Update next round player starting turns
  game.pNextColorId = game.pStartColorId;
  game.pStartColorId = (game.pStartColorId + 1) % 2;
  switchTurn(game.pStartColorId);
  newGame();
}

// Switch turn to input colorId
function switchTurn(colorId) {
  game.turnColorId = colorId;
  game.otherColorId = (colorId + 1) % 2;
  $('.hover-red, .hover-blue').toggleClass('hover-red hover-blue');
  $('html').css('cursor', 'url(./images/mouse-' + players[game.turnColorId].color + '.png), auto');
}

function displaySwitchturn() {
  var playerColor = players[game.turnColorId].color;
  $('#player-turn').text(playerColor.toUpperCase() + '\'S TURN')
                   .css('color', playerColor);
  $('#display-switchturn').fadeIn();
  setTimeout(function() {
    $('#display-switchturn').fadeOut();
  },1000);
}

// Display right aside section
function displayTilesLeft(player) {
  for (var i = 0; i < player.tilesLeft; i++) {
    var $newImg = $('<img>');
    $newImg.attr("src","./images/" + player.color + player.character + ".svg");
    $('#tilesleft-' + player.color).append($newImg);
  }
}

// Initialise array with random placement of player characters
function initArray(pStart, pOther, pOtherMax) {
  var array = [];
  for (var i = 0; i < grid.size; i++) {
    array[i] = pStart;
  }
  var pOtherTileCount = 0;
  var tempRand;
  while (pOtherTileCount < pOtherMax) {
    tempRand = Math.floor(Math.random() * grid.size);
    if (array[tempRand] !== pOther) {
      array[tempRand] = pOther;
      pOtherTileCount++;
    }
  }
  return array;
}

function placeGridTiles(array, gridLength, players) {
  $('#display-grid > div').remove();
  for(var i = 0; i < grid.size; i++){
    var $newTileDiv = $('<div><img></div>');
    $newTileDiv.find('img').hide();
    if (players !== null) {
      $newTileDiv.find('img').attr("src","./images/" + players[array[i]].color + players[array[i]].character + ".svg");
    }
    $('#display-grid').append($newTileDiv);
  }
  $('#display-grid > div').width('calc(' + (100 - (gridLength * 2) ) + '% / ' + gridLength + ')');
  $('#display-grid > div').height('calc(' + (100 - (gridLength * 2) ) + '% / ' + gridLength + ')');
}

// Open and closing of menu, and rotation of menu button
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

// Update scoreboard of a single color
function displayScore(colorId, score) {
  var scoreDIV = $('.score:eq(' + colorId + ')');
  scoreDIV.slideUp(500);
  setTimeout(function() {
    players[colorId].score = score; // Global
    scoreDIV.text(score).slideDown(500);
  },500);
}

//update to new charImg without effects
function updateCharImg(colorId) {
  // colorId is 0(red) or 1(blue)
  // Update right aside imgs
  $('.tilesleft:eq(' + colorId + ') > img').attr('src','./images/' + players[colorId].color + players[colorId].character + '.svg');

  // Update display grid images
  for(var i = 0; i < grid.size; i++){
    if ( grid.array[i] === colorId) {
      $( '#display-grid img:eq(' + i + ')' ).attr("src","./images/" + players[colorId].color + players[colorId].character + ".svg");
    }
  }
}
