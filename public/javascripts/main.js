$(function(){
    $('.toggle-bg-color').click(function(){
        $('body').toggleClass('dark');
        //$(this).toggleClass('btn-primary').toggleClass('btn-default')
    });

    $( ".selected-color-circle" ).draggable({
        containment: ".color-picker",
        scroll: false,
        drag: function() {
            var saturation = calcSaturation();
            var brightness = calcBrightness();
            $('.saturation').html(saturation);
            $('.brightness').html(brightness);
        }
    });

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