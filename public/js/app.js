import {
  db,
  collection,
  getDocs,
  doc,
  getDoc,
  auth,
  onAuthStateChanged,
  signOut,
} from "../firebase.js";

let AllPost = document.getElementById("allCompetition");
let carouselInner = document.getElementById("carousel-inner");

let AboutDiv = document.getElementById("About-section");
let login = document.getElementById("login");
let logout = document.getElementById("logout");
let loginLap = document.getElementById("loginLap");
let logoutLap = document.getElementById("logoutLap");

window.onload = function () {
  let MainLoader = document.getElementById("MainLoader");
  let mainContentWrapper = document.getElementById("mainContentWrapper");
  MainLoader.style.display = "none"; // Hide loader
  mainContentWrapper.style.display = "block"; // Show content
};
logout.style.display = "none";
logoutLap.style.display = "none";

const allCompetitionPost = async () => {
  AllPost.innerHTML = `<div class="loader-div"><span class="loader"></span></div>`;
  try {
    const querySnapshot = await getDocs(collection(db, "post"));
    AllPost.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const { Title, Description, Question, Amount, Ticket, Image } =
        doc.data();

      // Adding card with onclick to call detailView function
      AllPost.innerHTML += `
      <div class="custom-card" onclick="detailView('${doc.id}')">
        <img src="${Image}" class="card-img-top" alt="...">
        <div class="custom-card-body">
          <h5 class="card-title">${Title}</h5>
          <p class="card-text">${
            Description.length > 100
              ? Description.slice(0, 100) + "..."
              : Description
          }</p>
          <button class="card-title">$${Amount}</button>
        </div>
      </div>`;
      console.log(doc.id, " ===> ", doc.data());
    });
  } catch (error) {
    console.log(error);
    AllPost.innerHTML = `Please check your internet connection`;
  }
};

allCompetitionPost();

// Function to store the card ID and navigate to the detail page
window.detailView = (id) => {
  localStorage.setItem("cardId", id);
  window.location.href = "/public/postDetail.html";
  console.log(id);
};

const AboutSection = async () => {
  AboutDiv.innerHTML = `<div class="loader-div"><span class="loader"></span></div>`;
  try {
    const docRef = doc(db, "about", "aboutSection");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { Heading, About, AboutImage } = docSnap.data();
      AboutDiv.innerHTML = `<div class="col-md-6">
                  <div class="about_taital_main">
                     <h1 class="about_taital">${Heading}</h1>
                     <p class="about_text">${About}</p>
                     <div class="readmore_bt"><a href="../about.html">Read More</a></div>
                  </div>
               </div>
               <div class="col-md-6 padding_right_0">
                  <div><img src="${AboutImage}" alt=""></div>
               </div>`;

      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
      AboutDiv.innerHTML = `<div class="loader-div"><span class="loader"></span></div>`;
    }
  } catch (error) {
    console.log("Error retrieving document: ", error);
    AboutDiv.innerHTML = `<h3 style="text-align:center;">No Network</h3>`;
  }
};
AboutSection();

const ReviewSection = async () => {
  carouselInner.innerHTML = `<div class="loader-div"><span class="loader"></span></div>`;
  try {
    const docRef = doc(db, "Review", "ReviewData");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {
        Title1,
        Title2,
        Title3,
        Description1,
        Description2,
        Description3,
        Image1,
        Image2,
        Image3,
      } = docSnap.data();
      carouselInner.innerHTML = ` <div class="carousel-item active">
                        <div class="client_main">
                           <div class="box_left">
                              <p class="lorem_text">${Description1}</p>
                           </div>
                           <div class="box_right">
                              <div class="client_taital_left">
                                 <div class="client_img"><img src="${Image1}" alt="" id="Review-Img"></div>
                                 <div class="quick_icon"><img src="images/quick-icon.png"></div>
                              </div>
                              <div class="client_taital_right">
                                 <h4 class="client_name">${Title1}</h4>
                                 <p class="customer_text">Lucky Winner</p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="carousel-item">
                        <div class="client_main">
                           <div class="box_left">
                              <p class="lorem_text">${Description2}</p>
                           </div>
                           <div class="box_right">
                              <div class="client_taital_left">
                                 <div class="client_img"><img src="${Image2}" alt="" id="Review-Img"></div>
                                 <div class="quick_icon"><img src="images/quick-icon.png"></div>
                              </div>
                              <div class="client_taital_right">
                                 <h4 class="client_name">${Title2}</h4>
                                 <p class="customer_text">Prize Winner</p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="carousel-item">
                        <div class="client_main">
                           <div class="box_left">
                              <p class="lorem_text">${Description3}</p>
                           </div>
                           <div class="box_right">
                              <div class="client_taital_left">
                                 <div class="client_img"><img src="${Image3}" alt="" id="Review-Img"></div>
                                 <div class="quick_icon"><img src="images/quick-icon.png"></div>
                              </div>
                              <div class="client_taital_right">
                                 <h4 class="client_name">${Title3}</h4>
                                 <p class="customer_text">Grand Prize Winner</p>
                              </div>
                           </div>
                        </div>
                     </div>`;

      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
      carouselInner.innerHTML = `<div class="loader-div"><span class="loader"></span></div>`;
    }
  } catch (error) {
    console.log("Error retrieving document: ", error);
    carouselInner.innerHTML = `<h3 style="text-align:center;">${error}</h3>`;
  }
};
ReviewSection();

const CurrerntUser = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(`onAuthStateChange=====> ${user} =======> ${uid}`);
      logout.style.display = "block";
      logoutLap.style.display = "block";
      login.style.display = "none";
      loginLap.style.display = "none";
    }
  });
};
CurrerntUser();

const LogoutUser = () => {
  console.log("hello world");
  signOut(auth)
    .then(() => {
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Your Competition is Added",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(auth);
      window.location.href = "/public/index.html";
    })
    .catch((error) => {
      console.log(error);
    });
};
logout.addEventListener("click", LogoutUser);

const LogoutUserLap = () => {
  console.log("hello world");

  signOut(auth)
    .then(() => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your Competition is Added",
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.href = "/public/index.html";
      console.log(auth);
    })
    .catch((error) => {
      console.log(error);
    });
};
logoutLap.addEventListener("click", LogoutUserLap);

const LoginRedirect = () => {
  window.location.href = "/public/login.html";
};
login.addEventListener("click", LoginRedirect);

const LoginRedirectLap = () => {
  window.location.href = "/public/login.html";
};
loginLap.addEventListener("click", LoginRedirectLap);
