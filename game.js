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

var level = 1;

var hintAvailable = 2;

var soundToggle = 1;

var allowInput = 1;

// Instructions
$(".instructions-para").hide();

$(".instructions-button").on("click", function () {
  if ($(".instructions-para").css("visibility") == "hidden") {
    $(".instructions-para").css("visibility", "visible");
  }
  $(".instructions-para").slideToggle();
});

// Create the Next Sequence
function nextSequence() {
  $("h1").text("Level " + level);
  if (level % 10 == 0) {
    hintAvailable++;
  }
  $(".lives")
    .css("visibility", "visible")
    .text("Lives remaining (" + hintAvailable + ")");
  var randomNumber = Math.floor(Math.random() * 4);
  randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);
  showPattern(0);
}

// Detecting the Keyboard input event
$(document).on("keydown", function (event) {
  if (started === 0) {
    nextSequence();
    started = 1;
  } else {
    if (keyboardKeys.includes(event.key) && allowInput == 1) {
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

// Detecting the Clicking input event
$(".btn").on("click", function () {
  if (started === 0) {
    nextSequence();
    started = 1;
  } else {
    if (allowInput == 1) {
      userChosenColor = $(this).attr("id");
      userClickedPattern.push(userChosenColor);
      check();
      animatePress(userChosenColor);
      playAudio(userChosenColor);
    }
  }
});

// // Detecting the Clicking on Show Pattern button
// $(".lives").on("click", function () {
//   if (started == 1) {
//     showPattern(1);
//   }
// });

// Function to Show the pattern
function showPattern(liveRemaining) {
    userClickedPattern = [];
  if (liveRemaining == 1) {
    if (hintAvailable > 0) {
      hintAvailable--;
      setTimeout(function () {
        $(".lives").text("Lives remaining (" + hintAvailable + ")");
      }, 70);
      allowInput = 0;
    $(".btn").css("cursor", "wait");
    var i = 0;
    myLoop(i);
    }
  } else {
    allowInput = 0;
    $(".btn").css("cursor", "wait");
    var i = 0;
    myLoop(i);
  }
}

// Looping Function for Delaying pattern occurance
function myLoop(i) {
  setTimeout(function () {
    $("#" + gamePattern[i])
      .fadeOut(100)
      .fadeIn(100);
    playAudio(gamePattern[i]); //  your code here
    i++; //  increment the counter
    if (i < gamePattern.length) {
      myLoop(i);
    } else if (i == gamePattern.length) {
      allowInput = 1;
      $(".btn").css("cursor", "pointer");
    }
  }, 800); //  ..  setTimeout()
}

// Checking if the User input is Correct
function check() {
  if (
    userClickedPattern[userClickedPattern.length - 1] !=
    gamePattern[userClickedPattern.length - 1]
  ) {
    if (hintAvailable > 0) {
      playAudio("wrong");
      $("body").addClass("game-over");
      setTimeout(function () {
        $("body").removeClass("game-over");
      }, 200);

      showPattern(1);
    } else {
      gameOver();
    }
  } else {
    if (userClickedPattern.length == gamePattern.length) {
      levelUp();
    }
  }
}

// Function to Level Up
function levelUp() {
  setTimeout(function () {
    playAudio("levelup");
    level++;
    nextSequence();
  }, 500);
}

// Function when Game Over
function gameOver() {
  $("h1").html(
    "<span style = 'color: red;'>Game Over!</span> Press/Click Any Key to Restart"
  );
  $("body").addClass("game-over");
  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 200);
  playAudio("wrong");
  $(".lives").css("visibility", "hidden");
  started = 0;
  level = 1;
  gamePattern = [];
  hintAvailable = 2;
}

// Function Animating the Clicking of the Button
function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

// Function controlling the audio
function playAudio(currentColor) {
  if (soundToggle == 1) {
    var sound = new Audio("sounds/" + currentColor + ".mp3");
    sound.play();
  }
}

// Function to Toggle Sound
$(".sound").on("click", function () {
  if (soundToggle == 1) {
    soundToggle = 0;
    $(".sound").html("<i class='fa-solid fa-volume-xmark'>");
  } else if (soundToggle == 0) {
    soundToggle = 1;
    $(".sound").html("<i class='fa-solid fa-volume-high'></i>");
  }
});
