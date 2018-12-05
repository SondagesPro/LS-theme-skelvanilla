var skelVanilla = {
    init : function (options) {
        this.addCheckedClass();
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
        $(document).ready(function(){
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
        $(document).ready(function(){
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


        $(document).ready(function(){
            $('li.radio-text-item input[type=text][value!=""]').closest('li.radio-text-item').addClass('answer-checked');
            $('li.checkbox-text-item input[type=text][value!=""]').closest('li.checkbox-text-item').addClass('answer-checked');
        });
    },
}
