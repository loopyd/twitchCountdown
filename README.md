# Twitch Countdown Timer
A very good looking, highly customizable countdown timer for your stream.

This project is an independent fork of [markanderson96/twitchCountdown](https://github.com/markanderson96/twitchCountdown).

------------------
## Installation

1.  Download the ZIP (got to the green code button at top of page)
2.  Extract and place files where convenient.
3.  Add ``file://location/on/computer/index.html?m=1&s=0`` as a browser source in OBS/SLOBS/etc.
3.  Customize the timer to your liking.

---------------
## Customizing the Timer
You can follow this guide to customize your timer to your liking.

### Colors
You may edit any ``color:`` line in ``js/clock.css`` to customize the countdown timer's color scheme.

### Fonts
If you want to use another google font, modify the line below in ``index.html``:

```html
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inconsolata">
```

You can find fonts to use on [Google Fonts](https://fonts.google.com/).

### Countdown Time

The countdown timer is specified by adding GET arguments to the browser source URL.

GET variables you can add to index.html to customize the countdown time:

| Variable | Description            | 
| -------- | ---------------------- |
| d | Days |
| h | Hours |
| m | Minutes |
| s | Seconds |

---------------
## Notes

1.  The timer starts fresh every time the browser source loads anew.
2.  Advanced math is used to colorize and animate the timer via sine wave oscillation of precomputed chroma.js scale array indexes.
3.  You can change the layout of the timer as long as you match the HTML structure included in ``index.html``.  Deviating from the tag structure will cause issues.

---------------
## TODOs

1.  In a future update, we will allow support via a browser cookie to persist across browser instances.
2.  We plan to add a GET request variable to control the timer more than just autoplay on load.  Please stay tuned.
3.  We plan to add some GET variables to customize the color animation parameters.