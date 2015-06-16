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
		console.log(imageURL);
		$('body').css('background-image', 'url('+ imageURL +')');
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

$.event.props.push('dataTransfer');
$(window).on('dragenter', handleDragEnter);
$(window).on('dragover', handleDragOver);
$('.drop-window').on('dragleave', handleDragLeave);
$('.drop-window').on('dragend', handleDragLeave);
$(window).on('drop', handleFileSelect);

// get location
if (navigator.geolocation) {
  //Can use Geolocation.
  getLocation(); 
} else {
  //Can not use Geolocation
  console.log(failedStr);
}

// $.ajax('http://lorempixel.com/400/200',);
if(localStorage.itemName === null) {
  console.log('ダメでした');
} else {
  console.log('大丈夫でした');
}
localStorage.itemName = 'ああああ';


refleshTime();
