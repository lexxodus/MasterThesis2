var protoChoices = [{
  title: "Bier1",
  alk: true,
  url: "./../../../../img/sportplatz/bier1.png"
}, {
  title: "Bier2",
  alk: true,
  url: "./../../../../img/sportplatz/bier2.png",
}, {
  title: "Bier3",
  alk: true,
  url: "./../../../../img/sportplatz/bier3.png",
}, {
  title: "Bier4",
  alk: true,
  url: "./../../../../img/sportplatz/bier4.png",
}, {
  title: "Apfelsaftschorle",
  alk: false,
  url: "./../../../../img/sportplatz/apfelsaftschorle.png",
}, {
  title: "Cola",
  alk: false,
  url: "./../../../../img/sportplatz/cola.png",
}, {
  title: "Fanta",
  alk: false,
  url: "./../../../../img/sportplatz/fanta.png",
}, {
  title: "Wein",
  alk: true,
  url: "./../../../../img/sportplatz/wein1.png",
}, {
  title: "Cola Light",
  alk: false,
  url: "./../../../../img/sportplatz/colalight.png",
}, {
  title: "Spezi",
  alk: false,
  url: "./../../../../img/sportplatz/spezi.png",
}, {
  title: "Wasser",
  alk: false,
  url: "./../../../../img/sportplatz/wasser.png",
}, {
  title: "Bier5",
  alk: true,
  url: "./../../../../img/sportplatz/bier5.png",
}];




function backNav() {

  window.location.replace('../../story.html');

}

function homeNav() {

  window.location.replace('../../../start/start.html');

}


$(document).ready(function() {

  $("#imageSizer").css("width", $(window).width()* 1.2);

  resize();


  $('#makeMeDraggable').draggable({
    containment: '#containment',
    cursor: 'move'
  });


});



function resize() { //init
  $("body").addClass("stop-scrolling");
  imgPanorama = $('#imageSizer');




  var widthContainer = ($(imgPanorama).width() + ($(imgPanorama).width() - $(window).width()));
  var heightContainer = ($(imgPanorama).height() + ($(imgPanorama).height() - $(window).height()));

  $("#containment").width(widthContainer);
  $("#containment").height(heightContainer);

  var containerPosTop = (-heightContainer / 2) + ($(window).height() / 2);
  var containerPosLeft = (-widthContainer / 2) + ($(window).width() / 2);

  $("#containment").css({
    top: containerPosTop,
    left: containerPosLeft,
    position: 'absolute'
  });

  // Placements
}

function initialToInside1(){
  $(".imgHolder").css("background-image", "url(../../../../img/sportplatz/inside1.jpg)");
  $("#imageSizer").attr("src", "../../../../img/sportplatz/inside1.jpg");
  $(".doorNo1").addClass("hidden");
  $(".doorNo2").removeClass("hidden");
  $("#imageSizer").css("height", $(window).height()* 1.2);
  resize();
}
function inside1ToInside2(){
  $(".imgHolder").css("background-image", "url(../../../../img/sportplatz/inside2.jpg)");
  $("#imageSizer").attr("src", "../../../../img/sportplatz/inside2.jpg");
  $(".doorNo2").addClass("hidden");
  $(".doorNo3").removeClass("hidden");
  resize();
}

function inside2ToGame() {
  window.location.replace('gamesportplatz.html');
}

function preGame() {
  $(".preGame").removeClass("hidden");
  $(".gameDoor").addClass("hidden");
  $(".gameBox").addClass("hidden");
}

function gameBegin() {
  $(".preGame").addClass("hidden");
  $(".gameBox").removeClass("hidden");
  gameStart();

}


var count = 0;
var counter;
var answer_options = [];

function timerStart() {

  count++;
  $(".timer").text(count);
}

var arrLengthOne = protoChoices.length;


function gameStart() {
  getLevel(5).success(function(data){
      sessionStorage.setItem("lid", data.id);
      startGame();
  });
  counter = setInterval(timerStart, 1000);
  for (var i = arrLengthOne; i >= 1; i--) {
    var protoChoice = protoChoices[Math.floor(Math.random() * protoChoices.length)];
    protoChoices.splice($.inArray(protoChoice, protoChoices), 1);
    $(".proto" + i).css("background-image", "url("+protoChoice.url+")");
    $(".proto" + i).attr("value", protoChoice.alk);
    $(".proto" + i).attr("title", protoChoice.title);
    $(".proto" + i).removeClass("hidden");
  }

}

