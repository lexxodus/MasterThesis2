$("#login-button").click(function() {

    var userInputs = [$("#username").val(), $("#password").val()];

    var loginPromise = loginUser(userInputs[0]);
    loginPromise.success(function(data){
        if(data[0].password == userInputs[1]){
          sessionStorage.setItem("pid", data[0].id);
          sessionStorage.setItem("username", data[0].name);
          window.location.replace("../start/start.html");
        } else {
            $("#username").css("border", "solid 1px red");
            $("#password").css("border", "solid 1px red");
        }
    });
});
