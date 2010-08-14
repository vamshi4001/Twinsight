
$(function(){
  $('input[name=keywords2]').keyup(function(){
    $('div.users').search($(this).val().toLowerCase())
  })
  
  $('input[name=keywords3]').keyup(function(){
    $('ul.users2 li').search($(this).val().toLowerCase(), 'by keyword')
  })
})