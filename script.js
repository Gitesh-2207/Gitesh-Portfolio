
  document.addEventListener("DOMContentLoaded", () => {
    // ========================
    // NAVBAR ACTIVE ON SCROLL
    // ========================
    const sections = document.querySelectorAll(".section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
      let currentSection = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120; 
        if (scrollY >= sectionTop) {
          currentSection = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSection}`) {
          link.classList.add("active");
        }
      });
    });

    // ========================
    // CONTACT FORM SUBMIT
    // ========================
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          message: document.getElementById("message").value,
        };

        try {
          const res = await fetch("https://gitesh-portfolio-r51u.vercel.app/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          const msg = await res.text();
          alert(msg);
          form.reset();
        } catch (err) {
          alert("❌ Error sending message. Please try again.");
          console.error(err);
        }
      });
    }
  });

