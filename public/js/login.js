import { auth, signInWithEmailAndPassword} from "../firebase.js"


let password = document.getElementById('password')
let email = document.getElementById('email')
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