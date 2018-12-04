/*
    This a copy of Vanilla theme.js filoe with some update for skelvanilla
    Broke dependency of Vanilla template
    Please, use theme.js or custom.js

*/


/**
 * The general Template closure.
 * This is to capsule eventual errors inside of the template function, so the general script all run as the should
 */
// Global constructor, used in multiple twig files
// eslint-disable-next-line no-unused-vars
var ThemeScripts = function(){
    // defining the console object once. Also filtered by the global setting
    // eslint-disable-next-line no-console
    var logObject = console.ls ? (window.debugState.frontend ? console.ls : console.ls.silent) : console;
    /**
     * The function focusFirst puts the Focus on the first non-hidden element in the Survey.
     * Normally this is the first input field (the first answer).
     */
    var focusFirst = function focusFirst()
    {
        $('#limesurvey :input:visible:enabled:first').focus();
    };

    /**
     * Set suffix/prefix clone for little screen (at top)
     */
    var sliderSuffixClone = function sliderSuffixClone(){
        $('.numeric-multi .slider-item .slider-right').each(function(){
            var colWidth='12';
            
            if($(this).closest('.slider-item').find('.slider-left').length){
                colWidth = '6';
            }

            $(this).clone().removeClass('col-xs-12').addClass('visible-xs-block col-xs-'+colWidth).prop('aria-hidden',true).insertBefore($(this).prev('.slider-container'));
            $(this).addClass('hidden-xs');
            $(this).closest('.slider-item').find('.slider-left').removeClass('col-xs-12').addClass('col-xs-6');
        });

    };

    /**
     * Hide some part if empty
     * Some can be needed if contain only js
     * Some are not really needed : little margin only is shown
     * Allowed content -> <script> and <img/>
     */
    var hideEmptyPart = function hideEmptyPart()
    {
        $('.question-help-container').each(function(){
            /* Only if have only script tag inside or empty tag */
            if($(this).text().trim()=='' && !/<img/.test($(this).html())){
                $(this).addClass('hidden');
            }
        });
        $('.group-description').each(function(){
            /* Only if have only script tag inside or empty tag */
            if($(this).text().trim()=='' && !/<img/.test($(this).html())){
                $(this).addClass('hidden');
            }
        });
        $('.question-help-container.hidden').on('html:updated',function(){
            if($(this).text().trim()!=''  && !/<img/.test($(this).html())){
                $(this).removeClass('hidden');
            }
        });
        // .question-help-container:not(.hidden) don't work ?
        $('.question-help-container').on('html:updated',function(){ 
            if($(this).text().trim()==''  && !/<img/.test($(this).html())){
                $(this).addClass('hidden');
            }
        });
    };

    var initTopMenuLanguageChanger = function(selectorItem, selectorGlobalForm){
        // $(selectorContainer).height($('#main-row').height());
        $(selectorItem).on('click', function(){
            var lang = $(this).data('limesurvey-lang');
            /* The limesurvey form exist in document, move select and button inside and click */
            $(selectorGlobalForm+' [name=\'lang\']').remove();                        // Remove existing lang selector
            $('<input type=\'hidden\'>').attr('name','lang').val(lang).appendTo($(selectorGlobalForm));
        });
    };

    var init = function(){

        /**
         * Code included inside this will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
         * @see https://learn.jquery.com/using-jquery-core/document-ready/
         * Also it will run on a complete pageload via the internal pjax system
         */
        $(document).on('ready pjax:scriptcomplete',function()
        {
            /* Uncomment below if you want to use the focusFirst function */
            //focusFirst();
            /* Some function are launched in endpage.pstpl */
            hideEmptyPart();
            // If list of nav-bar action is empty: remove it (else .navbar-toggle is shown on small screen) //
            if(!$('#navbar li').length){
                $('#navbar').remove();
                $('[data-target=\'#navbar\']').remove();
            }

            // Scroll to first error - After user close modal -
            if($('.input-error').length > 0 ||  $('.ls-em-error').length > 0 ) {
                $('#bootstrap-alert-box-modal').on('hidden.bs.modal', function () {

                    var $firstError = ($('.input-error').length > 0 ) ? $('.input-error').first() : $('.ls-em-error').first();

                    var $pixToScroll = ( $firstError.offset().top - 100 );
                    $('html, body').animate({
                        scrollTop: $pixToScroll + 'px'
                    }, 'fast');
                });
            }

            $('.language-changer').each(function(){
                var $that = $(this);
                if(!$.trim($that.children('div').html()))
                {
                    $that.hide();
                }
            });

            // Hide the menu buttons at the end of the Survey
            if($('.hidemenubutton').length>0)
            {
                $('.navbar-right').hide();
            }

            // Captcha action
            if($('#reloadCaptcha').length>0)
            {
                $('#reloadCaptcha').on('click', function(e){
                    e.preventDefault();
                    window.location.reload();
                });
            }

            // Survey list footer
            if($('#surveyListFooter').length>0)
            {
                var $surveyListFooter = $('#surveyListFooter');
                $('#outerframeContainer').after($surveyListFooter);
            }

            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });

            // Bind language changer onclick event.
            // This function is defined in assets/packages/limesurvey/survey.js
            // eslint-disable-next-line no-undef
            activateLanguageChanger();
            
            //Fix the navigation overflow
            fixBodyPadding();
        });

        var onkeyEventInput = function(e){
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code==13 && e.ctrlKey != true) {
                e.preventDefault();
                if($(this).closest('.question-container').hasClass('multiple-short-txt')){
                    if($(this).closest('.question-item').next('.question-item').length > 0) {
                        $(this).closest('.question-item').next('.question-item').find('input, textarea').first().focus();
                        return;
                    }
                }
                $(this).closest('.question-container').next('.question-container').find('input, textarea').first().focus();
            } else if (code==13 && e.ctrlKey == true) {
                $('.action--ls-button-submit').trigger('click');
            }
        };

        var onkeyEventTextarea = function(e){
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code==13 && e.altKey == true) {
                e.preventDefault();
                if($(this).closest('.question-container').hasClass('multiple-short-txt')){
                    if($(this).closest('.question-item').next('.question-item').length > 0) {
                        $(this).closest('.question-item').next('.question-item').find('input, textarea').first().focus();
                        return;
                    }
                }
                $(this).closest('.question-container').next('.question-container').find('input, textarea').first().focus();
            } else if (code==13 && e.ctrlKey == true) {
                $('.action--ls-button-submit').trigger('click');
            }
        };

        $(document).on('keydown', '.answer-container input', onkeyEventInput);
        $(document).on('keydown', '.answer-container textarea', onkeyEventTextarea);
    };

    var initUserForms = function(){
        sliderSuffixClone();
        hideEmptyPart();
    };
    var initGlobal = function(){
        sliderSuffixClone();
        if(jQuery.isFunction(window.templateCore.hideQuestionWithRelevanceSubQuestion)) {
            window.templateCore.hideQuestionWithRelevanceSubQuestion();
        }
        if(jQuery.isFunction(window.templateCore.hideMultipleColumn)) {
            window.templateCore.hideMultipleColumn();
        }
        hideEmptyPart();
    };

    var initWelcomePage = function(){
        logObject.log('Starting up for first page');
        if($('#datasecurity_accepted').length >0) {
            $('#ls-button-submit').prop('disabled', true);
            /* 
            * #### Animation function doesn't work on IE -> Deactivate until now.
            * $('#ls-button-submit').prop('disabled', true).parent().on('mouseenter', function(e){
            *    logObject.log('starting animation');
            *     if(!$('#datasecurity_accepted').prop('checked') && $(this).data('moving') != 1){
            *         e.preventDefault();
            *         var self = this;
            *         $(self).data('moving', 1);
            *         $('label[for=datasecurity_accepted]').animate({'zoom': '1.05'}, 500, function(){
            *             $('label[for=datasecurity_accepted]').animate({'zoom': '1'}, 500, function(){
            *                 $(self).data('moving', 0);
            *             });
            *         });
            *         return false;
            *     }
            * });
            */
            $('#datasecurity_accepted').on('change', function(){
                $('#ls-button-submit').prop('disabled', !$(this).prop('checked'));
            });

        }
    };

    return {
        init: init,
        initUserForms: initUserForms,
        initGlobal: initGlobal,
        initWelcomePage: initWelcomePage,
        focusFirst: focusFirst,
        sliderSuffixClone : sliderSuffixClone,
        hideQuestionWithRelevanceSubQuestion : window.templateCore.hideQuestionWithRelevanceSubQuestion,
        hideEmptyPart : hideEmptyPart,
        initTopMenuLanguageChanger: initTopMenuLanguageChanger,
        log: logObject
    };

};
