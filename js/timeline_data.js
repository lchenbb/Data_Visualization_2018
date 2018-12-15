function setDropdownTimeline(value) {
  $(".dropdown").find('#dropdownSearchTimeline').html(value + ' <span class="caret"></span>');
  $(".dropdown").find('#dropdownSearchTimeline').val(value);
}
