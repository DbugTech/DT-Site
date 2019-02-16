require('trumbowyg');
jQuery(function ($) {
    "use strict";
    $('textarea.editor').trumbowyg({
        autogrow: true,
        svgPath: 'assets/img/icon/icons.svg' // or a path like '/assets/my-custom-path/icons.svg'
    });
}).on('tbwinit', function(){
    $('.trumbowyg-box').addClass('p-0 m-0 form-control');
});
