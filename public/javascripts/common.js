$( document ).ready(function() {
    console.log( "ready!" );

    // value
    // $( "div.progressbar" ).progressbar({
    //   value: 37
    // });

    $("div.progressbar").each(function(){
        var $progressbar = $(this);
        var percentage = $progressbar.data("percentage");

        $progressbar.progressbar({
          value: percentage * 100
        });

        $progressbar.find('div.progress-label').text(numeral(percentage).format('0%'))
    });

    $("#mow-the-lawn").click(function() {
      $("#classifyText").val("Mow the Lawn")
      $("#classifyForm").submit();
    });

    $("#email-manager").click(function() {
      $("#classifyText").val("Email Manager")
      $("#classifyForm").submit();
    });
});