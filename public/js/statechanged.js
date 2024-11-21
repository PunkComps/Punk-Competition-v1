
import {auth ,  onAuthStateChanged ,signOut} from "../firebase.js"; 
let logout = document.querySelector('.logout')
const CurrerntUser = ()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid);
      }else{
        window.location.href = "/index.html"
      }
    });
  }
  CurrerntUser()
  
  const LogoutUser = ()=>{
    console.log('hello world');
    signOut(auth).then(() => {
       Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Your Competition is Added",
          showConfirmButton: false,
          timer: 1500
        });
        console.log(auth);
        window.location.href = '/index.html'
     }).catch((error) => {
       console.log(error);
     });
 }
 logout.addEventListener('click' , LogoutUser)