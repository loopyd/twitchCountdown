var GetVars;
var cooldown_config;
var initialDate;
var countdownDate;
var totalDistance;
var colors;
var frame;

function mapRange(from, to, s) {
    return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
}

function oscillator(time, frequency = 1, amplitude = 1, phase = 0, offset = 0){
    return Math.sin(time * frequency * Math.PI * 2 + phase * Math.PI * 2) * amplitude + offset; 
}

function GetDivCSSColor(fromClass) {
    var $inspector = $("<div>").css('display', 'none').addClass(fromClass);
    $("body").append($inspector); // add to DOM, in order to read the CSS property
    try {
        var color = $inspector.css('color');
        return color;
    } finally {
        $inspector.remove(); // and remove from DOM
    }
};

// Function to parse GET variables.
function parseGet() {
    var $_GET = {};
    if (document.location.toString().indexOf('?') !== -1) {
        var query = document.location
            .toString()
            .replace(/^.*?\?/, '')
            .replace(/#.*$/, '')
            .split('&');
        for (var i = 0, l = query.length; i < l; i++) {
            var aux = decodeURIComponent(query[i]).split('=');
            $_GET[aux[0]] = aux[1];
        }
    }
    return $_GET;
}

// Function to get the amount of time remaining.
function getTimeRemaining(endtime) {
    const total = endtime - new Date().getTime();
    const milliseconds = Math.floor( total/10 );
    const seconds = Math.floor( (total/1000) % 60 );
    const minutes = Math.floor( (total/1000/60) % 60 );
    const hours = Math.floor( (total/(1000*60*60)) % 24 );
    const days = Math.floor( total/(1000*60*60*24) );
    return {
        total,
        days,
        hours,
        minutes,
        seconds,
        milliseconds
    };
}

// Function to update the clock portion of the UI.
function updateClock(endtime) {
    const t = getTimeRemaining(endtime);
    var clock = document.getElementById("timer");
    const hoursSpan = clock.querySelector('.hours');
    const minutesSpan = clock.querySelector('.minutes');
    const secondsSpan = clock.querySelector('.seconds');
    const millisecondsSpan = clock.querySelector('.milliseconds');
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
    millisecondsSpan.innerHTML = ('0' + t.milliseconds).slice(-2);
}

// Update the colors of the clock based on three different sine wave oscillators to
// add some visual flair!
function updateColors(_currentDistance, _totalDistance) {
    let percentage = (_totalDistance - _currentDistance) / _totalDistance;
    if (percentage <= 0.75) {
        index = Math.round(
            oscillator((totalDistance * percentage) / 1000, 0.125, 16, 0, 16)
        );
        $('#timer > span.hours').css('color', colors.hours.long[index]);
        $('#timer > span.minutes').css('color', colors.minutes.long[index]);
        $('#timer > span.seconds').css('color', colors.seconds.long[index]);
        $('#timer > span.milliseconds').css('color', colors.milliseconds.long[index]);
        $('#timer > span.seperator').css('color', colors.seperator.long[index]);
    } else if (percentage > 0.75 && percentage <= .85) {
        index = Math.round(
            oscillator((totalDistance * percentage) / 1000, 0.5, 16, 0, 16)
        );
        $('#timer > span.hours').css('color', colors.hours.mid[index]);
        $('#timer > span.minutes').css('color', colors.minutes.mid[index]);
        $('#timer > span.seconds').css('color', colors.seconds.mid[index]);
        $('#timer > span.milliseconds').css('color', colors.milliseconds.mid[index]);
        $('#timer > span.seperator').css('color', colors.seperator.mid[index]);
    } else {
        index = Math.round(
            oscillator((totalDistance * percentage) / 1000, 1, 16, 0, 16)
        );
        $('#timer > span.hours').css('color', colors.hours.short[index]);
        $('#timer > span.minutes').css('color', colors.minutes.short[index]);
        $('#timer > span.seconds').css('color', colors.seconds.short[index]);
        $('#timer > span.milliseconds').css('color', colors.milliseconds.short[index]);
        $('#timer > span.seperator').css('color', colors.seperator.short[index]);
    }
}

// Function to update the progress bar portion of the UI.
function updateBar(_currentDistance, _totalDistance) {
    var bar = document.getElementById("bar");
    let percentage = ((_totalDistance - _currentDistance) / _totalDistance) * 100;
    percentage = (percentage < 100) ? percentage : 100;
    bar.style.width = `${percentage}%`;
} 

// Function to update the timer UI.
function upodateUI(timerHandle) {
    var distance = countDownDate - new Date().getTime();
    updateClock(countDownDate);
    if (distance <= 0) {
        clearInterval(timerHandle);
        var clock = document.getElementById("timer");
        clock.innerHTML = "STARTING NOW!";
    }
    updateBar(distance, totalDistance);
    updateColors(distance, totalDistance);
}

// Countdown main thread.
$(document).ready(function () {
    var GetVars = parseGet();
    var countdown_config = {
        days: parseInt((!GetVars['d']) ? 0 : GetVars['d']),
        days_enabled: !(!GetVars['d']),
        hours: parseInt((!GetVars["h"]) ? 0 : GetVars['h']),
        hours_enabled: !(!GetVars['h']),
        minutes: parseInt((!GetVars['m']) ? 0 : GetVars['m']),
        minutes_enabled: !(!GetVars['m']),
        seconds: parseInt((!GetVars['s']) ? 0 : GetVars['s']),
        seconds_enabled: !(!GetVars['s'])
    }
    if (!countdown_config.seconds_enabled && !countdown_config.minutes_enabled && !countdown_config.hours_enabled && !countdown_config.days_enabled) {
        throw new Error("No time specified in GET variables.  You need to set a countdown time.");
    }
    initialDate = new Date().getTime();
    countDownDate = new Date(initialDate +
        (1000 * countdown_config.seconds) +
        (1000 * 60 * countdown_config.minutes) +
        (1000 * 60 * 60 * countdown_config.hours)
    ).getTime();
    totalDistance = countDownDate - initialDate;
    colors = {
        hours: {
            short: chroma.scale([$('#timer > span.hours').css('color'), '#11ff11']).mode('lch').colors(32),
            mid: chroma.scale([$('#timer > span.hours').css('color'), '#ffff11']).mode('lch').colors(32),
            long: chroma.scale([$('#timer > span.hours').css('color'), '#ff1111']).mode('lch').colors(32)
        },
        minutes: {
            short: chroma.scale([$('#timer > span.minutes').css('color'), '#11ff11']).mode('lch').colors(32),
            mid: chroma.scale([$('#timer > span.minutes').css('color'), '#ffff11']).mode('lch').colors(32),
            long: chroma.scale([$('#timer > span.minutes').css('color'), '#ff1111']).mode('lch').colors(32)
        },
        seconds: {
            short: chroma.scale([$('#timer > span.seconds').css('color'), '#11ff11']).mode('lch').colors(32),
            mid: chroma.scale([$('#timer > span.seconds').css('color'), '#ffff11']).mode('lch').colors(32),
            long: chroma.scale([$('#timer > span.seconds').css('color'), '#ff1111']).mode('lch').colors(32)
        },
        milliseconds: {
            short: chroma.scale([$('#timer > span.milliseconds').css('color'), '#11ff11']).mode('lch').colors(32),
            mid: chroma.scale([$('#timer > span.milliseconds').css('color'), '#ffff11']).mode('lch').colors(32),
            long: chroma.scale([$('#timer > span.milliseconds').css('color'), '#ff1111']).mode('lch').colors(32)
        },
        bar: {
            short: chroma.scale([$('#bar').css('color'), '#11ff11']).mode('lch').colors(32),
            mid: chroma.scale([$('#bar').css('color'), '#ffff11']).mode('lch').colors(32),
            long: chroma.scale([$('#bar').css('color'), '#ff1111']).mode('lch').colors(32)
        },
        seperator: {
            short: chroma.scale([$('#timer > span.seperator').css('color'), '#11ff11']).mode('lch').colors(32),
            mid: chroma.scale([$('#timer > span.seperator').css('color'), '#ffff11']).mode('lch').colors(32),
            long: chroma.scale([$('#timer > span.seperator').css('color'), '#ff1111']).mode('lch').colors(32)
        }
    }
    var x = setInterval(function () {
        upodateUI(x);
    }, 1 );
});
