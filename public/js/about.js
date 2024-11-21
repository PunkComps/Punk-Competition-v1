import {db, collection , doc, getDoc } from "../firebase.js"; 

let heading = document.getElementById("heading");
let para= document.getElementById("para")
let img = document.getElementById("img")
let loader = document.getElementById("loader")
let fullDescription = document.getElementById("fullDescription")
let raedMoreBtn = document.getElementById("raedMoreBtn")

window.onload = function () {
  let MainLoader = document.getElementById("MainLoader");
  let mainContentWrapper = document.getElementById("mainContentWrapper");
  MainLoader.style.display = "none"; // Hide loader
  mainContentWrapper.style.display = "block"; // Show content
};

const AboutSection = async () => {
  loader.innerHTML = `<div class="loader-div"><span class="loader"></span></div>`
    try {
      const docRef = doc(db, "about", "aboutSection");
      const docSnap = await getDoc(docRef);
      loader.innerHTML = ''
      if (docSnap.exists()) {
        const { Heading, About , AboutImage} = docSnap.data();
        heading.innerHTML = Heading;  // Display the heading in the HTML element
        para.innerHTML = About.slice(0, 100) + '...'; 
        img.innerHTML = `<img id="img" src="${AboutImage}" class="about_img">` 
             // Display the about text in the paragraph element
        console.log("Document data:", docSnap.data());
        const moreAbout = ()=>{
          fullDescription.innerText = About;
        }
        raedMoreBtn.addEventListener('click' , moreAbout)
      } else {
        console.log("No such document!");
        loader.innerHTML = `<div class="loader-div"><span>No such document!</span></div>`
      }
    } catch (error) {
      console.log("Error retrieving document: ", error);
      loader.innerHTML = `<div class="loader-div"><span>${error}</span></div>`
    }
  }
AboutSection()
