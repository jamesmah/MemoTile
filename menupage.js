for (var i = 0; i < 9; i++) {
  $( '#redchar-select img:eq(' + i + ')' ).hover(redHoverOn, redHoverOff);
  $( '#bluechar-select img:eq(' + i + ')' ).hover(blueHoverOn, blueHoverOff);

  $( '#redchar-select img:eq(' + i + ')' ).click(onClickRed);
  $( '#bluechar-select img:eq(' + i + ')' ).click(onClickBlue);
}

function redHoverOn() {
  var tileNumber = $( '#redchar-select img' ).index( $(event.target) );
  // $(event.target).attr("src","images/red" + tileNumber + ".svg");
  // console.log(tileNumber);
  $(event.target).width('120%');
  $(event.target).css('transform', 'translate(-10%, -10%)');
}

function redHoverOff() {
  var tileNumber = $( '#redchar-select img' ).index( $(event.target) );
  if (tileNumber !== shapeRed) {
    // $(event.target).attr("src","images/red" + tileNumber + ".svg");
    $(event.target).width('70%');
    $(event.target).css('transform', 'translate(0%, 15%)');
  }
}

function blueHoverOn() {
  var tileNumber = $( '#bluechar-select img' ).index( $(event.target) );
  // $(event.target).attr("src","images/blue" + tileNumber + ".svg");

  $(event.target).width('120%');
  $(event.target).css('transform', 'translate(-10%, -10%)');
}

function blueHoverOff() {
  var tileNumber = $( '#bluechar-select img' ).index( $(event.target) );
  if (tileNumber !== shapeBlue) {
    // $(event.target).attr("src","images/blue" + tileNumber + ".svg");

    $(event.target).width('70%');
    $(event.target).css('transform', 'translate(0%, 15%)');
  }
}

function onClickRed() {
  var tileNumber = $( '#redchar-select img' ).index( $(event.target) );
  

  // $('#redchar-select img:eq(' + shapeRed + ')').attr("src","images/red" + shapeRed + ".svg");
  if (tileNumber !== shapeRed) {
    $('#redchar-select img:eq(' + shapeRed + ')').width('80%');
    $('#redchar-select img:eq(' + shapeRed + ')').css('transform', 'translate(0%, 10%)');
  }

  // $(event.target).attr("src","images/red" + tileNumber + ".svg");
  shapeRed = tileNumber;

  displayScoreTilesNoEffect();

  for(var i = 0; i < grid.length; i++){
    for(var j = 0; j < grid.length; j++){
      
      var tileNumberCount = i*grid.length + j;


      if ( grid.array[i][j] === 'red') {
        // console.log('hi');
        // $newTileDiv.text(game.array[i][j]);
        $( '#game-board img:eq(' + tileNumberCount + ')' ).attr("src","images/red" + shapeRed + ".svg");
        // $newTileDiv.css('background-color','red');
      }
    }
  }

}


function onClickBlue() {
  var tileNumber = $( '#bluechar-select img' ).index( $(event.target) );
  
  // $('#bluechar-select img:eq(' + shapeBlue + ')').attr("src","images/blue" + shapeBlue + ".svg");

  // $(event.target).attr("src","images/blue" + tileNumber + ".svg");

  if (tileNumber !== shapeBlue) {
    $('#bluechar-select img:eq(' + shapeBlue + ')').width('80%');
    $('#bluechar-select img:eq(' + shapeBlue + ')').css('transform', 'translate(0%, 10%)');
  }
  shapeBlue = tileNumber;

  displayScoreTilesNoEffect();

  for(var i = 0; i < grid.length; i++){
    for(var j = 0; j < grid.length; j++){
      
      var tileNumberCount = i*grid.length + j;


      if ( grid.array[i][j] === 'blue') {
        $( '#game-board img:eq(' + tileNumberCount + ')' ).attr("src","images/blue" + shapeBlue + ".svg");
      }
    }
  }
}

