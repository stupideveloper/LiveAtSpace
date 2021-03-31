// ==========================
// Copyright © 2021 Accelor Software
// https://www.accelorsoftware.com
// ==========================

import '../css/style.css'
import { DateTime } from "luxon";
const apiurl = "https://api.liveatspace.com"
const primary = document.getElementById("primary")

/* Show Loader */
primary.innerHTML = '<h3 style="text-align: center">Loading..</h3>'
/* Fetch Launches */
async function fetchData() {
  let response = await fetch(`${apiurl}/launches`);
  var data = await response.json();
  // Sort from closest to furthest
  data = data.sort((a, b) => {
    var amili = new Date(a.launchdate);
    var bmili = new Date(b.launchdate);
    bmili = bmili.getTime()
    amili = amili.getTime()
    if (amili < bmili) return -1
    return amili > bmili ? 1 : 0
  })
  
  displaydata(data)
}
/* Display Launches*/
function displaydata(data) {
  primary.innerHTML = ''
  console.log('Refreshing Data..')
  for (var i = 0; i < data.length; i++) {
    /* Create Elements */
    var container = document.createElement("div");
    primary.appendChild(container);

    /* Tags */
    if (data[i].tag !== "") {
      var tags = document.createElement("h2");
      if (data[i].tag == 'Live') {
        tags.innerHTML = `<div class="tags"><span class="live">LIVE</span></div>`;
      } 
      else if (data[i].tag == 'Replay'){
        tags.innerHTML = `<div class="tags"><span class="replay">REPLAY</span></div>`;
      } 
      else if (data[i].tag == 'Soon'){
        tags.innerHTML = `<div class="tags"><span class="soon">SOON</span></div>`;
      } 
      else if (data[i].tag == 'Unknown'){
        tags.innerHTML = ``;
      }
      container.appendChild(tags);
    }

    /* Launch Time */
      if (data[i].launchdate !== "") {
      // Calculate Time
      var launchtime = DateTime.fromISO(data[i].launchdate)
      var currenttime = DateTime.now().toUTC()
      if(-86400000 > currenttime.diff(launchtime).milliseconds) {
        var difference = currenttime.diff(launchtime).toFormat("dd:hh:mm:ss")
      } else {
        var difference = currenttime.diff(launchtime).toFormat("hh:mm:ss")
      }
      // Add elements
      var countdown = document.createElement("div");
      container.appendChild(countdown);
      countdown.classList.add("countdown")
      
      var timeRead = document.createElement("span");
      if (difference.charAt(0) == '-') {
        timeRead.innerHTML = "T-"
        difference = difference.replace(/-/g, "")
      } else {
        timeRead.innerHTML = "T+"
        
      }
      countdown.appendChild(timeRead)
      var countdownDisplayElement = document.createElement("span")
      countdownDisplayElement.innerHTML = difference
      countdown.appendChild(countdownDisplayElement)
    }
    /* Title */
    var title = document.createElement("h2");
    title.innerHTML = `${data[i].title}`;
    container.appendChild(title);

    /* Subheading */
    var subheading = document.createElement("h3");
    subheading.innerHTML = `${data[i].description}`
    container.appendChild(subheading);
    /* Button */
    if (data[i].buttonText) {
      if (data[i].youtubeWatchcode) {
        var button = document.createElement("button")
        button.innerHTML = `${data[i].buttonText}`
        const videourl = `'https://www.youtube-nocookie.com/embed/${data[i].youtubeWatchcode}'`
        button.setAttribute("onclick", `showvideo(${videourl})`)
        button.classList.add("black_button")
        container.appendChild(button)
      } else {
        var button = document.createElement("button")
        button.innerHTML = `${data[i].buttonText}`
        button.classList.add("black_button")
        button.setAttribute("title", "Stream hasn't started yet.")
        button.style.cursor = "not-allowed"
        container.appendChild(button)
      }
    }


    /* Container Classes */
    container.classList.add("container");

    /* Background Image */
    container.style.background = `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4) ), url(${apiurl}${data[i].backgroundImage.formats.medium.url})`
    container.style.backgroundRepeat = "no-repeat"
    container.style.backgroundSize = "cover"
    container.style.backgroundPositionY = `${data[i].backgroundImagePlacement}%`

    
  } 
  /* Add end thingo */
  var container = document.createElement("div");
  container.classList.add("container")
  container.style.color = "grey"
  container.style.userSelect = "none"
  primary.appendChild(container);
  container.innerHTML = `
  <h2>You've Reached the End..</h2> 
  <h3>Be sure to come back to see new launch updates.</h3>
  `
}
fetchData()
//setInterval(fetchData, 1000);
