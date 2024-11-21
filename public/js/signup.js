import { auth, createUserWithEmailAndPassword ,db, collection, addDoc ,doc , setDoc , onAuthStateChanged} from "../firebase.js";

let Fname = document.getElementById("Fname")
let Uname = document.getElementById("Uname")
let email = document.getElementById("email")
let phone = document.getElementById("phone")
let password = document.getElementById("password")
let Cpassword = document.getElementById("Cpassword")
let submitBtn = document.getElementById("submitBtn")
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


const signupFuntion = async()=>{
  event.preventDefault();
    if (Fname.value.trim() === '' || Uname.value.trim() === '' || email.value.trim() === '' || phone.value.trim() === '' || password.value.trim() === '' || Cpassword.value.trim() === '') {
        console.log('input is empty');
        Toastify({
          text: "Please fill out all the fields before submitting!",
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
    } else {
      if (password.value === Cpassword.value) {
        if (passwordRegex.test(password.value)) {
          createUserWithEmailAndPassword(auth, email.value, password.value)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            Swal.fire({
              position: "top-center",
              icon: "success",
              title: "Signup Succesfully",
              showConfirmButton: false,
              timer: 1500
            });
            userData()
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            
            Toastify({
              text: errorMessage,
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
            // ..
          });
            
        } else {
          Toastify({
            text: 'Password must be 8+ characters with an uppercase, a lowercase, a number, and a special character.',
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
          // ..
          console.log("Password must be 8+ characters with an uppercase, a lowercase, a number, and a special character.");
        }
      } else {
        Toastify({
          text: "Passwords do not match! Please enter the same password.",
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
    }
}
submitBtn.addEventListener('click' , signupFuntion)




async function userData() {
  try {
    const docRef = await addDoc(collection(db, "userData"), {
      Fname : Fname.value , 
      Uname : Uname.value , 
      email : email.value , 
      phone : phone.value , 
      password : password.value , 
    });
    console.log("Document written with ID: ", docRef);
    window.location.href = "/public/login.html"
  
  } catch (e) {
    console.log("Error adding document: ", e);
  }
}


onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
   window.location.href = "/public/index.html"
  }
});