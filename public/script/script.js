$(document).ready(function(){
  var date_input=$('input[name="date"]'); //our date input has the name "date"
  var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
  var options={
    format: 'dd/mm/yyyy',
    container: container,
    todayHighlight: true,
    autoclose: true,
    clearBtn: true,
    //defaultViewDate: { year: 1977, month: 04, day: 25 },  Change to Today's date
  };
  date_input.datepicker(options); 

});


(function toastBar() {
  var snackbarContainer = document.querySelector('#demo-toast-example');
  var showToastButton = document.querySelector('#demo-show-toast');
  showToastButton.addEventListener('click', function () {
    var data = { message: 'Data Saved' };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  });
} ());
