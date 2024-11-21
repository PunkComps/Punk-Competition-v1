import {db, collection, getDocs } from "../firebase.js"; 
window.onload = function () {
  let MainLoader = document.getElementById("MainLoader");
  let mainContentWrapper = document.getElementById("mainContentWrapper");
  MainLoader.style.display = "none"; // Hide loader
  mainContentWrapper.style.display = "block"; // Show content
};

let ShowCard = document.getElementById("ShowCard")
const AllWinnerPost = async () => {
  ShowCard.innerHTML = `<div class="loader-div"><span class="loader"></span></div>`
    try {
      const querySnapshot = await getDocs(collection(db, "Winner-Data"));
      ShowCard.innerHTML = ""
      querySnapshot.forEach((doc) => {
        const { Title, Description, Image , Time} = doc.data();
        ShowCard.innerHTML += `
        <div class="card mb-4" style="border-radius: 20px; overflow: hidden; background-color: #1c1c1c; color: var(--white-color); position: relative;">
          <img src="${Image}" class="card-img-top" style="height: 350px; object-fit: cover;" alt="Winner Image">
          <div class="card-body" style="padding: 20px;">
            <h5 class="card-title text-uppercase" style="font-weight: bold; font-size: 1.8rem; letter-spacing: 1.5px; margin-bottom: 15px;">${Title}</h5>
            <p class="card-text" style="font-size: 1rem; line-height: 1.6; opacity: 0.85;">${Description}...</p>
            <p class="card-text" style="margin-top: 20px;">
              <small class="text-muted" style="font-size: 1rem; font-weight: 600;">Last Winner: <span style="color: var(--primary-color); font-weight: bold;">${Time}</span></small>
            </p>
          </div>
        </div>`;
        console.log(doc.id, " => ", doc.data(), Image);
      });
    } catch (error) {
      console.log(error);
      ShowCard.innerHTML = `<div class="loader-div"><span>${error}</span></div>`
    }
  }
  
  AllWinnerPost();
