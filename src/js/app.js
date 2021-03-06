// ==========================
// Copyright © 2021 Accelor Software
// https://www.accelorsoftware.com
// ==========================

import "../css/style.css"
import { DateTime } from "luxon"
import Toastify from "toastify-js"
const apiurl = "/api"
const fetchUrl = `${apiurl}/launches.json` // ${apiurl}/launches
const primary = document.getElementById("launches")
window.location = "#launches"
let datacache = []
//var firstRender
var container


/* Fetch Launches */
async function fetchData() {
	console.log("Refreshing Data..")
	Toastify({
		text: "Refreshing Data..",
		duration: 2000,
		gravity: "bottom", // `top` or `bottom`
		position: "left" // `left`, `center` or `right`
	}).showToast()
	let response = await fetch(fetchUrl)
	var data = await response.json()

	// Sort from closest to furthest
	data = data.sort((a, b) => {
		var amili = new Date(a.launchdate)
		var bmili = new Date(b.launchdate)
		bmili = bmili.getTime()
		amili = amili.getTime()
		if (amili < bmili) return -1
		return amili > bmili ? 1 : 0
	})

	// Set data cache so we dont have to refresh as often
	datacache = data
	return (await data)
}


/* Display Launches*/
function displaydata(data) {  
	primary.innerHTML = ""
	for (var i = 0; i < data.length; i++) { // For each json item
    
		/* Create Elements */
		container = document.createElement("div") // Create an element
		primary.appendChild(container)


		/* Launch Time */
		if (data[i].launchdate !== "") {
			// Calculate Time
			var launchtime = DateTime.fromISO(data[i].launchdate) // THis is already in utc time
			var currenttime = DateTime.now().toUTC() // Get current utc time
			var difference
			if(-86400000 > currenttime.diff(launchtime).milliseconds) {
				difference = currenttime.diff(launchtime).toFormat("dd:hh:mm:ss") // If date is a long way away add day counter
			} else {
				difference = currenttime.diff(launchtime).toFormat("hh:mm:ss") // Short counter
			}
			// Add elements
			var countdown = document.createElement("div")
			container.appendChild(countdown) // Append Countdown
			countdown.classList.add("countdown")
    
			var timeRead = document.createElement("span")
			if (difference.includes("-")) { // Check if taken off
				timeRead.innerHTML = "T-"
				difference = difference.replace(/-/g, "")
			} else {
				timeRead.innerHTML = "T+"
				countdown.style.backgroundColor = "#1dac1d" // Set to green if taken off
			}
			countdown.appendChild(timeRead)
			var countdownDisplayElement = document.createElement("span")
			countdownDisplayElement.innerHTML = difference
			countdown.appendChild(countdownDisplayElement)
			var countdownDate = document.createElement("p")
			countdownDate.innerHTML = `Launch on: ${launchtime.toHTTP()}`
			countdownDate.classList.add("date")
			countdown.appendChild(countdownDate)

		}

		displayTitles(container, i, data)
		/* Button */
		if (data[i].buttonText) {
			var button
			if (data[i].youtubeWatchcode) { // If url exists
				button = document.createElement("button")
				button.innerHTML = `${data[i].buttonText}` // Set button text
				const videourl = `'https://www.youtube-nocookie.com/embed/${data[i].youtubeWatchcode}'` // Set iframe url
				button.setAttribute("onclick", `showvideo(${videourl})`)
				button.classList.add("black_button")
				container.appendChild(button)
			} else { // Deny access if stream non existant
				button = document.createElement("button")
				button.innerHTML = `${data[i].buttonText}`
				button.classList.add("black_button")
				button.setAttribute("title", "Stream hasn't started yet.")
				button.style.cursor = "not-allowed"
				button.style.backgroundColor = "rgb(128, 128, 128)"
				container.appendChild(button)
			}
		}
		/* Container Classes */
		container.classList.add("container") // Add the container class

		displayBackground(container, i, data)

	} 
	/* Add end thingo */ // Display the end of the list
	container = document.createElement("div")
	container.classList.add("container")
	container.style.color = "grey"
	container.style.userSelect = "none"
	primary.appendChild(container)
	container.innerHTML = `
  <h3>You've Reached the End..</h3> 
  <h4>Be sure to come back to see new launch updates.</h4>
  `
	//firstRender = false
}
function displayBackground(container, i, data) {
	/* Background Image */ // Final Background Modifications
	container.style.background = `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4) ), url(${data[i].backgroundImage})` 
	container.style.backgroundRepeat = "no-repeat"
	container.style.backgroundSize = "cover"
	container.style.backgroundPositionY = `${data[i].backgroundImagePlacement}%`
}
function displayTitles(container, i, data) {
	/* Title */
	var title = document.createElement("h3")
	title.innerHTML = `${data[i].title}`
	container.appendChild(title)

	/* Subheading */
	var subheading = document.createElement("h4")
	subheading.innerHTML = `${data[i].description}`
	container.appendChild(subheading)
}
async function start() {
	await fetchData()
	setIntervalFunction()
}
function setIntervalFunction() {
	displaydata(datacache)
	setInterval(function(){ displaydata(datacache) }, 1000)
	setInterval(fetchData, 30000)
}
start()
