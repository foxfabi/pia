// Copyright 2014-2015 Twitter, Inc.
// Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  var msViewportStyle = document.createElement('style')
  msViewportStyle.appendChild(
    document.createTextNode(
      '@-ms-viewport{width:auto!important}'
    )
  )
  document.querySelector('head').appendChild(msViewportStyle)
}

var video = document.querySelector("#video");
var canvas = document.querySelector("#vexp");

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

function handleVideo(stream) {
  video.srcObject=stream;
}
 
function videoError(error) {
  console.error('An error occurred: [CODE ' + error.code + ']');
}

function getType(){
  var choosedType = document.querySelector("#AlterationType");
  return choosedType.value;
}

function getFilter(){
  var filterType = document.querySelector("#FilterType");
  return filterType.value;
}


$(document).ready(function(){
  $('#warning').hide();
  var data_start_type = $('#AlterationValue').attr('data-start-type');
  var $data_type_elem = $('[data-type='+data_start_type+']');
  $('#AlterationType').val($data_type_elem.text());
  data_start_type = $('#FilterValue').attr('data-start-type');
  $data_type_elem = $('[data-type='+data_start_type+']');
  $('#FilterType').val($data_type_elem.text());
  
  if (navigator.getUserMedia) {   
    // Good to go!
    navigator.getUserMedia({video: true}, handleVideo, videoError);
    try {
      video.play();
    } catch (e) {
      videoError(e);
    }
  } else {
    console.log('Native device media streaming (getUserMedia) not supported in this browser.');
    $('#warning').show();
    $('#vexp').hide();
  }
  $('#spinner').hide();
  
  $('#save').click(function() {
    //e.preventDefault(); //stop the click action
    $(this).attr('href', canvas.toDataURL());
    $(this).attr('download', "pia.png");
  });
    
});

$(function(){
  $("#menu-type li a").click(function(){
    $('#AlterationType').val($(this).text());
 });
  $("#menu-filter li a").click(function(){
    $('#FilterType').val($(this).text());
 });
});