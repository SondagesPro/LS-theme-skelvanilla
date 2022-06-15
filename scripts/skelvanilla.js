/* @version 10.6.4 */
var skelVanilla = {
    init : function (options) {
        this.languageChanger();
        this.addCheckedClass();
        this.otherListRadio();
        this.otherListCheckbox();
        this.addHoverColumn();
        this.dynamicTip();
        if(options.removeBack) {
            this.removeBack();
        }
        this.disableEnterSubmit();
        this.topMenuAction();
        if(options.errorTopLinks) {
            this.errorTopLinks();
        }
        if(options.bodyLoaded) {
            this.bodyLoaded();
        }
        this.fixedHeaderRelated();
    },
    languageChanger : function () {
         $('form#limesurvey .form-change-lang [name="lang"] option:not(selected)').on('click', function(event) {
            $(this).closest(".form-change-lang").find('button:[value="changelang"]').trigger('click');
         });
         $('form#limesurvey button[value="changelang"]').on('click', function(event) {
            $("form#limesurvey").find(":required").removeAttr("required");
            $("form#limesurvey").find(":invalid").each(function(){
                $(this)[0].setCustomValidity('');
            });
         });
    },
    addCheckedClass : function () {
        /* radio in table */
        /* fix issue with no-answer not set … */
        $('td input[value=""]').closest('td').addClass('no-answer-item');
        $(document).on('click','td.radio-item [type=radio]',function(){
            $('[type=radio][name="'+$(this).attr('name')+'"]').not(this).each(function(){
                $(this).closest('td').removeClass('answer-checked');
            });
            $(this).closest('td').addClass('answer-checked');
        });
        $(function() {
            $('td.radio-item [type=radio][checked]').each(function(){
                $(this).closest('td').addClass('answer-checked');
            });
        });
        /* checkbox in table */
        $(document).on('click','td.checkbox-item',function(){
            if($(this).find("[type=checkbox]").is(':checked')){
                $(this).closest('td').addClass('answer-checked');
            }else{
                $(this).closest('td').removeClass('answer-checked');
            }
        });
        $(function() {
            $('td.checkbox-item [type=checkbox][checked]').each(function(){
                $(this).closest('td').addClass('answer-checked');
            });
        });
        /* focus on element in table */
        $(document).on('click','td.checkbox-item,td.radio-item',function(){
            $(this).find("input[type=checkbox],input[type=radio]").focus();
        });
        /* Other item */
        $(document).on('blur focusout','.other-text-item [type=text]',function(){
            if($(this).val()!=''){
                $(this).closest('li.radio-text-item,li.checkbox-text-item').addClass('answer-checked');
            }else{
                $(this).closest('li.radio-text-item,li.checkbox-text-item').removeClass('answer-checked');
            }
        });
        $(document).on('click','li.radio-item [type=radio]',function(){
            $(this).closest('ul').find('li.radio-text-item').removeClass('answer-checked');
        });
        $(document).on('click','li.radio-text-item [type=radio]',function(){
            $(this).closest('li.radio-text-item').removeClass('answer-checked');
        });
        $(document).on('click','li.radio-text-item',function(){
            $(this).find("input[type=text]").focus();
        });
        $(document).on('click','li.checkbox-text-item other-text-item [type=checkbox]',function(){
            $(this).closest('ul').find('li.checkbox-text-item').removeClass('answer-checked');
        });


        $(function() {
            $('li.radio-text-item input[type=text][value!=""]').closest('li.radio-text-item').addClass('answer-checked');
            $('li.checkbox-text-item input[type=text][value!=""]').closest('li.checkbox-text-item').addClass('answer-checked');
        });
    },
    dynamicTip : function () {
        $(".em_sq_fn_validation, .em_q_fn_validation").on("html:updated", function() {
            if($.trim($(this).text())) {
                $(this).removeClass("hidden");
            } else {
                $(this).addClass("hidden");
            }
        });
    },
    addHoverColumn: function () {
        $(".table-hover,.table-col-hover").on({
            mouseenter: function () {
                $(this).closest(".table-hover,.table-col-hover").find("col").eq($(this).parent(".answers-list,.subquestion-list").children().index($(this))).addClass("hover");
                $(this).closest(".table-hover,.table-col-hover").find("thead tr:not(.header_row),.ls-heading:not(.header_row)").find("th,td").eq($(this).parent(".answers-list,.subquestion-list").children().index($(this))).addClass("col-hover");
            },
            mouseleave: function () {
                $(this).closest(".table-hover,.table-col-hover").find("col").removeClass("hover");
                $(this).closest(".table-hover,.table-col-hover").find("thead tr:not(.header_row),.ls-heading:not(.header_row)").find("th,td").eq($(this).parent(".answers-list,.subquestion-list").children().index($(this))).removeClass("col-hover");
            }
        }, ".answer-item");
    },
    removeBack: function(){
        window.location.hash="nbb";
        window.location.hash="";
        window.onhashchange=function(){
            if(window.location.hash == "#nbb") {  window.location.hash=""; }
        };
    },
    errorTopLinks: function() {
        $(function() {
            if($('.submitted-error').length > 0 && $(".ls-questions-have-errors".length)) {
                $(".ls-questions-have-errors");
                var mandatoryList = "";
                $('.submitted-error .ls-question-mandatory').each( function() {
                    var linkName = $(this).closest("[id^='question']").attr('id');
                    mandatoryList += "<li><a href='#" + linkName + "' class='text-danger'>" + $(this).text() + "</a></li>";
                });
                if(mandatoryList) {
                    $("<ul>" + mandatoryList + "</ul>").appendTo(".ls-questions-have-errors > ul > li:first()");
                }
                var errorList = "";
                $('.submitted-error .ls-em-error').each( function() {
                    var linkName = $(this).closest("[id^='question']").attr('id');
                    errorList += "<li><a href='#" + linkName + "' class='text-danger'>" + $(this).text() + "</a></li>";
                });
                if(errorList) {
                    $("<ul>" + errorList + "</ul>").appendTo(".ls-questions-have-errors > ul > li:last()");
                }
            }
        });
    },
    bodyLoaded: function() {
        $(function() {
            $("body").removeClass("body-loading").addClass("body-loaded");
        });
        $("form#limesurvey button[type='submit']:not([data-confirmedby]), button[type='submit'][data-skelunload]").on('click',function(){
            if ($(this).closest('form').length && (!$(this).closest('form')[0].checkValidity || $(this).closest('form')[0].checkValidity())) {
                $("body").removeClass("body-loaded").addClass("body-loading");
            }
        });
        $("a[data-limesurvey-submit]:not([data-confirmedby]),a[data-limesurvey-lang]").on('click',function(){
            $("body").removeClass("body-loaded").addClass("body-loading");
        });
        $("form").on('submit',function(){
            $("body").removeClass("body-loaded").addClass("body-loading");
        });
        $("a.ls-return,a.external,a[rel='external'],.url-wrapper-survey-return a").on('click',function() {
            $("body").removeClass("body-loaded").addClass("body-loading");
        });
        /* Don't use unload, since pdf link don't unload but lauch unload … */
    },
    /* Disable enter on input:text, replace by a tab system */
    /* @link https://github.com/LimeSurvey/LimeSurvey/blob/05f0bf840c58bd4f3526527706eb8cfc8a00e7b2/themes/survey/vanilla/scripts/theme.js#L215-L248 */
    disableEnterSubmit : function () {
        $(document).on('keypress','#limesurvey input[type=text],#limesurvey select',function(e){
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key == 13 && e.ctrlKey != true ) {
                e.preventDefault();
                var inputs = $(this).closest('form').find(':input:visible:enabled,select:visible:enabled,textarea:visible:enabled,button:visible:enabled');
                if ((inputs.length-1) == inputs.index(this)) {
                    $('.action--ls-button-submit').focus();
                } else {
                    inputs.eq(inputs.index(this) + 1).focus();
                }
            }
        });
    },
    otherListRadio : function() {
        /* disable text-input : no tab indexed */
        $(function() {
            $('li.radio-text-item [type=radio]').not('[checked]').each(function(){
                $(this).closest('li').find('[type=text]').prop('disabled',true);
            });
        });
        $(document).on('click','li.radio-item [type=radio]',function(){
            $(this).closest('ul').find('li.radio-text-item').find("input[type=text]").prop('disabled',true);
        });
        $(document).on('click','li.radio-text-item [type=radio]',function(event){
            $(this).closest(".radio-text-item").find("input[type=text]").prop('disabled',false);
            event.stopPropagation();
        });
        $(document).on('click','li.radio-text-item',function(){
            $(this).find("input[type=radio]").click();
            $(this).find("input[type=text]").focus();
        });
    },
    otherListCheckbox : function() {
        /* Disable false checkbox, and never remove user entered value … */
        $(function() {
            $('li.checkbox-text-item .other-checkbox[type=checkbox]').each(function(){
                $(this).prop('disabled',true);
            });
            $('li.checkbox-text-item label[for$="othercbox"').each(function(){
                $(this).attr('for',$(this).attr('for').replace('othercbox', 'other'));
            });
        });
    },
    fixedHeaderRelated : function() {
        $(function() {
            if($("header.navbar-fixed-top").length) {
                var fixedHeaderHeight = $("header.navbar-fixed-top").height();
                $('.table-fixed-header .ls-answers > thead > tr > td,.table-fixed-header .ls-answers > thead > tr > th').each(function() {
                    $(this).css("top",fixedHeaderHeight+"px");
                    $(this).css("z-index",1040);
                });
            }
        });
        $( window ).resize(function() {
            if($("header.navbar-fixed-top").length) {
                var fixedHeaderHeight = $("header.navbar-fixed-top").height();
                $('.table-fixed-header .ls-answers > thead > tr > td,.table-fixed-header .ls-answers > thead > tr > th').each(function() {
                    $(this).css("top",fixedHeaderHeight+"px");
                });
            }
        });
    },
    /**
     * Removing href to top menu disable the onclick with key : fix it
     * See https://bugs.limesurvey.org/view.php?id=17586
     **/
    topMenuAction : function() {
        $("[data-limesurvey-move][role='button'],[data-limesurvey-submit][role='button'],[data-limesurvey-lang][role='button'],[data-toggle='dropdown']").on('keypress', function(event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                $(this).trigger('click');
            }
        });
        $("[data-limesurvey-move]").on("click", function() {
            event.preventDefault();
            var value = $(this).attr('data-limesurvey-move');
            var buttons = $("button[type=submit][name=move][value=" + value + "], input[type=submit][name=move][value=" + value + "]");
            if( !buttons.length) {
                $("<button/>",{
                    'type':"submit",
                    'name':"move",
                    'value':value,
                }).appendTo('form#limesurvey');
            }
            buttons.last().trigger('click');
        });
    }
};
