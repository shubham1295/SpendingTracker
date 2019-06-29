$(document).ready(function(){
  var date_input=$('input[id="date"]'); //our date input has the name "date"
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

$(".myForm").submit(function(e) {

  e.preventDefault(); 

  var form = $(this);
  var url = form.attr('action');

  $.ajax({
         type: "POST",
         url: url,
         data: form.serialize(), 
         success: function(data)
         {
            // $("#total-amount").text(parseInt($("#total-amount").text()) + data.result.cost);

            // $("#table-body").append('<tr><td>' + data.result.item + '</td><td>' + data.result.cost + '</td><td>' + data.result.date + '</td></tr>');
            
            $.ajax({
              type: "GET",
              url: '/price',
              dataType:"json",
              success: function(data)
              {
                // console.log(data.totalExp);
                $("#total-amount").text(data.totalExp);

                $('.myForm')[0].reset();
                // toast ka JS
                var snackbarContainer = document.querySelector('#demo-toast-example');
                var data = { message: 'Data Saved' };
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
              }
            });
            
         }
       });

});
