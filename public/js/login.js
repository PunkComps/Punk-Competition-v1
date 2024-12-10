import { auth, signInWithEmailAndPassword , sendPasswordResetEmail} from "../firebase.js"


let password = document.getElementById('password')
let email = document.getElementById('email')
let forgetPassword = document.getElementById('forgetPassword')
let SignupRedirect = document.getElementById('SignupRedirect')
const RedirectionSignup = ()=>{
    window.location.href = '/public/signup.html'
}
SignupRedirect.addEventListener('click' , RedirectionSignup)



const signInFuntion = ()=>{
  try {
    if (email.value === "" || password.value === "") {
      Toastify({
        text:'Input is empty' ,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
      
     }
     else{
      signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        const user = userCredential.user;
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Signup Succesfully",
          showConfirmButton: false,
          timer: 1500
        });
        console.log("login succesfully" , user);
        window.location.href = "/public/index.html"
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Toastify({
          text:errorMessage ,
          duration: 3000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "left", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          onClick: function(){} // Callback after click
        }).showToast();
      });
     }
  } catch (error) {
    console.log(error);
    
  }
}

loginBtn.addEventListener('click' , signInFuntion)



const forgettonPassword =(user)=>{
  try {
   
  } catch (error) {
    console.log(error);
  }
}


// onclick="openModal()"

// Modal functionality
const modal = document.getElementById("forgotPasswordModal");
const closeButton = document.querySelector("#close-button");
const sendEmailButton = document.getElementById("sendEmailButton");

// Show the modal (you can trigger this with a button or link)
function openModal() {
  modal.style.display = "flex";
}
forgetPassword.addEventListener("click" , openModal)

// Hide the modal
function closeModal() {
  modal.style.display = "none";
}

closeButton.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Button action (for email submission)
sendEmailButton.addEventListener("click", () => {
  const email = document.getElementById("emailInput").value;
  if (email) {
    sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log(`Email sent to: ${email}`);
      Toastify({
        text:"Reset link sent to your email!" ,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
      closeModal();
      document.getElementById("emailInput").value = "";
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
      Toastify({
        text:"Please enter a valid email!" ,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
      document.getElementById("emailInput").value = "";
    });
  }else{
    Toastify({
      text:"Please enter email!" ,
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      onClick: function(){} // Callback after click
    }).showToast();
    document.getElementById("emailInput").value = "";
  }
  document.getElementById("emailInput").value = "";
});
