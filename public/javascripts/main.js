
$(function(){

    // Content pages - used for displaying pages
    T.contentPages.init();
    // Navigation - only #topnav so far
    T.initNavigation();

    // Timer controls
    T.initTimerControls();
});

window.T = (function ($,window,undefined) {

    var T = {};
    function pad(n){
        return n<10 ? '0'+n : n
    }
    function formatDate (d) {
        if (d.constructor !== Date) {
            d = new Date(d);
        }
        return pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '.' + pad(Math.floor(d.getMilliseconds()/10));
    }

    T.timer = (function(){
        // accepts a callback that will be called with the text formatted string so far
        return function (callback) {
            var timer,
                started,
                paused = 0;
            // return an object to control the timer
            return {
                stop: function () {
                    clearInterval(timer);
                    timer = null;
                    paused = 0;
                    end = new Date(new Date - started);
                    callback(formatDate(end));
                    return end;
                },
                pause: function () {
                    if (!timer) {
                        return;
                    }
                    clearInterval(timer);
                    timer = null;
                    paused = new Date - started;
                    callback(formatDate(paused));
                },
                isRunning: function () {
                    return !!timer;
                },
                start: function () {
                    clearInterval(timer);
                    started = new Date(new Date - paused);
                    paused = 0;
                    timer = setInterval(function(){
                        callback(formatDate(new Date - started));
                    },29);
                }
            };
        }
    })();

    T.contentPages = {
        all: null,
        init: function () {
            this.all = $('.content-page');
        },
        show: function (url) {
            var page = this.parseFragment(url);
            this.all.removeClass('visible').filter('#contentpage-'+page).addClass('visible');
        },
        parseFragment: function (url) {
            return url.split(/#!\//)[1];
        }
    };


    T.times = {
        times: [],
        add: function (time) {
            this.times.push(time);
        },
        remove: function (index) {
            delete times[index];
        },
        display: function () {
            var $ul = $('<ul></ul>');
            for (var i = 0; i < this.times.length; i++) {
                $ul.append($('<li>'+formatDate(this.times[i])+'</li>'));
            }
            return $ul;
        }
    };

    T.initTimerControls = function () {
        var timer = T.timer(function(str){
            $('#thetimer .clock').html(str);
        });
        var times = [];

        $(window).keydown(function(e){
            switch (e.keyCode) {
                // pause "p"
                case 80:
                    if (timer.isRunning()) {
                        timer.pause();
                    }
                    break;
                // space bar & enter
                case 13:
                case 32:
                    if (timer.isRunning()) {
                        var time = timer.stop();
                    } else {
                        timer.start();
                    }
                    break;
                // ignore keys.. shift, alt, command, control
                case 16:
                case 17:
                case 18:
                case 91:
                case 93:
                    break;
                // where's the any key?
                default:
                    if (timer.isRunning()) {
                        var time = timer.stop();
                    }
                    break;
            }
        });

    };
   
    T.initNavigation = function () {
        $('#topnav ul li a').click(function(){
            $li = $(this).closest('li');
            if ($li.is('.selected')) {
                return false;
            }
            $li.siblings('.selected').removeClass('selected');
            T.contentPages.show(this.href);
            $li.addClass('selected');
            return false;
        });
        $('#topnav ul li:first a').click();
    };


    return T;

})(jQuery,window);

