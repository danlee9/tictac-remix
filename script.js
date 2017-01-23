/**
 * Created by OF on 9/14/16.
 */

// $(document).ready(function () {
//     initializeAudioVisualizer(document.getElementById('audio'));
// });

$(document).ready(closeButton);
var whos_turn = 'x';

var layers = 0;
var increment = true;
var answer = null;
var wrong_answer = null;
var gameSize = null;
var gameState = [];
var question = null;
var ans1 = null;
var ans2 = null;
var ans3 = null;
var ans4 = null;
var spotsFilled = 0;
var totalSpots;

var player1_name = null;
var player2_name = null;
var randomWin = null;


//Visualizer SCRIPT ===========================================
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
function initializeAudioVisualizer(audio) {
    var audCtx = new AudioContext();
    var analyser = audCtx.createAnalyser();
    var audioSrc = null;

    if (audioSrc !== null) {
        audioSrc.disconnect();
    }
    audioSrc = audCtx.createMediaElementSource(audio);
    // we have to connect the MediaElementSource with the analyser
    audioSrc.connect(analyser);
    analyser.connect(audCtx.destination);
    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
    // analyser.fftSize = 64;
    // frequencyBinCount tells you how many values you'll receive from the analyser
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // we're ready to receive some data!
    var canvas = document.getElementById('canvas'),
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        meterWidth = 10, //width of the meters in the spectrum
        gap = 2, //gap between meters
        capHeight = 2,
        capStyle = '#fff',
        meterNum = 500, //count of the meters
        capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
    ctx = canvas.getContext('2d'),
        gradient = ctx.createLinearGradient(0, 0, 0, 1);
    gradient.addColorStop(1, '#f00');
    gradient.addColorStop(0.5, '#ff0');
    gradient.addColorStop(0, '#f00');
    // loop
    function renderFrame() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var step = Math.round(array.length / meterNum); //sample limited data from the total array
        ctx.clearRect(0, 0, cwidth, cheight);
        for (var i = 0; i < meterNum; i++) {
            var value = array[i * step];
            if (capYPositionArray.length < Math.round(meterNum)) {
                capYPositionArray.push(value);
            }
            ;
            ctx.fillStyle = capStyle;
            //draw the cap, with transition effect
            if (value < capYPositionArray[i]) {
                ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
            } else {
                ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                capYPositionArray[i] = value;
            }
            ;
            ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
            ctx.fillRect(i * 12 /*meterWidth+gap*/, cheight - value + capHeight, meterWidth, cheight); //the meter
        }
        requestAnimationFrame(renderFrame);

    }

    renderFrame();
}


function resetGame() {
    location.reload();
}

function audioClick() {
    $('#fx1').get(0).play();
}
function loadAudioFx() {
    $('#fx2').get(0).play();
}

function closeButton() {
    $(".cover_box").hide();
    $("#DJ1").css("box-shadow", "0 0 30px 5px white");
    $(".button").click(function () {
        ajaX();
        player1_name = "DJ " + $("#player1_name").val();
        player2_name = "DJ " + $("#player2_name").val();
        loadAudioFx();
        // $("#DJ1").append(player1_name);
        $(".Player_turn").text('A.K.A. ' + player1_name);
        // $("#DJ2").append(player2_name);
        $('#main').show();
        $(".front_page").slideToggle(1500);
        $('.gamesquare').slideToggle(2000);
        $('.cover_box').fadeIn(2000);
        $('.show-answer').click(function() {
            $('.answer').fadeIn('fast');
        });
        $('.next-question').click(function() {
            $(".question").text("");
            ajaX();
        });
        initializeAudioVisualizer(document.getElementById('audio'));
    });

    $(".board_size").click(function () {
        audioClick();
        $(".gameboard").html("");
        $("#toWin").html("");
        gameSize = +$(this).data('size');
        totalSpots = gameSize * gameSize;
        $('.board_size').removeClass('buttonClicked');
        $(this).addClass('buttonClicked');
        var clicked = $(this).addClass();
        for (var i = 0; i < gameSize; i++) {
            gameState[i] = [];
            for (var j = 0; j < gameSize; j++) {
                gameState[i][j] = ' ';
            }
        }
        loadSquares();
        if (gameSize == 3) {
            randomWin = 3;
        }
        else if (gameSize == 9) {
            randomWin = Math.floor(Math.random() * 6) + 3;
        }
        else {
            randomWin = Math.floor(Math.random() * 17) + 3;
        }
        $('#toWin').append("Need " + randomWin + " in a row to win.");
    });
    $(".button_option").click(function () {
        var answer2 = $(this).text();
        // console.log(answer2);
        $('.button_options').css('pointer-events', 'none');
        if (answer2 == answer) {
           $(".cover_box").fadeOut();
            $(".question").text("");
            // $(".button_options").text("");
            var correct_answer = $('.question').text("GOOD JOB, make a move");
            $('question_board').append(correct_answer);
            answered = true;
            $('.question_board').addClass('answered');
        } else {
            $(".question").text("");
            var incorrect_answer = $('.question').text("Incorrect, You'll have to wait a turn");
            console.log("THE TURN  IS: ", incorrect_answer);
            if (whos_turn == 'x') {

                whos_turn = 'o';
                $(".Player_turn").text('A.k.a. ' + player2_name);
                $("#DJ1").css("box-shadow", "0 0 0 black");
                $("#DJ2").css("box-shadow", "0 0 30px 5px white");
            } else if (whos_turn == 'o') {
                whos_turn = 'x';
                $(".Player_turn").text('A.k.a. '+ player1_name);
                $("#DJ2").css("box-shadow", "0 0 0 black");
                $("#DJ1").css("box-shadow", "0 0 30px 5px white");
            }
            $('.question').append(incorrect_answer);
            $('.show-answer').hide();
            $('.answer').hide();
            $('.next-question').show();
            $('.button_option').text('');
            // $('.question').append()
            // $('.question').append($nextQuestionButton);
        }
    });
    $('#three').trigger('click');
    // $('.button').click(ajaX);
    // $('.button').click(function() {
    //     initializeAudioVisualizer(document.getElementById('audio'));
    // });
}

