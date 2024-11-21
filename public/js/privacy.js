 // JavaScript to toggle tabs
 const privacyBtn = document.getElementById('privacy-btn');
 const termsBtn = document.getElementById('terms-btn');
 const privacyContent = document.getElementById('privacy-content');
 const termsContent = document.getElementById('terms-content');

 privacyBtn.addEventListener('click', () => {
     privacyBtn.classList.add('active');
     termsBtn.classList.remove('active');
     privacyContent.classList.add('active');
     termsContent.classList.remove('active');
 });

 termsBtn.addEventListener('click', () => {
     termsBtn.classList.add('active');
     privacyBtn.classList.remove('active');
     termsContent.classList.add('active');
     privacyContent.classList.remove('active');
 });

 window.onload = function () {
    let MainLoader = document.getElementById("MainLoader");
    let mainContentWrapper = document.getElementById("mainContentWrapper");
    MainLoader.style.display = "none"; // Hide loader
    mainContentWrapper.style.display = "block"; // Show content
  };