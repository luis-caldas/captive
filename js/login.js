function getURLparams()
{
var vars = [], hash;
var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
for(var i = 0; i < hashes.length; i++)
{
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
}
return vars;
}

$( document ).ready(function() {
/**
 * logon action
 */
$("#signin").click(function (event) {
    event.preventDefault();
    // hide alerts
    $("#alertMSG").addClass("hidden");
    // try to login
    $.ajax({
        type: "POST",
        url: "/api/captiveportal/access/logon/" + zoneid + "/",
        dataType:"json",
        data:{ user: $("#inputUsername").val(), password: $("#inputPassword").val() }
    }).done(function(data) {
        // redirect on successful login
        if (data['clientState'] == 'AUTHORIZED') {
            if (getURLparams()['redirurl'] != undefined) {
                window.location = 'http://'+getURLparams()['redirurl']+'?refresh';
            } else {
                // no target, reload page
                window.location.reload();
            }
        } else {
            $("#inputUsername").val("");
            $("#inputPassword").val("");
            $("#errorMSGtext").html("AUTHENTICATION FAILED");
            $("#alertMSG").removeClass("hidden");
        }
    }).fail(function(){
        $("#errorMSGtext").html("UNABLE TO CONNECT TO AUTHENTICATION SERVER");
        $("#alertMSG").removeClass("hidden");
    });
});

/**
 * login anonymous, only applicable when server is configured without authentication
 */
$("#signin_anon").click(function (event) {
    event.preventDefault();
    // hide alerts
    $("#alertMSG").addClass("hidden");
    // try to login
    $.ajax({
        type: "POST",
        url: "/api/captiveportal/access/logon/" + zoneid + "/",
        dataType:"json",
        data:{ user: '', password: '' }
    }).done(function(data) {
        // redirect on successful login
        if (data['clientState'] == 'AUTHORIZED') {
            if (getURLparams()['redirurl'] != undefined) {
                window.location = 'http://'+getURLparams()['redirurl']+'?refresh';
            } else {
                window.location.reload();
            }
        } else {
            $("#inputUsername").val("");
            $("#inputPassword").val("");
            $("#errorMSGtext").html("LOGIN FAILED");
            $("#alertMSG").removeClass("hidden");
        }
    }).fail(function(){
        $("#errorMSGtext").html("UNABLE TO CONNECT TO AUTHENTICATION SERVER");
        $("#alertMSG").removeClass("hidden");
    });
});

/**
 * logoff action
 */
$("#logoff").click(function (event) {
    event.preventDefault();
    // hide alerts
    $("#alertMSG").addClass("hidden");
    // try to login
    $.ajax({
        type: "POST",
        url: "/api/captiveportal/access/logoff/" + zoneid + "/",
        dataType:"json",
        data:{ user: '', password: '' }
    }).done(function(data) {
        // refresh page
        window.location.reload();
    }).fail(function(){
        $("#errorMSGtext").html("UNABLE TO CONNECT TO AUTHENTICATION SERVER");
        $("#alertMSG").removeClass("hidden");
    });
});

/**
 * close / hide error message
 */
$("#btnCloseError").click(function(){
    $("#alertMSG").addClass("hidden");
});

/**
 * execute after pageload
 */
    $.ajax({
        type: "POST",
        url: "/api/captiveportal/access/status/" + zoneid + "/",
        dataType:"json",
        data:{ user: $("#inputUsername").val(), password: $("#inputPassword").val() }
    }).done(function(data) {
    if (data['clientState'] == 'AUTHORIZED') {
        $("#logout_frm").removeClass('hidden');
    } else if (data['authType'] == 'none') {
        $("#login_none").removeClass('hidden');
    } else {
        $("#login_password").removeClass('hidden');
    }
    }).fail(function(){
        $("#errorMSGtext").html("UNABLE TO CONNECT TO AUTHENTICATION SERVER");
        $("#alertMSG").removeClass("hidden");
    });

});