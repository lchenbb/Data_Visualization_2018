var cantons = ["Ayeyarwady", "Bago", "Chin", "Kachin", "Kayah", "Kayin", "Magway",
"Mandalay", "Mon", "Rakhine", "Sagaing", "Shan", "Tanintharyi", "Yangon"];

let dropdown = document.getElementById("dropdownList");

function addElementsToList() {
  for(var canton of cantons) {
    $('#dropdownList').append('<li><a class="dropdown-item" href="#">' + canton + '</a></li>');
  }

  $(".dropdown-menu li").click(function(){
    $(this).parents(".dropdown").find('#dropdownSearch').html($(this).text() + ' <span class="caret"></span>');
    $(this).parents(".dropdown").find('#dropdownSearch').val($(this).data('value'));
  });
}
