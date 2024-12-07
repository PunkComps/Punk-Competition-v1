
import { db, doc, getDoc, auth, onAuthStateChanged } from "../firebase.js";


let detailId = localStorage.getItem('cardId')
let DetailSection = document.getElementById("container")
let ticketDiv = document.getElementById("ticket-div")
let signupBtn = document.getElementById("signupBtn")
let loginBtn = document.getElementById("loginBtn")
let buttonDiv = document.getElementById("button-div")


window.onload = function () {
  let MainLoader = document.getElementById("MainLoader");
  let mainContentWrapper = document.getElementById("mainContentWrapper");
  MainLoader.style.display = "none"; // Hide loader
  mainContentWrapper.style.display = "block"; // Show content
};

const DetailPostView = async () => {
  DetailSection.innerHTML = `<div class="loader-div"><span class="loader"></span></div>`
  if (!detailId) {
    console.log("error");
    DetailSection.innerHTML = `<div class="loader-div"><span>Error</span></div>`
  }

  const docRef = doc(db, "post", detailId);
  const docSnap = await getDoc(docRef);
  DetailSection.innerHTML = ''
  if (docSnap.exists()) {
    const { Title, Description, Question, Amount, Ticket, Image , Answer , Options} = docSnap.data();
    console.log(Answer);
    
                
    DetailSection.innerHTML = `
    <div class="sec-div">
      <div class="image-div">
        <img src="${Image}" alt="no img found">
      </div>
      <div class="content-div">
        <h1 class="title">${Title}</h1>
        <p class="des-para">Description: <br>${Description}</p>
        <div id="optionMainDiv" > 
        <h2>Q: ${Question}?</h2>
        <select id="options">
        ${Options.map((option, index) => `<option value="${option}">${option}</option>`).join("")}
        </select>
        <button id="getValueButton">Submit Answer</button>
        <label>
            <input type="checkbox"/>
            I agree to the <a href="privacy.html" target="_blank">Privacy Policy and T&C's</a>
        </label>
        </div>
        <div class="note-div">
          <p class="note-para">Note: <br>To take part in the competition, you must first complete the payment. Once the payment is processed, you will be able to answer the question and officially enter the competition. Along with your answer, please select the ticket you prefer and provide your ticket number after the payment. Only those who answer the question correctly and provide their ticket number will be eligible to win the prize.</p>
        </div>
        <div class="price-container">
          <h1 class="price"><span id="price-amount">£</span>${Amount}</h1>
        </div>
      </div>
    </div>`;
   
  // Add event listener for the button
  document.querySelector('#getValueButton').addEventListener('click', () => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        const uid = user.uid;
        console.log(`onAuthStateChange=====> ${user} =======> ${uid}`);
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: "please first login and signup",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      
    });
    const selectedValue = document.querySelector('#options').value; // Get the selected value
    console.log(`Selected Value: ${selectedValue}`);
    if (selectedValue === Answer) {
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "congratulation!",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log("Correct Answer! Redirecting to the payment page...");
      const dataToStore = { Title, Description, Question, Amount, Ticket, Image };
      localStorage.setItem('payId', JSON.stringify(dataToStore));
      window.location.href = '/public/payment.html' 
    } else {
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Incorrect Answer. Please try again!",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log("Incorrect Answer. Please retry.");
    }
  });
  
    let ticketArray = Ticket.split(',').map(item => item.trim());
    ticketArray.map((item) => {
      console.log(`============> get ticket ${item}`);
      ticketDiv.innerHTML += `<div class="ticket-box"><p>${item}</p></div>`

    });

    console.log("Document data:", docSnap.data(), "========>", Title, Description, Question, Amount, Ticket, Image);
  } else {
    console.log("No such document!");
    DetailSection.innerHTML = `<div class="loader-div"><span>No such document!</span></div>`
  }
}

DetailPostView()






// login funtion started
const loginRedirect = () => {
  console.log('========> Login');
  window.location.href = '/public/login.html'

}
loginBtn.addEventListener('click', loginRedirect)
// login funtion ended


// Signup funtion started
const SignupRedirect = () => {
  console.log('========> Signup');
  window.location.href = '/public/signup.html'
}
signupBtn.addEventListener('click', SignupRedirect)
// Signup funtion ended




  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(`onAuthStateChange=====> ${user} =======> ${uid}`);
      buttonDiv.style.display = "none"
    }
  });




const PurchaseAmount = async () => {
  const docRef = doc(db, "post", detailId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());

    const { Title, Description, Question, Amount, Ticket, Image } = docSnap.data();

    // Store the destructured data in localStorage as a JSON string
    const dataToStore = { Title, Description, Question, Amount, Ticket, Image };
    localStorage.setItem('payId', JSON.stringify(dataToStore));
    window.location.href = '/public/payment.html'

  } else {
    console.log("No such document!");
  }
}

// Add event listener
// PayBtn.addEventListener('click', PurchaseAmount);


