'use strict';

// -----------------
// variables
// -----------------

var succesStr = 'Can get your data.';
var failedStr = 'Cannot get your data.';

// -----------------
// functions
// -----------------

// Get Time
// -----------------
function getTime() {
	var d = new Date();
	var hours = d.getHours();
	var minutes = d.getMinutes();
	return {
		'hours' : hours,
		'minutes' : minutes,
	};
}

function alignDigit(variables){
	if (Math.floor(variables / 10) === 0) {
		variables = '0' + variables;
	}
	return variables;
}

function refleshTime(){
	var t = getTime();
	var hours = alignDigit(t.hours);
	var minutes = alignDigit(t.minutes);
	$('#hours').text(hours);
	$('#minutes').text(minutes);
}

// Get Celsius
// -----------------
function successCallback(position){
	console.log(succesStr);
	var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  console.log(lat + ' & ' + lng);
  var url = 'http://openweathermap.org/data/2.1/find/city?lat=' + lat + '&lon=' + lng + '&callback=?';
	$.getJSON(url, function(data) {
		var celsius = Math.floor(data.list[0].main.temp - 273.15);
		console.log(celsius);
		$('.temp').text(celsius);
		if (celsius !== null && celsius !== undefined) {
			$('.temperature').removeClass('out').addClass('in');
		}
	});
}

function errorCallback(error){
	switch(error.code){
	  case 1:
	    console.log(error.message);
	    break;
	  case 2:
	    console.log(error.message);
	    break;
	  case 3:
	    console.log(error.message);
	    break;
	}
}

function getLocation() {
	// get user's location at onece.
  navigator.geolocation.getCurrentPosition(
  	successCallback, errorCallback, {maximumAge:10000}
	);
}

// File Upload
// -----------------
function handleDragLeave(){
	$('.app').removeClass('blur');
	$('.drop-window').removeClass('overray fade in');
	$('.drop-window').addClass('none');
}

function handleFileSelect(e){
	e.stopPropagation();
  e.preventDefault();

	var f = e.dataTransfer.files[0];
	$('#list').text(f.name);
	console.log(f.name);

	if (!f.type.match('image.*')) {
		console.log('Upload only images');
		return false;
	}

	var reader = new FileReader();
	reader.readAsDataURL(f);
	reader.onload = function(e){
		var imageURL = e.target.result;

		// TODO
		// スロット3つ用意
		// 空いているスロットに画像を格納
		// 全て埋まっている場合は古い順から

		localStorage.upload = imageURL;
		if (localStorage.upload !== null) {
			console.log(localStorage.upload);
			$('body').css('background-image', 'url('+ localStorage.upload +')');
		}
	};

	handleDragLeave();
}

function handleDragEnter(){
	$('.app').addClass('blur');
	$('.drop-window').removeClass('none').addClass('overray fade in');
}

function handleDragOver(e){
	e.stopPropagation();
  e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}

// -----------------
// Execution
// -----------------

setInterval(function(){
  window.scrollTo(0, 1);
},0);

// text color change
$('body').click(function(){
	$(this).toggleClass('white');
});
// touch device
$('body').on('touchend', function(){
	$(this).toggleClass('white');
});


$.event.props.push('dataTransfer');
$('.settings').on('tap', handleDragEnter);
$('body').on('dragenter', handleDragEnter);
$('body').on('dragover', handleDragOver);
$('.drop-window').on('dragleave', handleDragLeave);
$('.drop-window').on('dragend', handleDragLeave);
$('.drop-window').on('tap', handleDragLeave);
$('.drop-window').on('drop', handleFileSelect);


// get location
if (navigator.geolocation) {
  //Can use Geolocation.
  getLocation(); 
} else {
  //Can not use Geolocation
  console.log(failedStr);
}

$('body').css('background-image', 'url('+ localStorage.upload +')');
refleshTime();
setInterval(refleshTime,1000);