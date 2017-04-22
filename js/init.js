(function($){
  $(function(){
    $('.modal').modal();
    $('.special_Modal').modal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
    });
    $('select').material_select();
    $('.button-collapse').sideNav();
    $('.parallax').parallax();
    $(".dropdown-button").dropdown();
    $('.slider').slider();
    $('.tooltipped').tooltip({delay: 50});
    $('#add_User_CurrentUnit').characterCounter();
    $('.datepicker').pickadate({
   selectMonths: true, // Creates a dropdown to control month
   selectYears: 5,
   format: 'mm-dd-yyyy'  // Creates a dropdown of 15 years to control year
 });
  }); // end of document ready
})(jQuery); // end of jQuery name space
