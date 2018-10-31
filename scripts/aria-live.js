var TemplateAccessible = {
    init : function (options) {
        this.triggerEmClassChangeAccessible();
        this.triggerMandatoryUpdate();
    },
    triggerEmClassChangeAccessible: function () {
        $(document).on('classChangeError','.ls-em-tip', function () {
            if($(this).attr("role") != "alert") {
                parent = $(this).parent('.ls-question-help');
                $(this).closest(".question-container").find("[aria-describedby*='ls-question-help-']").attr("aria-invalid",true);
                $(this).attr("role","alert");
            }
        });
       $(document).on('classChangeGood','.ls-em-tip', function () {
            $(this).removeAttr("role");
            if($(this).parent('.ls-question-help').find(".ls-em-error").length == 0) {
                $(this).closest(".question-container").find("[aria-describedby*='ls-question-help-']").removeAttr("aria-invalid");
            }
        });
    },
    triggerMandatoryUpdate: function() {
        /* @todo #1 add (and remove) required to dropdown, input:text, input:radio and textarea according to relevance */
        /* @todo #2 dynamic "aria-invalid" on group for checkbox (multiple choice and array-number / checkbox */
        /* @todo #3 dynamic "aria-invalid" on dropdown, input:text and textarea */
    }
}
