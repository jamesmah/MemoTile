var shapeRed = 1;
var shapeBlue = 1;

var game = {start: false, // buttons function only when game has started
            turn: 0, // 'player[1]' or 'player[2]', 0 means not init
            };

var tally = {red: 0,blue: 0};

// [1] or [2] corresponds to who starts the round
var players = [];
players[1] = new newPlayer('',0,0);
players[2] = new newPlayer('',0,0);

function newPlayer(color, score, maxScore) {
  this.color = color;
  this.score = score;
  this.maxScore = maxScore;
}

var grid = {array: [], // ij array of tiles
            opened: [], // using tileNumbers
            length: 0,
            size: 0, // length^2
            };


$('#win-page').click(function() {
  $('#win-page').fadeOut();
  initGame();
});

// force start
// grid.length = 4;
// $('#menu-page').fadeOut();
// $('#left-section').fadeIn();
// $('#right-section').fadeIn();
// newGameMode();



function newGameMode() {
  game.turn = 0;
  // grid.length = gridLength; 
  // Place grid length here
  
  initPlayers();
  players[1].maxScore = 0;
  players[2].maxScore = 0;
  initGrid();
  displayTiles();
  $('#game-board > div').css('background-color','inherit') ;
  $('#game-board > div').find('img').hide();

  updateGridLength();
  game.turn = 1;

  game.start = false;
  $('#win-display').hide();
  $('#play-button').text(players[2].color.toUpperCase() + ' START');
  $('#play-button').css('color',players[2].color);
  $('#win-page').fadeIn();
  // setTimeout(function() {
  //   $('#win-page').fadeOut();
  // },1000);
  // setTimeout(function() {
  //   initGame();
  // },1000);

  // tally.red = 0;
  // tally.blue = 0;
  // printTally();
}

function initGame() {
  initPlayers(); // requires grid length
  initGrid(); // requires grid length

  displayTiles();
  initGameBoardButtons();
  updateGridLength();

  displayScoreTiles();
  // $('#game-board > div').find('img').hide();
  // $('#right-section').hide();
  // $('#game-board > div').find('img').fadeIn();
  // $('#right-section').fadeIn();
  // show the grid for 3 seconds, then start the game
  setTimeout(function() {
    if( players[game.turn].color === 'red' ) {
      $('body').css('cursor', 'url(images/mouse1.png), auto');
    }
    else {
      $('body').css('cursor', 'url(images/mouse2.png), auto');
    }
    $('#game-board > div').css('background-color','inherit') ;
    $('#game-board > div').find('img').fadeOut(400);
  }, grid.length * grid.length * grid.length * 20);
  setTimeout(function() {
    game.start = true;
  }, grid.length * grid.length * grid.length * 20 + 400);

  game.turn = 1;


  // console.log(players[game.turn].color + "'s turn.");
}

function randomColor() {
  if (Math.random() < 0.5) {
    return 'red';
  }
  else {
    return 'blue';
  }
}

function initPlayers() {
  // if the game is new, choose a random color to start
  if (game.turn === 0) {
    players[1].color = randomColor();
  }
  else { // else, swap the starting player
    players[1].color = otherPlayer(players[1].color);
  }
  players[2].color = otherPlayer(players[1].color);
  players[1].score = 0;
  players[2].score = 0;
  players[1].maxScore = Math.floor( (grid.length * grid.length + 1) / 2);
  players[2].maxScore = Math.floor(grid.length * grid.length / 2);
}

function otherPlayer(player) {
  if (player === 'red') {
    return 'blue';
  }
  else {
    return 'red';
  }
}

function initGrid() {
  grid.length = grid.length;
  grid.size = grid.length * grid.length;
  grid.opened = [];
  grid.array = makeArray();
  // console.log(grid.array);
}

// make a grid of red and blues of equal number and return the array
function makeArray() {
  var array = [];

  // Place player0 color on all grid positions first
  for(var i = 0; i < grid.length; i++){
    var tempRow = [];
    for(var j = 0; j < grid.length; j++){
      tempRow[j] = players[1].color;
    }
    array[i] = tempRow;
  }

  // Place player1 on its total amount of tiles
  var tileCount = 0; // Number of player1 tiles placed already
  while ( tileCount < players[2].maxScore ) {
    var randX = Math.floor( Math.random() * grid.length);
    var randY = Math.floor( Math.random() * grid.length);
    
    if (array[randY][randX] !== players[2].color) {
      array[randY][randX] = players[2].color;
      tileCount++;
    }
  }
  return array;
}



