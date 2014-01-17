/* global $:true */
$(function() {
    'use strict';

    function setUpActiveTab() {
        if(localStorage.getItem('main-nav')){
            $('a[href="'+ localStorage['main-nav'] + '"]').tab('show');
        }
    }

    $('[data-tabid]').on('click', function(event) {
        var tabToActivate = $(this).attr('data-tabid');
        event.preventDefault();
        $('[data-toggle=tab][href="'+ tabToActivate + '"]').click();
        var anchor = $(this).attr('data-anchor');
        $(document).scrollTop( $(anchor).offset().top );
    });

    // ************************************************************************* //
    //  Initializations + Event listeners
    // ************************************************************************* //

    //
    // Store last clicked tab in local storage
    //
    $('#main-nav li').on('click', function(e) {
        e.preventDefault();
        localStorage['main-nav'] = $(this).find('a').attr('href');
    });

    //
    // Bind change events for options form checkboxes
    //
    $('#options-form input:checkbox').on('change', function(){
        setOptionDisplayState($(this));

        // Update localstorage
        var optionsArr = [];
        $('#options-form input:checkbox').each(function(i,el) {
            optionsArr.push($(el).is(':checked'));
        });
        localStorage.options = JSON.stringify(optionsArr);
    });

    // ************************************************************************* //
    //  Immediate function calls
    // ************************************************************************* //

    setUpActiveTab();
});
