import { db, collection, addDoc, serverTimestamp, doc, updateDoc, onAuthStateChanged, getDocs, auth, getDoc } from "../firebase.js";

// Retrieve stored data from localStorage
const storedData = JSON.parse(localStorage.getItem('payId'));
let detailId = localStorage.getItem('cardId')
const { Title, Description, Amount, Image, Ticket, Question } = storedData;
let paymentModal = document.getElementById('paymentModal');
let emptyError = document.getElementById('error-empty')
let ticketDiv = document.getElementById('ticketDiv');
let checkOutContainer = document.getElementById('main-checkout-container');
let payButton = document.getElementById('submit-button');
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

let ticketArray = Ticket.split(',').map(item => item.trim());
    ticketArray.map((item) => {
      console.log(`============> get ticket ${item}`);
      ticketDiv.innerHTML += `<div class="ticket-box">${item}</div>`
});

// Populate checkout page with product info
document.getElementById('product-title').textContent = Title;
document.getElementById('product-description').textContent = Description;
document.getElementById('product-amount').textContent = Amount;
document.getElementById('product-image').src = Image;

// Initialize Stripe
const stripe = Stripe('pk_live_51PuvL8HG1xPdW1CjfvWpL8lcdbBI6XCkTz2BTt2XGtHNRYHA5KwePTzbP8Y7Sfn3ZXMq5tiiPrwNNMOZdajkFmT500lMnHOoJ9');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Handle form submission
const form = document.getElementById('payment-form');

const StripeFunction = async (event) => {
    event.preventDefault(); // Form reload hone se rokain
    payButton.disabled = true;
    payButton.textContent = "Processing...";
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
            payButton.disabled = false;
            payButton.textContent = "Pay";
        }
    } catch (err) {
        document.getElementById('payment-result').textContent = `Error: ${err.message}`;
        payButton.disabled = false;
        payButton.textContent = "Pay";
    } finally {
        payButton.disabled = false;
        payButton.textContent = "Pay";
    }
};

form.addEventListener('submit', StripeFunction);
// Ticket number and answer validation in modal
let modalSubmit = document.getElementById('submit-details');
const modalSubmitFuntion = async (event) => {
    modalSubmit.disabled = true;
    modalSubmit.textContent = "Submitting...";
    event.preventDefault();
    const userTicket = document.getElementById('ticket-number').value;
    const userAnswer = document.getElementById('question-answer').value;
    if (userTicket.trim() === "" || userAnswer.trim() === "") {
        Toastify({
            text: 'Both input fields are required, and ticket must be written perfectly.',
            duration: 3000,
            gravity: 'top',
            position: 'left',
            style: { background: 'linear-gradient(to right, #ff5f6d, #ffc371)' }
        }).showToast();
        modalSubmit.disabled = false;
        modalSubmit.textContent = "Submit";
        return;
    } else {
        try {
            const docRef = doc(db, "post", detailId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const { Title, Description, Question, Amount, Ticket, Image } = docSnap.data();
                console.log(Ticket);
                let filterNumber = Ticket.includes(userTicket);
                if (filterNumber && userAnswer) {
                    let ticketArray = Ticket.split(',').map(item => item.trim());
                    ticketArray = ticketArray.filter(item => item !== userTicket);
                    let updatedTicketString = ticketArray.join(', ');

                    const washingtonRef = doc(db, "post", detailId);
                    console.log(washingtonRef);
            
                    await updateDoc(washingtonRef, {
                        Ticket: updatedTicketString
                    });

                    onAuthStateChanged(auth, (user) => {
                        if (user) {
                            const loggedInEmail = user.email;
                            console.log("User is logged in with Email:", loggedInEmail);
                            Toastify({
                                text: 'Ticket verified! Withdrawal details will be live soon.',
                                duration: 3000,
                                gravity: 'top',
                                position: 'left',
                                style: { background: 'linear-gradient(to right, #00b09b, #96c93d)' }
                            }).showToast();
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
                            modalSubmit.disabled = false;
                            modalSubmit.textContent = "Submit";
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
                    modalSubmit.disabled = false;
                    modalSubmit.textContent = "Submit";
                }
            }
        } catch (error) {
            Toastify({
                text: `Opp's ${error}`,
                duration: 3000,
                gravity: 'top',
                position: 'left',
                style: { background: 'linear-gradient(to right, #ff5f6d, #ffc371)' }
            }).showToast();
            console.log(error);
            modalSubmit.disabled = false;
            modalSubmit.textContent = "Submit";
        }
    }
}

modalSubmit.addEventListener('click', modalSubmitFuntion);



const AllUserDataShow = async (loggedInEmail , userTicket, userAnswer) => {
    try {
        const querySnapshot = await getDocs(collection(db, "userData"));
        console.log("All Documents:", querySnapshot.docs.map(doc => doc.data()));
        const normalizedEmail = loggedInEmail.trim().toLowerCase();

        // Search for the matching user
        let matchedUser = null;
        querySnapshot.forEach((doc) => {
            const AllEmailData = doc.data();
            const firestoreEmail = AllEmailData.email.trim().toLowerCase();
            if (firestoreEmail === normalizedEmail) {
                matchedUser = AllEmailData;
            }
        });

        if (matchedUser) {
            console.log("Matched User Data:", matchedUser);

            // Pass matched user data to the function
            addPurchaseData(matchedUser, userTicket, userAnswer);
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
        modalSubmit.disabled = false;
        modalSubmit.textContent = "Submit";
        setTimeout(() => (window.location.href = "/public/index.html"), 3000)
    } catch (e) {
        console.error("Error adding document: ", e);
        modalSubmit.disabled = false;
        modalSubmit.textContent = "Submit";
    }
}