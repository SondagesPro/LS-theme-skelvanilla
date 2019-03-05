/**
 * Javascript for better accessibility.
 * Original can be found on https://gitlab.com/SondagesPro/SurveyThemes/accessible_vanilla/blob/master/scripts/aria-live.js
 * @author Denis Chenu <https://sondages.pro
 * @license magnet:?xt=urn:btih:c80d50af7d3db9be66a4d0a86db0286e4fd33292&dn=bsd-3-clause.txt BSD 3 Clause
 */
var TemplateAccessible = {
    init : function (options) {
        if(options.dynamicValidity) {
            this.disableValidityCheck();
        }
        this.triggerEmClassChangeAccessible();
        if(options.dynamicValidity) {
            this.triggerMandatoryUpdate();
        }
        this.triggerHtmlUpdated();
        this.triggerRelevanceOnOff();
    },
    disableValidityCheck: function() {
        $(document).on("click","button[data-disable-check-validity]",function(event,data) {
            $("form#limesurvey").find("[required]").removeAttr("required");
        });
        //~ $(document).on("click","[data-limesurvey-submit]:not([data-check-validity]"
    },
    triggerEmClassChangeAccessible: function () {
        /* @todo : check :valid and setCustomValidity */
        $(document).on('classChangeError','.ls-em-tip', function () {
            if($(this).attr("role") != "alert") {
                parentId = $(this).parent('.ls-question-help').attr("id");
                $("[aria-describedby*='"+parentId+"']").attr("aria-invalid",true);
                $("[aria-labelledby*='"+parentId+"']").attr("aria-invalid",true);
                $(this).attr("role","alert");
            }
        });
        $(document).on('classChangeGood','.ls-em-tip', function () {
            $(this).removeAttr("role");
            if($(this).parent('.ls-question-help').find(".ls-em-error").length == 0) {
                parentId = $(this).parent('.ls-question-help').attr("id");
                $("[aria-describedby*='"+parentId+"']").removeAttr("aria-invalid");
                $("[aria-labelledby*='"+parentId+"']").removeAttr("aria-invalid");
            }
        });
        //~ $(document).on('classChangeGood classChangeError','.ls-em-tip', function () {
            //~ TemplateAccessible.setCustomValidityBy($(this).parent('.ls-question-help'));
        //~ });
    },
    triggerMandatoryUpdate: function() {
        /* WIP */
        $("[id^='question'].mandatory").each(function() {
            $(this).find('.text-item input:text,.text-item textarea,.dropdown-item select,radio-item input:radio').attr('required',true);
        });
        $("[id^='question'].mandatory").on('relevance:on',function(event,data) {
            $(this).find('.text-item input:text,.text-item textarea,.dropdown-item select,radio-item input:radio').attr('required',true);
        });
        $("[id^='question'].mandatory").on('relevance:off',function(event,data) {
            $(this).find('.text-item input:text,.text-item textarea,.dropdown-item select,radio-item input:radio').removeAttr('required');
        });
    },
    triggerHtmlUpdated : function() {
        $("[id^='LEMtailor_']").on("html:updated",function(event,data) {
            if($(this).is(":visible") && !$(this).attr("aria-live")) {
                $(this).attr("aria-live","polite");
            }
        });
    },
    triggerRelevanceOnOff: function() {
        this.triggerRelevanceOnOffQuestion();
        this.triggerRelevanceOnOffSubQuestion();
    },
    triggerRelevanceOnOffQuestion: function() {
        $(document).on('relevance:on',"[id^='question']",function(event,data) {
            /* @todo : attach only to this. Use http://stackoverflow.com/a/6411507/2239406 solution for now. 
            Don't want to stop propagation. */
            if(event.target != this) return;
            if($(this).attr("hidden")) {
                $(this).attr("aria-live",'polite');
            }
            $(this).attr("hidden",false);
            $(this).attr("aria-hidden",false);
        });
        $(document).on('relevance:off',"[id^='question']",function(event,data) {
            if(event.target != this) return;
            if(!$(this).attr("hidden")) {
                $(this).attr("aria-live",'polite');
            }
            $(this).attr("hidden",true);
            $(this).attr("aria-hidden",true);
        });
    },
    triggerRelevanceOnOffSubQuestion: function() {
        this.hideQuestionWithRelevanceSubQuestion();
        $("[id^='question']").on('relevance:on',"[id^='javatbd']",function(event,data) {
            if(event.target != this) return;
            data = $.extend({style:'hidden'}, data);
            if(data.style=='disabled'){
                if($(event.target).attr("aria-disabled")) {
                    $(event.target).attr("aria-live",'polite');
                }
                $(event.target).attr("aria-disabled",false);
            }
            if(data.style=='hidden'){
                if($(event.target).attr("hidden")) {
                    $(event.target).attr("aria-live",'polite');
                }
                $(event.target).attr("hidden",false);
                $(event.target).attr("aria-hidden",false);
            }
        });
        $("[id^='question']").on('relevance:off',"[id^='javatbd']",function(event,data) {
            if(event.target != this) return;
            data = $.extend({style:'hidden'}, data);
            if(data.style=='disabled'){
                if(!$(event.target).attr("aria-disabled")) {
                    $(event.target).attr("aria-live",'polite');
                }
                $(event.target).attr("aria-disabled",true);
            }
            if(data.style=='hidden'){
                if(!$(event.target).attr("hidden")) {
                    $(event.target).attr("aria-live",'polite');
                }
                $(event.target).attr("hidden",true);
                $(event.target).attr("aria-hidden",true);
            }
        });
    },
    hideQuestionWithRelevanceSubQuestion: function () {
        if(!jQuery.isFunction(window.templateCore.hideQuestionWithRelevanceSubQuestion) ) {
            return;
        }
        /* What happen if the function is here, but is it launched ? */
        $("[id^='question']:not(.ls-irrelevant)").on('relevance:on', "[id^='javatbd']", function (event, data) {
            if (event.target != this) return; // not needed now, but after (2016-11-07)
            data = $.extend({style:'hidden'}, data);
            if (data.style == 'hidden') {
                var targetQuestion = $(this).closest("[id^='question']");
                if($(targetQuestion).attr("hidden")) {
                    $(targetQuestion).attr("aria-live",'polite');
                }
                $(targetQuestion).attr("hidden",false);
                $(targetQuestion).attr("aria-hidden",false);
            }
        });
        $("[id^='question']:not(.ls-hidden)").on('relevance:off', "[id^='javatbd']", function (event, data) {
            if (event.target != this) return; // not needed now, but after (2016-11-07)
            data = $.extend({style:'hidden'}, data);
            if (data.style == 'hidden') {
                var targetQuestion = $(this).closest("[id^='question']");
                if ($(targetQuestion).find("[id^='javatbd']:visible").length == 0) {
                    if(!$(targetQuestion).attr("hidden")) {
                        $(targetQuestion).attr("aria-live",'polite');
                    }
                    $(targetQuestion).attr("hidden",true);
                    $(targetQuestion).attr("aria-hidden",true);
                }
            }
        });
    },
    hideMultipleColumn: function () {
        /* @todo … */
    },
    setCustomValidityBy : function(element) {
        if($(element).length == 0) {
            return;
        }
        if(!$(element).hasClass("ls-question-help")) {
            return;
        }
        /* @todo, but must fix relevance on subquestion before */
    }
}