function updateGridLength(){
  // console.log(grid.length);
  $('#game-board > div').width('calc(' + (100 - (grid.length * 2) ) + '% / ' + grid.length + ')');
  // $('#game-board > div').height('calc(' + (100 - (grid.length * 2) ) + '%) / ' + grid.length + ')');
  $('#game-board > div').height('calc(' + (100 - (grid.length * 2) ) + '% / ' + grid.length + ')');
}

function displayTiles() {
  $('#game-board > div').remove();

  for(var i = 0; i < grid.length; i++){
    for(var j = 0; j < grid.length; j++){
      
      var $newTileDiv = $('<div><img></div>');

      if ( grid.array[i][j] === 'red') {
        // $newTileDiv.text(game.array[i][j]);
        $newTileDiv.find('img').attr("src","images/red" + shapeRed + ".svg");
        // $newTileDiv.css('background-color','red');
      }
      else {
        // $newTileDiv.text(game.array[i][j]);
        // $newTileDiv.css('background-color','blue');
        $newTileDiv.find('img').attr("src","images/blue" + shapeBlue + ".svg");
      }
      $('#game-board').append($newTileDiv);
    }
  }
  $('#game-board img').hide();
  $('#game-board img').fadeIn();

}

function initGameBoardButtons() {
  $( '#game-board > div' ).click(function() {
    if (game.start) {
      var tileNumber = $( '#game-board > div' ).index( $(event.target) );
      // console.log(tileNumber);

      if (tileNumber >=0 ) {
        $( '#game-board > div:eq(' + tileNumber + ')' ).css('background-color','inherit');
        var row = Math.floor( ( tileNumber / grid.length) );
        var col = tileNumber % grid.length;

        if (grid.opened[tileNumber] !== true) {
          grid.opened[tileNumber] = true;
          revealTile(col, row, tileNumber);
          checkWinner();
          
          if (grid.array[row][col] !== players[game.turn].color && !checkWinnerNoDisplay()) {
            switchTurn();
            // console.log(game.turn);
            $('#switch-turn span:eq(0)').text(players[game.turn].color + "'s TURN");
            $('#switch-turn span:eq(0)').css('color', players[game.turn].color);
            $('#switch-turn').fadeIn();
            game.start=false;
            setTimeout(function() {
              $('#switch-turn').fadeOut();
              game.start = true;
            }, 1000);
            if( players[game.turn].color === 'red' ) {
              $('body').css('cursor', 'url(images/mouse1.png), auto');
            }
            else {
              $('body').css('cursor', 'url(images/mouse2.png), auto');
            }
          }
        }

      }
    }
  });

  $( '#game-board > div' ).hover(function() {
    // var prevColor;
    var tileNumber = $( '#game-board > div' ).index( $(event.target) );
    // console.log(tileNumber);
    if (game.start && !grid.opened[tileNumber] && tileNumber >= 0) {
      $( '#game-board > div:eq(' + tileNumber + ')' ).css('background-color',players[game.turn].color);
    }
  }, function() {
    var tileNumber = $( '#game-board > div' ).index( $(event.target) );
    // console.log(tileNumber);
    if (game.start && !grid.opened[tileNumber] && tileNumber >= 0) {
      $( '#game-board > div:eq(' + tileNumber + ')' ).css('background-color','inherit');
    }
    
  });
}

function switchTurn() {
  if (game.turn === 1) {game.turn ++;}
  else {game.turn = 1;}
  // console.log(players[game.turn].color + "'s turn.");
}

function checkWinner() {
  for (var i = 1; i <= 2; i++) {
    if (players[i].score === players[i].maxScore) {
      // console.log("the winner is " + players[i].color);
      tally[players[i].color]++;
      printTally(players[i].color);
      $('#win-display').fadeIn().text(players[i].color + ' WINS!');
      $('#win-display').css('color', players[i].color);

      
      $('#play-button').text(players[2].color.toUpperCase() + ' START');
      $('#play-button').css('color', players[2].color);

      $('#win-page').fadeIn();

      $('#switch-turn').fadeOut();
      game.start = false;
      if( players[1].color === 'red' ) {
        $('body').css('cursor', 'url(images/mouse2.png), auto');
      }
      else {
        $('body').css('cursor', 'url(images/mouse1.png), auto');
      }
    }
  }
}