$( '#redchar-select').hover(function() {
  $('body').css('cursor', 'url(images/mouse1.png), auto');
}, function() {
  if( game.turn > 0 && players[game.turn].color === 'blue' ) {
    $('body').css('cursor', 'url(images/mouse2.png), auto');
  }
});


$( '#bluechar-select').hover(function() {
  $('body').css('cursor', 'url(images/mouse2.png), auto');
}, function() {
  if( game.turn > 0 && players[game.turn].color === 'red' ) {
    $('body').css('cursor', 'url(images/mouse1.png), auto');
  }
});


for (var i = 0; i < 3; i++) {
  $( '#gamemode-select div:eq(' + i + ')' ).hover(gamemodeHoverOn, gamemodeHoverOff);
  $( '#gamemode-select img:eq(' + i + ')' ).hover(function(){}, gamemodeHoverOff2);
  $( '#gamemode-select div:eq(' + i + ')' ).click(onClickGame);
}

function gamemodeHoverOn() {
  var tileNumber = $( '#gamemode-select div' ).index( $(event.target) );
  // $(event.target).attr("src","images/grid" + tileNumber + ".png");
  $(event.target).find('img').slideDown();
}

function gamemodeHoverOff() {
  var tileNumber = $( '#gamemode-select div' ).index( $(event.target) );
  $(event.target).find('img').slideUp();
}

function gamemodeHoverOff2() {
  var tileNumber = $( '#gamemode-select img' ).index( $(event.target) );
  $(event.target).slideUp();
}

function onClickGame() {
  // console.log($(event.target));
  var tileNumber = $( '#gamemode-select > div' ).index( $(event.target) );
  // console.log(tileNumber);
  if (tileNumber === -1) {
    tileNumber = $( '#gamemode-select img' ).index( $(event.target) );
    // console.log(tileNumber);
  }
  if (tileNumber === -1) {
    tileNumber = $( '#gamemode-select span' ).index( $(event.target) );
    // console.log(tileNumber);
  }
  

  if (tileNumber !== -1) {
    // $(event.target).attr("src","images/game" + tileNumber + ".png");
    // $(event.target).find('img').slideUp();
    grid.length = tileNumber + 3;

    $('#menu-page').slideUp();
    $('#menu-button, #score-red, #score-blue, #crown').fadeIn();
    $('#right-section').fadeIn();
    $('#tilesleft-red img').fadeOut();
    $('#tilesleft-blue img').fadeOut();
    // $('#tilesleft-red img').remove();
    // $('#tilesleft-blue img').remove();
    newGameMode();

    if( players[game.turn].color === 'red' ) {
      $('body').css('cursor', 'url(images/mouse2.png), auto');
    }
    else {
      $('body').css('cursor', 'url(images/mouse1.png), auto');
    }

  }
}

// MENU BUTTON
$('#menu-button').click(function() {
  if ( $('#menu-page').css('display') === 'none') {
    // $('#menu-page').show();
    $('#menu-page').slideDown();
  }
  else {
    // $('#menu-page').hide();
    $('#menu-page').slideUp();
  }
});

$('#menu-button').hover(function() {
  $('#menu-button img').attr("src","images/gear2.png");
}, function(){
  
  $('#menu-button img').attr("src","images/gear1.png");
});


// SWITCH TURN BUTTON
// $('#switch-turn').click(function() {
//   $('#switch-turn').hide();
//   game.start = true;
// });

// $('#left-section, #right-section').click(function() {
//   if (game.turn !== 0 && $('#menu-page').css('display') === 'block'){
//     $('#menu-page').fadeOut();
//   }
// });

var body = document.querySelector('body');

// On key press, perform this function
body.onkeydown = function (e) {
  if ( !e.metaKey ) {
    e.preventDefault();
  }
  var music = document.getElementsByTagName("audio")[0];
  if (e.keyCode > 48 && e.keyCode<=57) {
      music.volume = (e.keyCode - 48) / 10;
      music.play();
  }
  else if (e.keyCode === 48 ) {
      music.pause();
      music.currentTime = 0;
  }
};

