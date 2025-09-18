// ====== Mobile Navbar Toggle ======
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector(".nav-links");
  const toggleBtn = document.createElement("button");
  toggleBtn.innerText = "☰";
  toggleBtn.classList.add("nav-toggle");

  document.querySelector(".navbar").insertBefore(toggleBtn, nav);

  toggleBtn.addEventListener("click", () => {
    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
  });

  // ====== Hero Banner Slideshow (CSS-based) ======
  const hero = document.querySelector('.hero');
  const dotsContainer = document.querySelector('.dots');

  if (hero && dotsContainer) {
    const classes = ["banner1", "banner2", "banner3", "banner4"];
    let currentIndex = 0;

    // Create dots dynamically
    classes.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => showSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function showSlide(index) {
      hero.classList.remove(...classes); // remove any old banner class
      hero.classList.add(classes[index]); // apply new banner class
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      currentIndex = index;
    }

    // Auto-slide every 5s
    setInterval(() => {
      let nextIndex = (currentIndex + 1) % classes.length;
      showSlide(nextIndex);
    }, 5000);

    // Init first slide
    showSlide(0);
  }
});

// ====== Contact Form Validation ======
const contactForm = document.querySelector(".contact-form form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      e.preventDefault();
      alert("Please fill in all required fields.");
    }
  });
}

// ====== Appointment Form Validation ======
const appointmentForm = document.querySelector(".appointment-form form");
if (appointmentForm) {
  appointmentForm.addEventListener("submit", function (e) {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!name || !phone || !date || !time) {
      e.preventDefault();
      alert("Please fill in all required fields.");
    }
  });
}


//  ====== Lightbox functionality ====== 
document.querySelectorAll(".gallery-item img").forEach(img => {
  img.addEventListener("click", () => {
    const lightbox = document.createElement("div");
    lightbox.classList.add("lightbox");
    lightbox.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
    document.body.appendChild(lightbox);

    // show lightbox
    setTimeout(() => lightbox.classList.add("active"), 10);

    // close on click
    lightbox.addEventListener("click", () => {
      lightbox.classList.remove("active");
      setTimeout(() => lightbox.remove(), 300);
    });
  });
});
