$(function(){
    /*------------------------------------------------------------------------------------------------------------------
    *                                            Event Listeners
    ------------------------------------------------------------------------------------------------------------------*/

    $('.show-tooltip').tooltip({ showHtml: true});

    /* Background Color Toggle*/
    $('.toggle-bg-color').click(function(){
        $('body').toggleClass('dark');
    });
});

/*----------------------------------------------------------------------------------------------------------------------
*                                            Alert Functions
----------------------------------------------------------------------------------------------------------------------*/
var message = {
    baseHtml: function(title, content) {
        return '<div class="alert alert-dismissable"><button type="button" class="close" data-dismiss="alert">×</button><h4>' + title + '</h4><p>' + content + '</p></div>';
    },
    showWarning: function(title, content) {
        var $baseHtml = $(this.baseHtml(title, content));
        $baseHtml.addClass('alert-warning');
        $('.alert-container').html($baseHtml);
        $baseHtml.fadeIn();
    },
    hideAlert: function() {
        $('.alert').fadeOut('slow', function(){
            $(this).html('');
        });
    },
    showSuccess: function(title, content) {
        var $baseHtml = $(this.baseHtml(title, content));
        var $alertContainer = $('.alert-container');
        $baseHtml.addClass('alert-success');
        var dateTime = new Date().getTime();
        $baseHtml.attr('data-time-stamp', dateTime);
        $alertContainer.append($baseHtml);
        var $thisAlert = $alertContainer.find('.alert-success').filter(function(){
             return $(this).attr('data-time-stamp') === dateTime.toString();
         });
        $thisAlert.fadeIn('slow', function(){
            $thisAlert.delay(3000).fadeOut('slow', function(){
                $thisAlert.html('');
            });
        });
    },
    showInfo: function(title, content) {
        var $baseHtml = $(this.baseHtml(title, content));
        var $alertContainer = $('.alert-container');
        $baseHtml.addClass('alert-info');
        var dateTime = new Date().getTime();
        $baseHtml.attr('data-time-stamp', dateTime);
        $alertContainer.append($baseHtml);
        var $thisAlert = $alertContainer.find('.alert-info').filter(function(){
             return $(this).attr('data-time-stamp') === dateTime.toString();
         });
        $thisAlert.fadeIn('slow', function(){
            $thisAlert.delay(3000).fadeOut('slow', function(){
                $thisAlert.html('');
            });
        });
    }
};
