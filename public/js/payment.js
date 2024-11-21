import { db, collection, addDoc, serverTimestamp, doc, updateDoc, onAuthStateChanged, getDocs, auth } from "../firebase.js";

// Retrieve stored data from localStorage
const storedData = JSON.parse(localStorage.getItem('payId'));
const { Title, Description, Amount, Image, Ticket , Question} = storedData;
console.log(Ticket);
let paymentModal = document.getElementById('paymentModal');
let emptyError = document.getElementById('error-empty')
let checkOutContainer = document.getElementById('main-checkout-container');
window.onload = function () {
    let MainLoader = document.getElementById("MainLoader");
    let mainContentWrapper = document.getElementById("mainContentWrapper");
    MainLoader.style.display = "none"; // Hide loader
    mainContentWrapper.style.display = "block"; // Show content
  };
if (storedData === '') {
    checkOutContainer.style.display = 'none';
    emptyError.style.display = 'flex';
}

// Populate checkout page with product info
document.getElementById('product-title').textContent = Title;
document.getElementById('product-description').textContent = Description;
document.getElementById('product-amount').textContent = Amount;
document.getElementById('product-image').src = Image;

// Initialize Stripe
const stripe = Stripe('pk_test_51PuvL8HG1xPdW1Cj3K1BBZhMzK7I11MAubppNwJ8GdFEmLYlrgoOEOuvPi1XApamKLopBsFMWInllCvxnRIqgtP100Lz9oj4N7');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Handle form submission
const form = document.getElementById('payment-form');

const StripeFunction = async (event) => {
    event.preventDefault(); // Form reload hone se rokain
    try {
        // Backend se client secret fetch karen
        const response = await fetch('/api/server', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Title, Description, Amount, Image }),  // Product data backend ko send karen
        });

        if (!response.ok) {
            throw new Error('Failed to fetch client secret');
        }

        const { clientSecret } = await response.json();

        // Stripe ke sath payment confirm karen
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement },
        });

        if (error) {
            throw new Error(`Payment failed: ${error.message}`);
        } else {
            document.getElementById('payment-result').textContent = 'Payment successful!';
            paymentModal.style.display = 'flex'; // Successful payment ke baad modal show karain
        }
    } catch (err) {
        document.getElementById('payment-result').textContent = `Error: ${err.message}`;
    }
};

form.addEventListener('submit', StripeFunction);

// Ticket number and answer validation in modal
let modalSubmit = document.getElementById('submit-details');
const modalSubmitFuntion = async (event) => {
    event.preventDefault();
    
    const userTicket = document.getElementById('ticket-number').value;
    const userAnswer = document.getElementById('question-answer').value;
    let UserId = localStorage.getItem('cardId');

    // Validation for empty input fields
    if (userTicket.trim() === "" || userAnswer.trim() === "") {
        Toastify({
            text: 'Both input fields are required, and ticket must be written perfectly.',
            duration: 3000,
            gravity: 'top',
            position: 'left',
            style: { background: 'linear-gradient(to right, #ff5f6d, #ffc371)' }
        }).showToast();
        return;  // Stop further execution if inputs are empty
    }

    // Validate ticket number and answer from localStorage
    let filterNumber = Ticket.includes(userTicket);
    if (filterNumber && userAnswer) {
        let ticketArray = Ticket.split(',').map(item => item.trim());
        ticketArray = ticketArray.filter(item => item !== userTicket);  // Remove specific ticket

        let updatedTicketString = ticketArray.join(', ');
        const washingtonRef = doc(db, "post", UserId);
        console.log(washingtonRef);

        await updateDoc(washingtonRef, {
            Ticket: updatedTicketString
        });
        Toastify({
            text: 'Ticket verified! Withdrawal details will be live soon.',
            duration: 3000,
            gravity: 'top',
            position: 'left',
            style: { background: 'linear-gradient(to right, #00b09b, #96c93d)' }
        }).showToast();
        // Close modal and redirect to withdrawal details page
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const loggedInEmail = user.email;
                console.log("User is logged in with Email:", loggedInEmail);
                AllUserDataShow(loggedInEmail, userTicket, userAnswer);
            } else {
                console.log("No user is currently logged in");
                // Error message
                Toastify({
                    text: 'No user is currently logged in, please get in touch.',
                    duration: 3000,
                    gravity: 'top',
                    position: 'left',
                    style: { background: 'linear-gradient(to right, #ff5f6d, #ffc371)' }
                }).showToast();
            }
        });
    } else {
        // Error message if ticket is invalid or answer is wrong
        Toastify({
            text: 'Invalid ticket number or wrong answer.',
            duration: 3000,
            gravity: 'top',
            position: 'left',
            style: { background: 'linear-gradient(to right, #ff5f6d, #ffc371)' }
        }).showToast();
    }
}

modalSubmit.addEventListener('click', modalSubmitFuntion);



const AllUserDataShow = async (loggedInEmail, userTicket, userAnswer) => {
    try {
        const querySnapshot = await getDocs(collection(db, "userData"));

        const matchedUser = querySnapshot.docs.find((doc) => {
            const { email } = doc.data();
            return email === loggedInEmail;
        });

        if (matchedUser) {
            const userData = matchedUser.data();
            addPurchaseData(userData, userTicket, userAnswer)

        } else {
            console.log("No matching user found with this email.");
        }

    } catch (error) {
        console.log("Error fetching data:", error);
    }
};


const addPurchaseData = async (userData, userTicket, userAnswer) => {
    console.log("User Data:", userData);
    const { Fname, Uname, email, password, phone } = userData;
    try {
        const docRef = await addDoc(collection(db, "Purchased"), {
            Fname: Fname,
            Uname: Uname,
            email: email,
            password: password,
            phone: phone,
            Title: Title,
            Description: Description,
            Question: Question,
            Amount: Amount,
            Ticket: userTicket,
            Image: Image,
            Answer: userAnswer,
            purchaseTime: serverTimestamp(),
        });
        console.log("Document written with ID: ", docRef.id);
        localStorage.setItem('payId', JSON.stringify(""));
        paymentModal.style.display = 'none';
        checkOutContainer.style.display = 'none';
        setTimeout(()=>(window.location.href = "/public/index.html"), 3000)
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}