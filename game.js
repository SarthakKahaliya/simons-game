var buttonColors = ["red", "blue", "green", "yellow"];

var keyboardKeys = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "w",
  "a",
  "s",
  "d",
];

var gamePattern = [];

var userChosenColor;

var userClickedPattern = [];

var started = 0;

var level = 0;

var hintAvailable = 3;

$(".instructions-para").hide();

$(".instructions-button").on("click", function () {
  if ($(".instructions-para").css("visibility") == "hidden") {
    $(".instructions-para").css("visibility", "visible");
  }
  $(".instructions-para").slideToggle();
});

function nextSequence() {
  $("h1").text("Level " + ++level);
  $(".show-pattern")
    .css("visibility", "visible")
    .text("Show Order (" + hintAvailable + ")");
  var randomNumber = Math.floor(Math.random() * 4);
  randomChosenColor = buttonColors[randomNumber];
  setTimeout(function () {
    $("#" + randomChosenColor)
      .fadeOut(100)
      .fadeIn(100)
      .fadeOut(100)
      .fadeIn(100)
      .fadeOut(100)
      .fadeIn(100);
    playAudio(randomChosenColor);
  }, 1000);

  gamePattern.push(randomChosenColor);
}

$(document).on("keydown", function (event) {
    if (started === 0) {
      nextSequence();
      started = 1;
    } else {
      if (keyboardKeys.includes(event.key)) {
        if (event.key == "ArrowUp" || event.key == "w") {
          userChosenColor = "green";
        } else if (event.key == "ArrowLeft" || event.key == "a") {
          userChosenColor = "yellow";
        } else if (event.key == "ArrowRight" || event.key == "d") {
          userChosenColor = "blue";
        } else if (event.key == "ArrowDown" || event.key == "s") {
          userChosenColor = "red";
        }
        userClickedPattern.push(userChosenColor);
        check();
        animatePress(userChosenColor);
        playAudio(userChosenColor);
      }
    }
  });

$(document).on('click', function(){
    if (started === 0) {
        nextSequence();
        started = 1;
      } 
})

$(".btn").on("click", function () {
  if (started === 0) {
    nextSequence();
    started = 1;
  } else {
    userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);
    check();
    animatePress(userChosenColor);
    playAudio(userChosenColor);
  }
});

$(".show-pattern").on("click", function () {
  if (started == 1) {
    showPattern();
  }
});

function showPattern() {
  if (hintAvailable > 0) {
    var i = 0;
    myLoop(i);
    hintAvailable--;
    setTimeout(function () {
      $(".show-pattern").text("Show Order (" + hintAvailable + ")");
    }, 70);
    userClickedPattern = [];
  }
}

function myLoop(i) {
  //  create a loop function
  setTimeout(function () {
    //  call a 3s setTimeout when the loop is called
    $("#" + gamePattern[i])
      .fadeOut(100)
      .fadeIn(100); //  your code here
    i++; //  increment the counter
    if (i < gamePattern.length) {
      //  if the counter < 10, call the loop function
      myLoop(i); //  ..  again which will trigger another
    } //  ..  setTimeout()
  }, 600);
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function check() {
  if (
    userClickedPattern[userClickedPattern.length - 1] !=
    gamePattern[userClickedPattern.length - 1]
  ) {
    gameOver();
  } else {
    if (userClickedPattern.length == gamePattern.length) {
      levelUp();
    }
  }
}

function levelUp() {
  setTimeout(function () {
    playAudio("levelup");
    userClickedPattern = [];
    nextSequence();
  }, 500);
}

function gameOver() {
  $("h1").html(
    "<span style = 'color: red;'>Game Over!</span> Press Any Key to Restart"
  );
  $("body").addClass("game-over");
  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 200);
  playAudio("wrong");
  $(".show-pattern").css("visibility", "hidden");
  started = 0;
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  hintAvailable = 3;
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function playAudio(currentColor) {
  var sound = new Audio("sounds/" + currentColor + ".mp3");
  sound.play();
}
