// Globals
const messages = {
    unable: "UNABLE TO CONNECT TO AUTHENTICATION SERVER",
    failed: "AUTHENTICATION FAILED"
};

// Gets URL parameters
function getURLparams() {
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

// On Page Load
$( document ).ready(function() {
    /*
     * Log On
     */

    // Generic Function
    function logon() {

        // Hide all alerts
        $("#spinn").removeClass("invisible");
        $("#alertMSG").addClass("d-none");
        $(".form-signin :input").prop("disabled", true);
        $(".form-signin :button").prop("disabled", true);

        // Try to login
        $.ajax({
            type: "POST",
            url: "/api/captiveportal/access/logon/" + zoneid + "/",
            dataType: "json",
            data: { user: $("#inputUsername").val(), password: $("#inputPassword").val() }
        }).done(function(data) {
            // Redirect on successful login
            if (data['clientState'] == 'AUTHORIZED') {
                if (getURLparams()['redirurl'] != undefined) {
                    window.location = 'http://' + getURLparams()['redirurl'] + '?refresh';
                } else {
                    // No target, reload page
                    window.location.reload();
                }
            } else {
                $("#inputUsername").val("");
                $("#inputPassword").val("");
                $("#errorMSGtext").html(messages.failed);
                $("#alertMSG").removeClass("d-none");
                $("#spinn").addClass("invisible");
                $(".form-signin :input").prop("disabled", false);
                $(".form-signin :button").prop("disabled", false);
            }
        }).fail(function() {
            $("#errorMSGtext").html(messages.unable);
            $("#alertMSG").removeClass("d-none");
            $("#spinn").addClass("invisible");
            $(".form-signin :input").prop("disabled", false);
            $(".form-signin :button").prop("disabled", false);
        });
    }

    // Text input
    $("#inputUsername, #inputPassword").keypress((event) => {
        // If enter is pressed
        if(event.which == 10 || event.which == 13) {
            // Prevent default action
            event.preventDefault();
            // Event handler
            logon()
        }
    });
    // Button
    $("#signin").click((event) => {
        // Prevent default action
        event.preventDefault();
        // Event handler
        logon()
    });

    /*
     * Anonymous
     * Only applicable when server is configured without authentication
     */
    $("#signin_anon").click(function (event) {
        event.preventDefault();

        // Hide alerts
        $("#spinn").removeClass("invisible");
        $("#alertMSG").addClass("d-none");
        $(".form-signin :input").prop("disabled", true);
        $(".form-signin :button").prop("disabled", true);

        // Try to login
        $.ajax({
            type: "POST",
            url: "/api/captiveportal/access/logon/" + zoneid + "/",
            dataType: "json",
            data: { user: '', password: '' }
        }).done(function(data) {
            // Redirect on successful login
            if (data['clientState'] == 'AUTHORIZED') {
                if (getURLparams()['redirurl'] != undefined) {
                    window.location = 'http://'+getURLparams()['redirurl']+'?refresh';
                } else {
                    window.location.reload();
                }
            } else {
                $("#inputUsername").val("");
                $("#inputPassword").val("");
                $("#errorMSGtext").html(messages.failed);
                $("#alertMSG").removeClass("d-none");
                $("#spinn").addClass("invisible");
                $(".form-signin :input").prop("disabled", false);
                $(".form-signin :button").prop("disabled", false);
            }
        }).fail(function(){
            $("#errorMSGtext").html(messages.unable);
            $("#alertMSG").removeClass("d-none");
            $("#spinn").addClass("invisible");
            $(".form-signin :input").prop("disabled", false);
            $(".form-signin :button").prop("disabled", false);
        });
    });

    /*
     * Log Off
     */
    $("#logoff").click(function (event) {
        event.preventDefault();

        // Hide alerts
        $("#spinn").removeClass("invisible");
        $("#alertMSG").addClass("d-none");
        $(".form-signin :input").prop("disabled", true);
        $(".form-signin :button").prop("disabled", true);

        // Try to login
        $.ajax({
            type: "POST",
            url: "/api/captiveportal/access/logoff/" + zoneid + "/",
            dataType:"json",
            data:{ user: '', password: '' }
        }).done(function(data) {
            // Refresh page
            window.location.reload();
        }).fail(function(){
            $("#errorMSGtext").html(messages.unable);
            $("#alertMSG").removeClass("d-none");
            $("#spinn").addClass("invisible");
            $(".form-signin :input").prop("disabled", false);
            $(".form-signin :button").prop("disabled", false);
        });
    });

    /*
     * Close / Hide Error Message
     */
    $("#btnCloseError").click(function(){
        $("#alertMSG").addClass("d-none");
    });
    $("#btnUnderstood").click(function(){
        $("#alertMSG").addClass("d-none");
    });

    /*
     * Page Load
     */
    $("#spinn").removeClass("invisible");
    $(".form-signin :input").prop("disabled", true);
    $(".form-signin :button").prop("disabled", true);
    $.ajax({
        type: "GET",
        url: "/api/captiveportal/access/status/" + zoneid + "/",
        dataType:"json",
        data:{ user: $("#inputUsername").val(), password: $("#inputPassword").val() }
    }).done(function(data) {
    if (data['clientState'] == 'AUTHORIZED') {
        $("#logout_frm").removeClass('d-none');
    } else if (data['authType'] == 'none') {
        $("#login_none").removeClass('d-none');
    } else {
        $("#login_password").removeClass('d-none');
    }
    }).fail(function() {
        $("#errorMSGtext").html(messages.unable);
        $("#alertMSG").removeClass("d-none");
    }).always(function() {
        $("#spinn").addClass("invisible");
        $(".form-signin :input").prop("disabled", false);
        $(".form-signin :button").prop("disabled", false);
    });

});