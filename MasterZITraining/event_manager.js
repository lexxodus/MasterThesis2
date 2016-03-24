"use strict";

var ROOT_URL = "http://localhost";

function loginUser(name){
    var data = JSON.stringify({"name": name});
    return $.ajax({
        type: "GET",
        url: ROOT_URL + "/api/player/",
        data: data,
        dataType:"json",
        contentType: "application/json; charset=utf-8"
    });
};

function getLevel(id){
    return $.ajax({
        type: "GET",
        url: ROOT_URL + "/api/level/" + id,
        contentType: "application/json; charset=utf-8"
    });
};

function startGame(){
    var pid = sessionStorage.getItem("pid");
    var lid = sessionStorage.getItem("lid");
    var data = JSON.stringify({"lid": lid});
    var levelInstance = $.ajax({
        type: "POST",
        url: ROOT_URL + "/api/level_instance/",
        data: data,
        dataType:"json",
        contentType: "application/json; charset=utf-8"
    });
    levelInstance.success(function(data){
        sessionStorage.setItem("liid", data.id);
        data = JSON.stringify({"pid": pid, "liid": data.id});
        var levelInstance = $.ajax({
            type: "POST",
            url: ROOT_URL + "/api/participation/",
            data: data,
            dataType:"json",
            contentType: "application/json; charset=utf-8",
            success: function(data){
                sessionStorage.setItem("paid", data.id);
            }
        });
    });
};

function endGame(){
    var paid = sessionStorage.getItem("paid");
    var liid = sessionStorage.getItem("liid");
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
    var endtime = localISOTime;
    var data = JSON.stringify({"end_time": endtime});
    $.ajax({
        type: "PUT",
        url: ROOT_URL + "/api/level_instance/" + liid,
        data: data,
        dataType:"json",
        contentType: "application/json; charset=utf-8"
    });
    $.ajax({
        type: "PUT",
        url: ROOT_URL + "/api/participation/" + paid,
        data: data,
        dataType:"json",
        contentType: "application/json; charset=utf-8"
    });
};

function giveAnswer(correct_answers, wrong_answers, answer_options,
        response_time, difficulty_factor){
    var paid = sessionStorage.getItem("paid");
    var eid = 1;
    var correct_answers_amount = correct_answers.length;
    var wrong_answers_amount = wrong_answers.length;
    var expected_response_time = 3.0;
    var dynamic_skill_points;
    var answer_impact;
    var time_malus;
    if(correct_answers_amount > wrong_answers_amount){
        answer_impact = correct_answers_amount /
            (correct_answers_amount + wrong_answers_amount)
    } else {
        answer_impact = - wrong_answers_amount /
            (correct_answers_amount + wrong_answers_amount)
    } 
    if(response_time <= expected_response_time){
        time_malus = 0;
    } else {
        time_malus = 
                (response_time - expected_response_time)
                / expected_response_time;
    }
    dynamic_skill_points = (answer_impact * 10.0 - time_malus) * difficulty_factor;

    var data = JSON.stringify({
        "paid": paid,
        "eid": eid,
        "difficulty_factor": difficulty_factor,
        "answer_options": answer_options,
        "correct_answers": correct_answers,
        "wrong_answers": wrong_answers,
        "correct_answers_amount": correct_answers_amount,
        "wrong_answers_amount": wrong_answers_amount,
        "response_time": response_time,
        "dynamic_skill_points": dynamic_skill_points
    });
    return $.ajax({
        type: "POST",
        url: ROOT_URL + "/api/triggered_event/",
        data: data,
        dataType:"json",
        contentType: "application/json; charset=utf-8"
    });
};

function calcLevelSkill(){
    var pid = sessionStorage.getItem("pid");
    var lid = sessionStorage.getItem("lid");
    var data = JSON.stringify({
        "pid": pid,
        "lid": lid
    });
    return $.ajax({
        type: "POST",
        url: ROOT_URL + "/api/level_skill/",
        data: data,
        dataType:"json",
        contentType: "application/json; charset=utf-8"
    });
};

function getHighScore(){
    var pid = sessionStorage.getItem("pid");
    var lid = sessionStorage.getItem("lid");
    var data = JSON.stringify({
        "pid": pid,
        "lid": lid
    });
    return $.ajax({
        type: "GET",
        url: ROOT_URL + "/api/level_skill/",
        data: data,
        dataType:"json",
        contentType: "application/json; charset=utf-8"
    });
};