function checkWinnerNoDisplay() {
  for (var i = 1; i <= 2; i++) {
    if (players[i].score === players[i].maxScore) {
      return true;
    }
  }
  return false;
}

function printTally(color) {
  if (color === 'red') {
    $('#score-red').text(tally.red);
    $('#score-red').hide();
    $('#score-red').fadeIn();
  }
  else if (color === 'blue') {
    $('#score-blue').text(tally.blue);
    $('#score-blue').hide();
    $('#score-blue').fadeIn();
  }
  else {
    $('#score-red').text(tally.red);
    $('#score-blue').text(tally.blue);
    $('#score-red, #score-blue').hide();
    $('#score-red, #score-blue').fadeIn();
  }
}

$('#crown').click(function() {
  tally.red = 0;
  tally.blue = 0;
  printTally();
});

function revealTile(col, row, tileNumber) {
  if(grid.array[row][col] === 'red') {
    if (players[1].color === 'red') {
      players[1].score++;
    }
    else {
      players[2].score++;
    }

    $('#tilesleft-red img').last().fadeOut();
    setTimeout(function() {
      $('#tilesleft-red img').last().remove();
    },200);
    $( '#game-board img:eq(' + tileNumber + ')' ).fadeIn();

  }
  else if(grid.array[row][col] === 'blue') {
    if (players[1].color === 'blue') {
      players[1].score++;
    }
    else {
      players[2].score++;
    }
    
    $('#tilesleft-blue img').last().fadeOut();
    setTimeout(function() {
      $('#tilesleft-blue img').last().remove();
    },200);
    $( '#game-board img:eq(' + tileNumber + ')' ).fadeIn();
    
  }
}


function displayScoreTiles() {
  $('#tilesleft-red img').remove();
  $('#tilesleft-blue img').remove();
  // console.log('byt');

  var redPlayer;
  var bluePlayer;
  if (players[1].color === 'red') {
    redPlayer = 1;
    bluePlayer = 2;
  }
  else {
    redPlayer = 2;
    bluePlayer = 1;
  }

  for (var i = players[redPlayer].maxScore; i > players[redPlayer].score; i--) {
    // console.log('hi');
    var $newImg = $('<img>');
    $newImg.attr("src","images/red" + shapeRed + ".svg");
    $('#tilesleft-red').append($newImg);
  }

  for (var j = players[bluePlayer].maxScore; j > players[bluePlayer].score; j--) {
    // console.log('hi');
    var $newImg2 = $('<img>');
    $newImg2.attr("src","images/blue" + shapeBlue + ".svg");
    $('#tilesleft-blue').append($newImg2);
  }
  $('#tilesleft-red img').hide();
  $('#tilesleft-blue img').hide();
  $('#tilesleft-red img').fadeIn();
  $('#tilesleft-blue img').fadeIn();
}

function displayScoreTilesNoEffect() {
  $('#tilesleft-red img').remove();
  $('#tilesleft-blue img').remove();
  // console.log('byt');

  var redPlayer;
  var bluePlayer;
  if (players[1].color === 'red') {
    redPlayer = 1;
    bluePlayer = 2;
  }
  else {
    redPlayer = 2;
    bluePlayer = 1;
  }

  for (var i = players[redPlayer].maxScore; i > players[redPlayer].score; i--) {
    // console.log('hi');
    var $newImg = $('<img>');
    $newImg.attr("src","images/red" + shapeRed + ".svg");
    $('#tilesleft-red').append($newImg);
  }

  for (var j = players[bluePlayer].maxScore; j > players[bluePlayer].score; j--) {
    // console.log('hi');
    var $newImg2 = $('<img>');
    $newImg2.attr("src","images/blue" + shapeBlue + ".svg");
    $('#tilesleft-blue').append($newImg2);
  }
  // $('#tilesleft-red img').hide();
  // $('#tilesleft-blue img').hide();
  // $('#tilesleft-red img').fadeIn();
  // $('#tilesleft-blue img').fadeIn();
}




