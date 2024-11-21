import {db, collection, addDoc , serverTimestamp } from "../firebase.js"; 


let sendBtn = document.getElementById('sendBtn')
let name = document.getElementById('name')
let phone = document.getElementById('phone')
let mail = document.getElementById('mail')
let massage = document.getElementById('comment')

window.onload = function () {
  let MainLoader = document.getElementById("MainLoader");
  let mainContentWrapper = document.getElementById("mainContentWrapper");
  MainLoader.style.display = "none"; // Hide loader
  mainContentWrapper.style.display = "block"; // Show content
};

const sendMassage = async()=>{
   
  if (name.value.trim() === '' || phone.value.trim() === '' || mail.value.trim() === '' || massage.value.trim() === '') {
    Toastify({
        text: 'Input is empty',
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #DB090A, #737174)", // primary-color and sec-color
          color: "#fff", // white-color
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // shadow-color
        },
        onClick: function(){} // Callback after click
      }).showToast();
    name.value = ''
    phone.value = ''
    mail.value = ''
    massage.value = ''
  } else {
    try {
      const docRef = await addDoc(collection(db, "contact"), {
        Name: name.value,
        Phone: phone.value,
        Email: mail.value,
        Massege: massage.value,
        Timestamp: serverTimestamp() // This will save Firestore's server timestamp
      });
      console.log("Document written with ID: ", docRef);
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Your request has been submitted",
        showConfirmButton: false,
        timer: 1500
      });
    
    } catch (e) {
      console.log("Error adding document: ", e);
      Toastify({
        text: "Error adding document: ", e,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #DB090A, #737174)", // primary-color and sec-color
          color: "#fff", // white-color
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // shadow-color
        },
        onClick: function(){} // Callback after click
      }).showToast();
      name.value = ''
      phone.value = ''
      mail.value = ''
      massage.value = ''
    }
    finally{
        name.value = ''
        phone.value = ''
        mail.value = ''
        massage.value = ''
    }
  }
   
}
sendBtn.addEventListener('click' , sendMassage)
