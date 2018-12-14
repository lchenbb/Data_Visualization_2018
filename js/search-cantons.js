var cantons = ["Ayeyarwady", "Bago", "Chin", "Kachin", "Kayah", "Kayin", "Magway",
"Mandalay", "Mon", "Rakhine", "Sagaing", "Shan", "Tanintharyi", "Yangon"];

let dropdown = document.getElementById("dropdownList");

function addElementsToList() {
  for(var canton of cantons) {
    $('#dropdownList').append('<a class="dropdown-item" href="#">' + canton + '</a>');
  }
}
