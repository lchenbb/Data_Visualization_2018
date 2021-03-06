var cantons = ["Ayeyarwady", "Bago", "Chin", "Kachin", "Kayah", "Kayin", "Magway",
"Mandalay", "Mon", "Rakhine", "Sagaing", "Shan", "Tanintharyi", "Yangon"];

let dropdown = document.getElementById("dropdownList");

function addElementsToList() {
  for(var canton of cantons) {
    $('#dropdownList').append('<li><a class="dropdown-item" href="#">' + canton + '</a></li>');
  }

  $("#dropdownList li").click(function () {
    $(this).parents(".dropdown").find('#dropdownSearch').html($(this).text() + ' <span class="caret"></span>');
    $(this).parents(".dropdown").find('#dropdownSearch').val($(this).data('value'));
    document.getElementById('myInput').value = $(this).text();
  });

  $("#dropdownListTimeline li").click(function(){
    $(this).parents(".dropdown").find('#dropdownSearchTimeline').html($(this).text() + ' <span class="caret"></span>');
    $(this).parents(".dropdown").find('#dropdownSearchTimeline').val($(this).data('value'));
  });
}
