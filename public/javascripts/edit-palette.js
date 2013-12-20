$(function(){

    /*------------------------------------------------------------------------------------------------------------------
    *                                            Event Listeners
    ------------------------------------------------------------------------------------------------------------------*/
    rowSize = $('.saved-colors-panel .row').width();
    currentColorsPerRow = savedColors.colorsPerRow(rowSize);

    // Check to see if the default color is a favorite
    colorInput.checkIfFavorite('408080');

    // Make them confirm reload or navigating away with unsaved changes
    $(window).on('beforeunload', function(){
        if(unsavedChanges) {
            return 'Looks like you have some unsaved changes. (Your favorite colors list will not be affected either way).';
        }
    });

    // Cancel palette button
    $('body').on('click', '.cancel-palette', function(e) {
        if(!unsavedChanges) {
            e.preventDefault();
            var newUrl = $('#confirm-page-modal').attr('data-url');
            window.location = newUrl;
            return false;
        }
    });

    // Save palette button
    $('body').on('click', '.save-palette', function(e) {
        var newUrl = $(this).attr('data-url');
        if(!unsavedChanges) {
            e.preventDefault();
            window.location = newUrl;
            return false;
        }
        else {
            alert('Palette will be saved');
            window.location = newUrl;
        }
    });

    // Confirm discard changes
    $('body').on('click', '.confirm-discard', function(e){
        var newUrl = $('#confirm-page-modal').attr('data-url');
        window.location = newUrl;
    });

    // Confirm remove all saved colors
    $('body').on('click', '.confirm-remove-all', function(){
        $('.saved-colors-panel .saved-color').remove();
        $('.saved-colors-panel .reorder-drop-spot').not('.last-drop-spot').remove();
    });

    /* Make selected-color-circle draggable */
    $('.selected-color-circle').draggable({
        containment: '.color-picker',
        scroll: false,
        drag: function(e) {
            var hue = colors.hue();
            var saturation = colors.saturation();
            var brightness = colors.brightness();

            $('#saturation-input').val(saturation);
            $('#brightness-input').val(brightness);

            var rgb = convert.hsvToRgb(hue, saturation, brightness);
            var hex = convert.rgbToHex(rgb);
            colorInput.updateRgb(rgb);
            colorInput.updateHex(hex);
            colorInput.checkIfFavorite(hex);
        }
    });

    /* Make selected-color-circle draggable */
    $('.selected-hue-arrows').draggable({
        axis: 'y',
        containment: '.hue-slider',
        scroll: false,
        drag: function() {
            var hue = colors.hue();
            var saturation = colors.saturation();
            var brightness = colors.brightness();

            $('#hue-input').val(hue);

            colorInput.updatePickerBackground(convert.hsvToRgb(hue, 100, 100));

            var rgb = convert.hsvToRgb(hue, saturation, brightness)
            var hex = convert.rgbToHex(rgb);
            colorInput.updateRgb(rgb);
            colorInput.updateHex(hex);
            colorInput.checkIfFavorite(hex);
        }
    });

    /* Click (mousedown) on the color picker image */
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
        var saturation = colors.saturation();
        var brightness = colors.brightness();

        $('#saturation-input').val(saturation);
        $('#brightness-input').val(brightness);

        var rgb = convert.hsvToRgb($('#hue-input').val(), saturation, brightness);
        var hex = convert.rgbToHex(rgb);
        colorInput.updateRgb(rgb);
        colorInput.updateHex(hex);
        colorInput.checkIfFavorite(hex);

        $circle.triggerHandler(e);
    });

    /* Click (mousedown) on the hue slider image */
    $('body').on('mousedown', '.hue-slider-backdrop', function(e){
        var posY = $(this).offset().top,
            $arrows = $('.selected-hue-arrows');
        if(e.pageY < posY || e.pageY > (posY + 256)) {
            return false;
        }
        $arrows.css({
            top: (e.pageY - posY) - 8.5
        });
        var hue = colors.hue();
        var saturation = colors.saturation();
        var brightness = colors.brightness();

        $('#hue-input').val(hue);
        colorInput.updatePickerBackground(convert.hsvToRgb(hue, 100, 100));

        var rgb = convert.hsvToRgb(hue, saturation, brightness);
        var hex = convert.rgbToHex(rgb);
        colorInput.updateRgb(rgb);
        colorInput.updateHex(hex);
        colorInput.checkIfFavorite(hex);

        $arrows.triggerHandler(e);
    });

    /* Color Attribute Input Boxes*/
    $('#hue-input, #saturation-input, #brightness-input').change(function(){
        var valid = colorInput.checkForValue($(this));

        if(!valid) {
            var hsv = convert.rgbToHsv(colors.red(), colors.green(), colors.blue());
            colorInput.updateHsv(hsv);
        }
        else {
            colorInput.newHsvInput();
        }
    });
    $('#hue-input, #saturation-input, #brightness-input').blur(function(){
        var valid = colorInput.checkForValue($(this));

        if(!valid) {
            var hsv = convert.rgbToHsv(colors.red(), colors.green(), colors.blue());
            colorInput.updateHsv(hsv);
        }
        else {
            colorInput.newHsvInput();
        }
    });
    $('#hue-input, #saturation-input, #brightness-input').keydown(function(e){
        var character = e.which;

        if(character !== 38 && character !== 40) {
            return;
        }

        var valid = colorInput.incDecValue($(this), character);

        if(valid) {
            colorInput.newHsvInput();
        }
    });
    $('#hue-input, #saturation-input, #brightness-input').keyup(function(e){
        var valid = colorInput.validateRgbOrHsv($(this), e);
    });
    $('#red-input, #green-input, #blue-input').change(function(){
        var valid = colorInput.checkForValue($(this));

        if(!valid) {
            var rgb = convert.hexToRgb(colors.hex());
            colorInput.updateRgb(rgb);
        }
        else {
            colorInput.newRgbInput();
        }

        $('#rgb-copy-text').val('rgb(' + colors.red() + ',' + colors.green() + ',' + colors.blue() + ')');
    });
    $('#red-input, #green-input, #blue-input').blur(function(){
        var valid = colorInput.checkForValue($(this));

        if(!valid) {
            var rgb = convert.hexToRgb(colors.hex());
            colorInput.updateRgb(rgb);
        }
        else {
            colorInput.newRgbInput();
        }
    });
    $('#red-input, #green-input, #blue-input').keydown(function(e){
        var character = e.which;

        if(character !== 38 && character !== 40) {
            return;
        }

        var valid = colorInput.incDecValue($(this), character);

        if(valid) {
            colorInput.newRgbInput();
        }
    });
    $('#red-input, #green-input, #blue-input').keyup(function(e){
        var valid = colorInput.validateRgbOrHsv($(this), e);
    });
    /* Hex Input Box */
    $('#hex-input').change(function(){
        colorInput.checkForHexValue($(this));
    });
    $('#hex-input').blur(function(){
        colorInput.checkForHexValue($(this));
    });
    $('#hex-input').click(function(){
            $(this).select();
        });
    $('#hex-input').keyup(function(e){
        var hexValue = $(this).val();
        var allowedChars = /[^0-9a-fA-F#]/;
        var hideAlert = true;
        var updateColor = false;
        var ignoreFirstChar = hexValue.substr(0,1) !== '#';

        if(allowedChars.test(hexValue)) {
            message.showWarning('Warning', 'Hex contains an invalid character. Legal characters include 0-9 and A-F.');
            hideAlert = false;
        }
        else if(hexValue.length === 3 && ignoreFirstChar) {
            updateColor = true;
        }
        else if(hexValue.length === 4 && !ignoreFirstChar) {
            hexValue = hexValue.substr(1,3);
            updateColor = true;
        }
        else if(hexValue.length === 6 && ignoreFirstChar) {
            updateColor = true;
        }
        else if(hexValue.length === 7 && !ignoreFirstChar) {
            hexValue = hexValue.substr(1,6);
            updateColor = true;
        }
        else if(hexValue.length > 6 && ignoreFirstChar) {
            message.showWarning('Warning', 'Hex value cannot contain more than 6 characters');
            hideAlert = false;
        }

        if(updateColor) {
            var rgb = convert.hexToRgb(hexValue);
            colorInput.checkIfFavorite(hexValue);
            colorInput.updateRgb(rgb);
            var hsv = convert.rgbToHsv(rgb[0], rgb[1], rgb[2]);
            colorInput.updatePickerBackground(convert.hsvToRgb(hsv[0], 100, 100));
            colorInput.updateColorPreview(hexValue);
            colorInput.updateHsv(hsv);
            colorInput.updateSliders(hsv);
        }

        if(hideAlert) {
            message.hideAlert();
        }
    });

    /* Register droppable event listener */
    eventListeners.makeDroppable();

    $('.add-color').click(function(){
        savedColors.addNewColor(null, $('.preview-tile'), true);
    });

    $(window).resize(function(){
        var newRowSize = $('.saved-colors-panel .row').width();

        if(rowSize === newRowSize) {
            return;
        }

        rowSize = newRowSize;
        savedColors.repositionRows(true, newRowSize);
    });

    /* Copy color to clipboard */
    var clip = new ZeroClipboard($('.copy-to-clipboard'), { moviePath: "assets/javascripts/ZeroClipboard.swf" });

    clip.on('dataRequested', function(client, args){
        message.showInfo('Copied', client.options.text + ' copied to clipboard!');
    });

    clip.on('mouseover', function(client, args){
        $(this).attr('title', 'Copy').tooltip().mouseover();
    });

    clip.on('mouseout', function(client, args){
        $(this).tooltip('destroy').mouseout();
    });

    /* Remove saved color */
    $('body').on('click', '.remove-wrapper', function(){
        savedColors.removeColor($(this).parents('.saved-color'));
    });

    /* Select a Favorite color */
    $('body').on('click', '#favorites-list .favorite-color', function(){
        $('#hex-input').val($(this).attr('data-hex')).keyup();
    });

    /* Toggle favorite */
    $('body').on('click', '.toggle-favorite-wrapper', function(){
        var $context = $(this);
        var $colorWrapper = $context.parents('.color-wrapper');
        var hex = $colorWrapper.attr('data-hex');
        if($colorWrapper.hasClass('favorite-color')) {
            // is a fav, remove it
            colorInput.removeFavorite(hex);
        }
        else {
            // is not a fav, add it
            colorInput.addFavorite(hex);
        }
    });

    // Toggle edit mode
    $('body').on('click', '.toggle-edit-wrapper', function() {
        var $color = $(this).parents('.color');

        if($color.parent().hasClass('editing-color')) {
            var hasChanges = savedColors.hasEditChanges();

            if(hasChanges) {
                $('#confirm-edit-modal').modal('show');
            }
            else {
                savedColors.endEdit();
            }
        }
        else {
            savedColors.startEdit($color)
        }
    });

    // Cancel out of edit mode
    $('body').on('click', '.cancel-edit', function(){
        var hasChanges = savedColors.hasEditChanges();

        if(hasChanges) {
            $('#confirm-edit-modal').modal('show');
        }
        else {
            savedColors.endEdit();
        }
    });

    $('body').on('click', '.confirm-edit-discard', function(){
        savedColors.endEdit();
    });

    $('body').on('click', '.save-edit, .confirm-edit-save', function(){
        var hasChanges = savedColors.hasEditChanges();

        if(hasChanges) {
            savedColors.saveEdit();
        }
        else {
            savedColors.endEdit();
        }
    });
});
