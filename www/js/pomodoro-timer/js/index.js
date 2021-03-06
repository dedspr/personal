$(document).ready(function () {
    var clockRunning = false;
    var timeLeft;
    var sessionTime = 180;
    var breakTime = 60;
    var breakClock = false;
    var seconds = sessionTime;

    //Converts seconds to MM:SS
    function filterTime(seconds) {
        var min = Math.floor(seconds / 60);
        var sec = seconds % 60;
        if (sec < 10) {
            return min + ":0" + sec;
        } else {
            return min + ":" + sec;
        }
    }
    //renders the background fill effect with different colors for session, break, and pause
    function renderBackground() {
        var color = '#444'
        var timer = breakClock ? breakTime : sessionTime;
        if (clockRunning) {
            color = breakClock ? '#166' : '#464';
        }
        var progress = (timer - seconds) * 100 / timer;
        $('#stopWatch').css('background', 'linear-gradient(to top, ' + color + ' 0%,' + color + ' ' + progress + '%,#222 ' + progress + '%,#222 100%)');
    }
    //counts down till seconds = 0, then plays alarm and switches between session and break mode.
    function timer() {
        if (seconds > 0) {
            seconds -= 1;
            if (seconds === 0) {
                document.getElementById('alarm').play();
            }
        } else {
            if (!breakClock) {
                seconds = breakTime;
                $('#title').html("Intervalo");
                $('#stopWatch').removeClass('session').addClass('break');
                breakClock = true;
            } else {
                seconds = sessionTime;
                $('#title').html("Treino");
                $('#stopWatch').addClass('session').removeClass('break');
                breakClock = false;
            }
        }
        renderBackground()
        $('#time').html(filterTime(seconds));
    }
    //Initial page render
    $('#time').html(filterTime(seconds));
    $('#sessTime').html(Math.floor(seconds / 60));
    $('#brkTime').html(Math.floor(breakTime / 60));


    //add play/pause functionality to the stopwatch button
    $('#stopWatch').click(function () {
        if (!clockRunning) {
            timeLeft = setInterval(function () { timer() }, 1000);
            clockRunning = true;
            $(this).addClass('running');
        } else {
            clearInterval(timeLeft);
            clockRunning = false;
            $(this).removeClass('running');
        }
        renderBackground()
    });

    //reset button brings app back to session mode at full time.
    $('#reset').click(function () {
        seconds = sessionTime;
        $('#title').html("Treino");
        $('#stopWatch').addClass('session').removeClass('break');
        $('#time').html(filterTime(seconds));
        breakClock = false;
        clearInterval(timeLeft);
        clockRunning = false;
        $('#stopWatch').removeClass('running');
        renderBackground()
    });


    $('body').on('click', '.time-select', function (e) {
        var method = e.target.getAttribute("data-method");
        switch (method) {
            case "add-sess": sessionTime += 60; break;
            case "sub-sess": sessionTime = sessionTime <= 60 ? 0 : sessionTime - 60; break;
            case "add-break": breakTime += 60; break;
            case "sub-break": breakTime = breakTime <= 60 ? 0 : breakTime - 60; break;
        }
        //sets seconds to the appropriate value
        if ((breakClock && (method.indexOf("break") >= 0)) || (!breakClock && method.indexOf("sess") >= 0)) {
            seconds = breakClock ? breakTime : sessionTime;
            $('#time').html(filterTime(seconds));
        }
        $('#sessTime').html(Math.floor(sessionTime / 60));
        $('#brkTime').html(Math.floor(breakTime / 60));

    });

});