# Twitch Countdown Timer
A very good looking countdown timer.

## Customizing the Timer
You can follow this guide to customize your timer to your liking.

### Colors
You may edit any ``color:`` line in clock.css to customize the countdown timer's color scheme.

### Fonts
If you want to use another google font, modify the line below in ``index.html``:

```html
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inconsolata">
```

You can find fonts to use on [Google Fonts](https://fonts.google.com/).

### Countdown time

The countdown timer is specified by adding GET arguments to the browser source URL.

GET variables you can add to index.html to customize the timer:

| Variable | Description            | 
| -------- | ---------------------- |
| d | Days |
| h | Hours |
| m | Minutes |
| s | Seconds |

## "Installation"

You don't really install this, just download the ZIP (got to the green code button at top of page), place where convenient and add 'index.html' as a browser source in OBS/SLOBS/etc, and pass in your countdown time as URL GET parameters.