function loadSquares() {
    var $gameboard = $('.gameboard');
    for (var i = 0; i < gameSize; i++) {
        var row = $('<div>').addClass('row' + i);
        $gameboard.append(row);
        for (var j = 0; j < gameSize; j++) {
            var square = $('<div>').addClass('gamesquare').data('column', j).data('row', i);
            $('.row' + i).append(square);
        }
    }
    //---------------- making size of squares appropriate vs number of squares
    if (gameSize == 3) {
        $(".gamesquare").addClass('gamesquare3');
    }
    else if (gameSize == 9) {
        $(".gamesquare").addClass('gamesquare9');
    }
    else {
        $(".gamesquare").addClass('gamesquare20');
    }
    loadclickhandlers();
    $(".gamesquare").hide();
}

function loadclickhandlers() {
    $('.gamesquare').on('click', function () {
        // $(this).off('click');
        position_tracker.call(this);
        music_layering.call(this);
    });
}

function music_layering() {
    if (increment) {
        layers++;
        if (layers === 7) {
            increment = false;
        }
    }
    else {
        layers--;
        if (layers === 1) {
            increment = true;
        }
    }
    // $('.music').prop('muted', true);
    $("#audio").prop('muted', false);
    var currentTime = $("#audio")[0].currentTime;

    $("#audio").attr('src', 'music/layer' + layers + '.mp3');
    $("#audio")[0].oncanplay = function () {
        $("#audio").prop('muted', false);
    }
    //$("#audio")[0].currentTime = currentTime;
}

var answered = false;

function position_tracker() {
    console.log('clicked');
    if (!answered) {
        console.log('nope');
        return;
    }
    audioClick();
    var row = $(this).data('row');
    var column = $(this).data('column');
    spotsFilled++;

    if (whos_turn == 'x') {

        $("#DJ1").css("box-shadow", "0 0 0 black");
        gameState[row][column] = 'x';
        var player1 = $('<div>').addClass('playerX');
        $(this).append(player1);
        $(this).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        whos_turn = 'o';
        $(".Player_turn").text('A.K.A. ' + player2_name);
        $("#DJ2").css("box-shadow", "0 0 30px 5px white");
        $('.cover_box').fadeIn(2000);
        if (!checkWin(row, column, randomWin, 'x')) {
            ajaX();
        }
    }
    else if (whos_turn == 'o') {

        $("#DJ2").css("box-shadow", "0 0 0 black");
        gameState[row][column] = 'o';
        var player2 = $('<div>').addClass('playerO');
        $(this).append(player2);
        $(this).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        whos_turn = 'x';
        $(".Player_turn").text('A.K.A. ' + player1_name);
        $("#DJ1").css("box-shadow", "0 0 30px 5px white");
        $('.cover_box').fadeIn(2000);
        if (!checkWin(row, column, randomWin, 'o')) {
            ajaX();
        }
    }
}


