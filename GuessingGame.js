function generateWinningNumber(){
  return Math.floor(Math.random() * (101 - 1) + 1);
}

function shuffle(array){
  var len = array.length
 // While there remain elements to shuffle…
 while (len) {
   // Pick a remaining element…
   var toShuffle = Math.floor(Math.random() * len--);
   // And swap it with the current element.
   var temp = array[len];
   array[len] = array[toShuffle];
   array[toShuffle] = temp;
 }
 return array;
}

function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
  if(this.playersGuess < this.winningNumber){
    return true;
  } else{
    return false;
  }
}

Game.prototype.playersGuessSubmission = function(num){
  this.playersGuess = num;
  if( num > 100 || num < 1 || typeof num != "number"){
    throw "That is an invalid guess."
  } else{
      return this.checkGuess();
  }
}

Game.prototype.checkGuess = function(){
  var highLow = "";
  if(this.playersGuess === this.winningNumber){
      disableGame();
      return "You Win!";
  } else if (this.pastGuesses.includes(this.playersGuess)){
      this.pastGuesses.push(this.playersGuess);
      return "You have already guessed that number.";
  } else if(this.pastGuesses.length >= 4){
      disableGame();
      return "You Lose.";
  } else {
    this.pastGuesses.push(this.playersGuess);
      if(this.difference() < 10){
        return "You're burning up!";
      } else if(this.difference() < 25){
        return "You're lukewarm.";
      } else if(this.difference() < 50){
        return "You're a bit chilly.";
      } else if(this.difference() < 100){
        return "You're ice cold!";
      }
  }
}

function newGame(){
  return new Game();
}

//TODO this passes all tests but fails in practice. Need to debug.
Game.prototype.provideHint = function(){
  var hintArray = new Array(3);

  hintArray[0] = this.winningNumber;
  hintArray[1] = generateWinningNumber();
  hintArray[2] = generateWinningNumber();

  return shuffle(hintArray);
}

function makeAGuess(game) {
    var guess = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $("#title").text(output);

    var lowerOrHigher = getLowerOrHigher(game);
    $("#subtitle").text(lowerOrHigher);

    if($("#guess1").text() === "-"){
      $("#guess1").text(guess);
    } else if($("#guess2").text() === "-"){
      $("#guess2").text(guess);
    } else if($("#guess3").text() === "-") {
      $("#guess3").text(guess);
    } else if($("#guess4").text() === "-"){
      $("#guess4").text(guess);
    }

}

function getLowerOrHigher(game){
  if(game.isLower()){
    return "Guess higher.";
  } else {
    return "Guess lower.";
  }
}

function disableGame(){
  $('#subtitle').text("Hit reset to play again.");
   $('#hint-btn, #submit-btn').prop("disabled",true);
}

$(document).ready(function() {
  var game = new Game();
  $('#submit-btn').click(function(e) {
   makeAGuess(game);
  });

  $('#player-input').keypress(function(event) {
        if ( event.which == 13 ) {
           makeAGuess(game);
        }
    })

    $('#reset-btn').click(function(e){
      game = new Game();
      $('#hint-btn, #submit-btn').prop("disabled",false);
      $('#title').text("Guessing Game");
      $('#subtitle').text("Choose a number between 1 - 100!");
      $('#guess1').html("-");
      $('#guess2').text("-");
      $('#guess3').text("-");
      $('#guess4').text("-");
    })

    $('#hint-btn').click(function(e){
      $('#title').text(game.provideHint);
    })
 });
