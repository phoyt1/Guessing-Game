function generateWinningNumber(){
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}

function shuffle(array){
    var m = array.length, t, i;
    while (m){
        i = Math.floor(Math.random()*m--);

        t = array[m];
        array[m] = array[i];
        array[i] = t;
        
    }
    return array;
}

var Game = function(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this. winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}
Game.prototype.isLower = function(){
    return this.playersGuess < this.winningNumber;
}
Game.prototype.playersGuessSubmission = function(input){
    if(input > 0 && input <= 100){
        this.playersGuess = input;
        return this.checkGuess();
    }else{
        return "That is an invalid guess.";
    }
}

Game.prototype.checkGuess = function(input){ 
    if(this.playersGuess === this.winningNumber){
        // disable buttons
        $('#submit, #hint').prop("disabled", true);
        $('#subtitle').text(this.winningNumber+' trains were on time.');
        return 'You Win!';
    }else if(this.pastGuesses.includes(this.playersGuess)){
        return 'You have already guessed that number.';
    }else{
        this.pastGuesses.push(this.playersGuess);
        $('.guess-list').children().eq(this.pastGuesses.length-1).text(this.playersGuess);
        if(this.playersGuess > this.winningNumber){
            $('#subtitle').text('Guess lower!');
        }else{
            $('#subtitle').text('Guess higher!');
        }
        if(this.pastGuesses.length >= 5){
            $('#subtitle').text('Click the Reset button!');
            // disable buttons
            $('#submit, #hint').prop("disabled", true);
            return 'You Lose.';
        }
        else{
            var diff = this.difference();
            if(diff < 10){return "You're burning up!"}
            else if(diff < 25){return 'You\'re lukewarm.';}
            else if(diff < 50){return 'You\'re a bit chilly.';}
            else {return 'You\'re ice cold!';}
        }
    }
}

var newGame = function(){
    return new Game();
}

Game.prototype.provideHint = function(){
    var arr = [this.winningNumber,generateWinningNumber(),generateWinningNumber()];
    return shuffle(arr);
}

$(document).ready(function(){
    var game = newGame();

    function processInput(){
        var guess = parseInt($('#player-input').val(),10);
        var output = game.playersGuessSubmission(guess);
        $('#player-input').val('');
        $('#title').text(output);
    }

    $('#submit').click(function(){
        processInput();    
    });
    
    $('#player-input').keypress(function(e) {
        if(e.which == 13) {
            processInput();
        }
    });

    $('#reset').click(function(){
        game = newGame();   
        $('#title').text('How Many Trains Were On Time Today?');
        $('#subtitle').text('Guess a number between 1-100!');
        $('.guess').text('-');
        $('#submit, #hint').prop("disabled", false);
    });
    $('#hint').click(function(){
        var hints = game.provideHint();
        $('#title').text('The answer is '+hints[0]+', '+hints[1]+', or '+hints[2]);
        $('#subtitle').text('You only get one hint :)');
        $('#hint').prop("disabled", true);
    });

});