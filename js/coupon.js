import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBC___4Nquk71vUAnTvoXj6_D3xuH136Qg",
  authDomain: "silverowl-coupons.firebaseapp.com",
  projectId: "silverowl-coupons",
  storageBucket: "silverowl-coupons.firebasestorage.app",
  messagingSenderId: "91873360509",
  appId: "1:91873360509:web:1658a10c9c2a371dd90f14"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Keep everything inside DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {

  const offerBubble = document.getElementById('offerBubble');
  const offerPopup = document.getElementById('offerPopup');
  const closePopup = document.getElementById('closePopup');
  const couponForm = document.getElementById('couponForm');
  const couponContainer = document.getElementById('couponContainer');
  const closeCoupon = document.getElementById('closeCoupon');
  const couponName = document.getElementById('couponName');
  const couponEmail = document.getElementById('couponEmail');
  const couponOffer = document.getElementById('couponOffer');
  const couponCode = document.getElementById('couponCode');
  const downloadCoupon = document.getElementById('downloadCoupon');

  console.log("✅ coupon.js loaded and running");

  // --- Popup controls ---
  offerBubble.addEventListener('click', () => offerPopup.style.display = 'flex');
  closePopup.addEventListener('click', () => offerPopup.style.display = 'none');
  offerPopup.addEventListener('click', e => {
    if (e.target === offerPopup) offerPopup.style.display = 'none';
  });
  closeCoupon.addEventListener('click', () => couponContainer.style.display = 'none');

  // --- Helper functions ---
  function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  function displayCoupon(entry) {
    couponContainer.style.display = 'block';
    couponName.textContent = `Name: ${entry.name}`;
    couponEmail.textContent = `Email: ${entry.email}`;
    document.getElementById('couponAgeGender').textContent = `Age: ${entry.age}, Gender: ${entry.gender}`;
    couponOffer.textContent = entry.offer;
    couponCode.textContent = `Coupon Code: ${entry.couponCode}`;
// 🔹 Add validity info
const createdDate = new Date(entry.createdAt || Date.now());

// Format created date
const formattedDate = createdDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// Calculate validity start date (next day)
const startDate = new Date(createdDate);
startDate.setDate(createdDate.getDate() + 1);
const formattedStart = startDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// Calculate validity end date (14 days from start date)
const endDate = new Date(startDate);
endDate.setDate(startDate.getDate() + 13);  // 14 days total including start day
const formattedEnd = endDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// Construct validity message
const validityMsg = `🕒 Coupon generated on: ${formattedDate} — Valid from ${formattedStart} to ${formattedEnd}`;

// Display it on the coupon
document.getElementById('couponValidity').textContent = validityMsg;
  }

  // --- Form submission logic ---
  couponForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!validateEmail(email)) {
      alert('Please enter a valid email.');
      return;
    }

    try {
      const couponsRef = collection(db, 'coupons');
      const q = query(couponsRef, where('email', '==', email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert('A coupon has already been generated for this email.');
        return;
      }

      const counterRef = doc(db, 'metadata', 'counter');
      const counterSnap = await getDoc(counterRef);
      let lastNumber = counterSnap.exists() ? counterSnap.data().lastCouponNumber : 0;

      const couponNumber = lastNumber + 1;
      const formattedCode = "SLVOWL" + String(couponNumber).padStart(5, '0');
      const offerText = age < 18 ? "🎉 Free Consultation" : "🦷 20% Reduction in Consultation Fee";

      await addDoc(couponsRef, {
        name, gender, age, email, phone, address,
        couponCode: formattedCode,
        offer: offerText,
        createdAt: serverTimestamp()
      });

      await setDoc(counterRef, { lastCouponNumber: couponNumber }, { merge: true });

      offerPopup.style.display = 'none';
      displayCoupon({ name, email, age, gender, offer: offerText, couponCode: formattedCode, createdAt: Date.now() });

    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  });

  // --- Coupon download logic ---
  if (downloadCoupon) {
    downloadCoupon.addEventListener('click', () => {
      const couponCard = document.getElementById('couponCard');
      const codeText = couponCode.textContent.replace('Coupon Code: ', '').trim();

      html2canvas(couponCard, { useCORS: true, backgroundColor: "#ffffff", scale: 2 })
        .then(canvas => {
          const link = document.createElement('a');
          link.download = `${codeText || 'coupon'}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        });
    });
  }

});