var checksum = 0;
// var points = 50;
var round = 1;
var score = 0;

var correct_answers = [];
var wrong_answers = [];
var difficulty_factor = 2;
var answer;

function check(obj) {
  var sender = (obj || window.event.target);
  var attribute = $(sender).attr("value");
  checksum++;
  if (attribute == "false") {
    $(sender).css("border", "5px solid rgb(25, 255, 25)");
    answer = $(sender).attr("title");
    correct_answers.push(answer);
    // points += 50;
  } else {
    $(sender).css("border", "5px solid red");
    answer = $(sender).attr("title");
    wrong_answers.push(answer);
    // points -= 25;
  }

  if (checksum == 2) {
      if(count <= 30){
          giveAnswer(correct_answers, wrong_answers, answer_options,
                  count, difficulty_factor)
              .success(function(data){
                  score = data.given_score_points;
                  if (score <= 0) {
                      score = 0;
                  }
                  clearInterval(counter);
                  congrats();
              });
      } else {
          score = 0;
          clearInterval(counter);
          congrats();
      }
      correct_answers = [];
      wrong_answers = [];
      // score = points - count;
  }
}



function retry() {

  $(".gameBox").removeClass("hidden");
  $(".congratsBox").addClass("hidden");
  $("#congratsMessage").remove();




  gameUpdate();
}

var roundOnePoints, roundOneTime, roundTwoPoints, roundTwoTime, roundThreePoints, roundThreeTime;


function nextRound() {
  if (round == 1) {
    roundOnePoints = score;
    roundOneTime = count;
  } else if (round == 2) {
    roundTwoPoints = score;
    roundTwoTime = count;
    $("#nextBtn").html("Endergebnis");
  } else {
    roundThreePoints = score;
    roundThreeTime = count;

  }

  $(".gameBox").removeClass("hidden");
  $(".congratsBox").addClass("hidden");
  $("#congratsMessage").remove();
  round++;
  gameUpdate();
}




function congrats() {

  var e = "<label id='congratsMessage'>Herzlichen Glückwunsch du hast Runde " + round + " absolviert! Du hast dabei " + score + " Punkte in " + count + " Sekunden erreicht!</label>";

  $(".gameBox").addClass("hidden");
  $(".congratsBox").removeClass("hidden");


  $(".congratsBox").prepend(e);

}

function gameUpdate() {
  $(".timer").text("0");
  counter = setInterval(timerStart, 1000);
  var arrObjOne = {};
  var swapArrOne = [];
  var arrObjTwo = {};
  var swapArrTwo = [];
  count = 0;
  checksum = 0;
  points = 50;
//proto
  if (round <= 3) {
    for (var i = arrLengthOne; i >= 1; i--) {
      $(".proto" + i).css("border-style", "none");
      var cssURL = $(".proto" + i).css("background-image");
      cssURL = cssURL.replace('url(', '').replace(')', '');

      arrObj = {
        title: $(".proto" + i + " .title").text(),
        alk: $(".proto" + i).attr("value"),
        url: cssURL,

      }

      swapArrOne.push(arrObj);
    }

    //proto
    for (var j = arrLengthOne; j >= 1; j--) {
      var randomObjOne = swapArrOne[Math.floor(Math.random() * swapArrOne.length)];
      swapArrOne.splice($.inArray(randomObjOne, swapArrOne), 1);

      $(".proto" + j + " .title").text(randomObjOne.title);
      $(".proto" + j).css("background-image", "url("+randomObjOne.url+")");
      $(".proto" + j).attr("value", randomObjOne.alk);
    }

  } else {
    endGameProtocol();
  }
}

var endScore, endCounter;
function endGameProtocol() {
  endGame();
  calcLevelSkill();
  endScore = roundOnePoints + roundTwoPoints + roundThreePoints;
  endCounter = roundOneTime + roundTwoTime + roundThreeTime;
  var e = "<label id='congratsMessage'>Herzlichen Glückwunsch du hast das Spiel mit " + endScore + " Punkte in insgesamt " + endCounter + " Sekunden absolviert!</label>";
  $(".gameBox").addClass("hidden");
  $(".congratsBox").removeClass("hidden");
  $("#nextBtn").addClass("hidden");
  $("#retryBtn").addClass("hidden");

  $("#homeBtn").removeClass("hidden");
  $(".congratsBox").prepend(e);
}

function home() {
  sessionStorage.setItem("sportplatzScore",endScore);
  sessionStorage.setItem("sportplatzTime",endCounter);
  window.location.replace('../../story.html');
}
