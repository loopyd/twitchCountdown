var GetVars;
var countdown_config;
var initialDate;
var countdownDate;
var totalDistance;
var colors;

// Function to map a number within a range.
function mapRange(from, to, s) {
    return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
}

// Function to oscillate along a sine wave.
function oscillator(time, frequency = 1, amplitude = 1, phase = 0, offset = 0){
    return Math.sin(time * frequency * Math.PI * 2 + phase * Math.PI * 2) * amplitude + offset; 
}

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

// Function to simplify color table building code.
function getColorSet(query, prop, mix) {
    return {
        short: chroma.scale(
                [$(query).css(prop),
                chroma.mix($(query).css(prop), getDivCSSColor('shortcolor'), mix)]
            ).mode('lch').colors(countdown_config.color_precision),
        mid: chroma.scale(
                [$(query).css(prop),
                chroma.mix($(query).css(prop), getDivCSSColor('midcolor'), mix)]
            ).mode('lch').colors(countdown_config.color_precision),
        long: chroma.scale(
                [$(query).css(prop),
                chroma.mix($(query).css(prop), getDivCSSColor('longcolor'), mix)]
            ).mode('lch').colors(countdown_config.color_precision)
    }
}

// Function to fetch the countdown timer configuration
function getConfig() {
    var getVars = parseGet();
    countdown_config = {
        days: parseInt((!getVars['d']) ? 0 : getVars['d']),
        days_enabled: !(!getVars['d']),
        hours: parseInt((!getVars["h"]) ? 0 : getVars['h']),
        hours_enabled: !(!getVars['h']),
        minutes: parseInt((!getVars['m']) ? 0 : getVars['m']),
        minutes_enabled: !(!getVars['m']),
        seconds: parseInt((!getVars['s']) ? 0 : getVars['s']),
        seconds_enabled: !(!getVars['s']),
        color_precision: parseInt((!getVars['pr']) ? 32 : getVars['pr'])
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
}

// Function to get a css color by inspecting it from an invisible DOM node.
function getDivCSSColor(fromClass) {
    var $inspector = $("<div>").css('display', 'none').addClass(fromClass);
    $("body").append($inspector);
    try {
        var color = $inspector.css('color');
        return color;
    } finally {
        $inspector.remove();
    }
};

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

// Update the colors of the clock based on modulated sine wave oscillator.
function updateColors(_currentDistance, _totalDistance) {
    let percentage = (_totalDistance - _currentDistance) / _totalDistance;
    index = Math.round(oscillator((totalDistance * percentage) / 1000, mapRange([0.0, 1.0], [0.125, 1.0], 1.0 * percentage), Math.round(countdown_config.color_precision / 2), 0, Math.round(countdown_config.color_precision / 2)));
    if (percentage <= 0.5) {
        $('#timer > span.hours').css('color', colors.hours.long[index]);
        $('#timer > span.minutes').css('color', colors.minutes.long[index]);
        $('#timer > span.seconds').css('color', colors.seconds.long[index]);
        $('#timer > span.milliseconds').css('color', colors.milliseconds.long[index]);
        $('#timer > span.seperator').css('color', colors.seperator.long[index]);
        $('#bar').css('backgroundColor', colors.bar.long[index]);
    } else if (percentage > 0.5 && percentage <= 0.75) {
        $('#timer > span.hours').css('color', colors.hours.mid[index]);
        $('#timer > span.minutes').css('color', colors.minutes.mid[index]);
        $('#timer > span.seconds').css('color', colors.seconds.mid[index]);
        $('#timer > span.milliseconds').css('color', colors.milliseconds.mid[index]);
        $('#timer > span.seperator').css('color', colors.seperator.mid[index]);
        $('#bar').css('backgroundColor', colors.bar.mid[index]);
    } else {
        $('#timer > span.hours').css('color', colors.hours.short[index]);
        $('#timer > span.minutes').css('color', colors.minutes.short[index]);
        $('#timer > span.seconds').css('color', colors.seconds.short[index]);
        $('#timer > span.milliseconds').css('color', colors.milliseconds.short[index]);
        $('#timer > span.seperator').css('color', colors.seperator.short[index]);
        $('#bar').css('backgroundColor', colors.bar.short[index]);
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

// This function precomputes the color table for animation.
function updateColorTable() {
    colors = {
        hours: getColorSet('#timer > span.hours', 'color', 1.0, countdown_config.color_precision),
        minutes: getColorSet('#timer > span.minutes', 'color', 1.0, countdown_config.color_precision),
        seconds: getColorSet('#timer > span.seconds', 'color', 1.0, countdown_config.color_precision),
        milliseconds: getColorSet('#timer > span.milliseconds', 'color', 1.0, countdown_config.color_precision),
        seperator: getColorSet('#timer > span.seperator', 'color', 1.0, countdown_config.color_precision),
        bar: getColorSet('#bar', 'backgroundColor', 1.0, countdown_config.color_precision)
    }
}

// Countdown main thread.
$(document).ready(function () {
    getConfig();
    updateColorTable();
    var x = setInterval(function () {
        upodateUI(x);
    }, 1 );
});
