document.addEventListener("DOMContentLoaded", function () {
  // DARK MODE
  const body = document.body;
  const themeToggle = document.getElementById("nav-5");
  const themeIcon = themeToggle?.querySelector("i");

  function setTheme(isDark) {
    body.classList.toggle("dark", isDark);
    if (themeIcon) {
      themeIcon.classList.toggle("fa-moon", !isDark);
      themeIcon.classList.toggle("fa-sun", isDark);
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  function loadTheme() {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme === "dark");
    } else {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }
  loadTheme();
  themeToggle?.addEventListener("click", () => {
    setTheme(!body.classList.contains("dark"));
  });

  // ACTIVE MENU
  const currentPath = window.location.pathname;
  document.querySelectorAll(".nav-3 li a").forEach((link) => {
    const linkPath = new URL(link.href).pathname;

    if (
      linkPath === currentPath ||
      (currentPath === "/" && linkPath.includes("index.html"))
    ) {
      link.classList.add("active");
    }
  });

  // HAMBURGER
  const toggle = document.querySelector(".nav-7");
  const menu = document.querySelector(".nav-3");
  toggle?.addEventListener("click", () => {
    menu?.classList.toggle("show");
    toggle.querySelector("i")?.classList.toggle("fa-bars");
    toggle.querySelector("i")?.classList.toggle("fa-xmark");
  });

  // IMG CAROUSEL
  const slides = document.querySelectorAll(".slide");
  let slideIndex = 0;

  function changeSlide() {
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
  }

  if (slides.length > 1) {
    setInterval(changeSlide, 8000);
  }

  // SLIDER
  const sliders = document.querySelectorAll(".cp-1");
  sliders.forEach((slider) => {
    const sliderWrapper = slider.querySelector(".cp-3");
    const sliderContainer = slider.querySelector(".cp-2");
    const btnPrev = slider.querySelector(".cp-9");
    const btnNext = slider.querySelector(".cp-10");
    const productCards = slider.querySelectorAll(".cp-4");

    if (!sliderWrapper || !sliderContainer || productCards.length === 0) return;

    let isDragging = false;
    let startX;
    let startScrollLeft;
    let scrollLeft = 0;

    const gap = 20;

    const getCardWidth = () => productCards[0].offsetWidth + gap;

    const getMaxScroll = () =>
      sliderWrapper.scrollWidth - sliderContainer.offsetWidth;

    const updateSlider = () => {
      sliderWrapper.style.transform = `translateX(-${scrollLeft}px)`;
    };

    btnNext?.addEventListener("click", () => {
      sliderWrapper.style.transition =
        "transform 1s cubic-bezier(0.22,0.61,0.36,1)";

      scrollLeft = Math.min(scrollLeft + getCardWidth(), getMaxScroll());

      updateSlider();
    });

    btnPrev?.addEventListener("click", () => {
      sliderWrapper.style.transition =
        "transform 1s cubic-bezier(0.22,0.61,0.36,1)";

      scrollLeft = Math.max(scrollLeft - getCardWidth(), 0);

      updateSlider();
    });

    const dragStart = (e) => {
      isDragging = true;
      sliderWrapper.style.transition = "none";

      startX = e.pageX || e.touches[0].pageX;
      startScrollLeft = scrollLeft;
    };

    const dragging = (e) => {
      if (!isDragging) return;

      const x = e.pageX || e.touches[0].pageX;
      const walk = x - startX;

      let move = startScrollLeft - walk;

      if (move < 0) move = 0;
      if (move > getMaxScroll()) move = getMaxScroll();

      scrollLeft = move;
      updateSlider();
    };

    const dragStop = () => {
      if (!isDragging) return;

      isDragging = false;

      const cardWidth = getCardWidth();

      scrollLeft = Math.round(scrollLeft / cardWidth) * cardWidth;

      if (scrollLeft > getMaxScroll()) scrollLeft = getMaxScroll();

      sliderWrapper.style.transition =
        "transform 1s cubic-bezier(0.22,0.61,0.36,1)";
      updateSlider();
    };

    sliderContainer.addEventListener("mousedown", dragStart);
    window.addEventListener("mousemove", dragging);
    window.addEventListener("mouseup", dragStop);

    sliderContainer.addEventListener("touchstart", dragStart, {
      passive: true,
    });
    window.addEventListener("touchmove", dragging, { passive: false });
    window.addEventListener("touchend", dragStop);
  });

  // CARD FLIP
  const cards = document.querySelectorAll(".cd-2");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });

  const observerOptions = {
    root: null,
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("flipped");
        }, index * 500);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  cards.forEach((card) => {
    observer.observe(card);
  });
});
