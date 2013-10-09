$(function(){
    $('.toggle-bg-color').click(function(){
        $('body').toggleClass('dark');
        //$(this).toggleClass('btn-primary').toggleClass('btn-default')
    });

    $('.selected-color-circle').draggable({
        containment: ".color-picker",
        scroll: false,
        drag: function(e) {
            var saturation = calcSaturation();
            var saturation = calcSaturation();
            var brightness = calcBrightness();
            $('.saturation').html(saturation);
            $('.brightness').html(brightness);
        }
    });

    $('body').on('mousedown', '.color-picker-backdrop', function(e){
        var posX = $(this).offset().left,
            posY = $(this).offset().top,
            $circle = $('.selected-color-circle');
        if(e.pageY < posY || e.pageY > (posY + 256) || e.pageX < posX || e.pageX > (posX + 256)) {
            return false;
        }
        $circle.css({
            top: (e.pageY - posY) - 8.5,
            left: (e.pageX - posX) - 8
        });
        var saturation = calcSaturation();
        var brightness = calcBrightness();
        $('.saturation').html(saturation);
        $('.brightness').html(brightness);
        $('.pixel-offset').html(((e.pageX - posX) - 8)+ ' , ' + ((e.pageY - posY) - 8.5));

        if ($(this).attr('id') == $(event.target).attr('id')) {
        }
        $circle.triggerHandler(e);
    });

    $('body').on('click', '.hue-slider-backdrop', function(e){
        var posY = $(this).offset().top;
        if(e.pageY < posY || e.pageY > (posY + 256)) {
            return false;
        }
        $('.selected-hue-arrows').css({
            top: (e.pageY - posY) - 8.5
        });
        var hue = calcHue();
        $('.hue').html(hue);
        $('.pixel-offset').html((e.pageY - posY) - 8.5);
    });

    $('.selected-hue-arrows').draggable({
        axis: 'y',
        containment: ".hue-slider",
        scroll: false,
        drag: function() {
            var hue = calcHue();
            $('.hue').html(hue);
        }
    });

    function calcHue() {
        var pos = $('.selected-hue-arrows').css('top')
        pos = parseInt(pos);
        var div = 256/360;
        return 360 - Math.round((pos + 8)/div);
    }

    function calcSaturation() {
        var pos = $('.selected-color-circle').css('left')
        pos = parseInt(pos);
        return Math.round((pos + 8)/2.56);
    }

    function calcBrightness() {
        var pos = $('.selected-color-circle').css('top');
        pos = parseInt(pos);
        return Math.round(100 - (pos + 8) / 2.56);
    }
});