//Win Condition functions
function checkWin(i, j, numberOfSpots, XorO) {
    if (checkVertical(i, j, numberOfSpots, XorO) || checkUpperDiagonal(i, j, numberOfSpots, XorO) || checkHorizontal(i, j, numberOfSpots, XorO) || checkLowerDiagonal(i, j, numberOfSpots, XorO)) {
        $('.message').text("You're a star!");
        $('.winner').slideToggle();
        setTimeout(function () {
            $('#audio').prop('muted', true);
        }, 1000);
        loadAudioFx();
        return true;
    }
    if (spotsFilled === totalSpots) {
        $('.message').text("TIE game...");
        $('.winner').slideToggle();
        setTimeout(function () {
            $('#audio').prop('muted', true);
        }, 1000);
        loadAudioFx();
    }
    return false;
}


function checkVertical(i, j, numberOfSpots, XorO) {
    var count = 1;
    var step = 1;
    while (gameState[i - step]) {
        if (gameState[i - step][j] === XorO) {
            count++;
            step++;
        } else {
            break;
        }
    }
    step = 1;
    while (gameState[i + step]) {
        if (gameState[i + step][j] === XorO) {
            count++;
            step++;
        } else {
            break;
        }
    }
    return count === numberOfSpots;
}

function checkUpperDiagonal(i, j, numberOfSpots, XorO) {
    var count = 1;
    var step = 1;
    while (gameState[i + step]) {
        if (gameState[i + step][j - step] === XorO) {
            count++;
            step++;
        } else {
            break;
        }
    }
    step = 1;
    while (gameState[i - step]) {
        if (gameState[i - step][j + step] === XorO) {
            count++;
            step++;
        } else {
            break;
        }
    }
    return count === numberOfSpots;
}

function checkHorizontal(i, j, numberOfSpots, XorO) {
    var count = 1;
    var step = 1;
    while (gameState[i][j - step]) {
        if (gameState[i][j - step] === XorO) {
            count++;
            step++;
        } else {
            break;
        }
    }
    step = 1;
    while (gameState[i][j + step]) {
        if (gameState[i][j + step] === XorO) {
            count++;
            step++;
        } else {
            break;
        }
    }
    return count === numberOfSpots;
}

function checkLowerDiagonal(i, j, numberOfSpots, XorO) {
    var count = 1;
    var step = 1;
    while (gameState[i - step]) {
        if (gameState[i - step][j - step] === XorO) {
            count++;
            step++;
        } else {
            step = 1;
            break;
        }
    }
    step = 1;
    while (gameState[i + step]) {
        if (gameState[i + step][j + step] === XorO) {
            count++;
            step++;
        } else {
            break;
        }
    }
    return count === numberOfSpots;
}


function ajaX() {
    $('.spin').show();
    $.ajax({
        // url: 'http://www.opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple',
        // url: 'http://brianphan88.com/questions/multiple_api.php',
        url: 'trivia.php',
        // dataType: 'jsonp',
        // method: 'get',
        // crossDomain: true,
        success: function (response) {
            // console.log("response: ", JSON.parse(response.substring(0, response.length - 1)));
            $('.spin').hide();
            answered = false;
            $('.question_board').removeClass('answered');
            // console.log(JSON.parse(response));
            response = JSON.parse(response.substring(0, response.length - 1));
            console.log(response);
            question = response.results[0].question;
            $('.next-question').hide();
            $('.show-answer').show();
            $(".question").html("");
            $(".question").append(question);
            // $('.questions').append('<br><br><button class="show-answer">Show Answer</button>');
            wrong_answer = response.results[0].incorrect_answers;
            answer = response.results[0].correct_answer;
            $('.answer').hide().html(answer).text();
            $(".button_option").html("");
            $('.button_options').css('pointer-events', 'auto');
            var rand = Math.ceil(Math.random() * 4);
            $('#button_option' + rand).html(answer).text();
            console.log(rand);
            for (var i=1,j=0; i<=4; i++) {
                if (i !== rand) {
                    $('#button_option' + i).html(wrong_answer[j]).text();
                    console.log(j);
                    j++;
                    
                }
            }

            // ans1 = $("#button_option1").html(response.results[0].incorrect_answers[0]).text();
            // ans2 = $("#button_option2").html(response.results[0].incorrect_answers[1]).text();
            // ans3 = $("#button_option3").html(response.results[0].incorrect_answers[2]).text();
            // ans4 = $("#button_option4").html(response.results[0].correct_answer).text();
        }
    })
    
}