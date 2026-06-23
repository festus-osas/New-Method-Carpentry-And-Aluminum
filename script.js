const galleries = {
  roofing: {
    title: "Roofing Projects",
    copy: "Durable roofing solutions built with careful finishing and weather-ready strength.",
    images: [
      "assets/projects/roofing/roofing-01.jpg",
      "assets/projects/roofing/roofing-02.jpeg",
      "assets/projects/roofing/roofing-03.jpg",
      "assets/projects/roofing/roofing-04.jpg",
      "assets/projects/roofing/roofing-05.jpg",
      "assets/projects/roofing/roofing-06.jpg",
    ],
  },
  doors: {
    title: "Door Projects",
    copy: "Strong, secure, and elegant door works selected for clean entrances and lasting presence.",
    images: [
      "assets/projects/doors/door-01.jpg",
      "assets/projects/doors/door-02.jpg",
      "assets/projects/doors/door-03.jpg",
      "assets/projects/doors/door-04.jpg",
      "assets/projects/doors/door-05.jpg",
      "assets/projects/doors/door-06.jpg",
    ],
  },
  skeletons: {
    title: "Roof Skeleton Projects",
    copy: "Precisely framed roof structures built for alignment, strength, and dependable installation.",
    images: [
      "assets/projects/roof-skeletons/roof-skeleton-01.jpg",
      "assets/projects/roof-skeletons/roof-skeleton-02.jpg",
      "assets/projects/roof-skeletons/roof-skeleton-03.jpg",
      "assets/projects/roof-skeletons/roof-skeleton-04.jpg",
    ],
  },
};

const modal = document.querySelector("[data-gallery-modal]");
const modalImage = document.querySelector("[data-gallery-image]");
const modalTitle = document.querySelector("[data-gallery-title]");
const modalCopy = document.querySelector("[data-gallery-copy]");
const modalCount = document.querySelector("[data-gallery-count]");
const modalThumbs = document.querySelector("[data-gallery-thumbs]");
const closeButtons = document.querySelectorAll("[data-close-gallery]");
const prevButton = document.querySelector("[data-gallery-prev]");
const nextButton = document.querySelector("[data-gallery-next]");
const siteHeader = document.querySelector(".top-component-bar");
const menuToggle = document.querySelector(".mobile-menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
const desktopMenuQuery = window.matchMedia ? window.matchMedia("(min-width: 981px)") : null;

let activeGallery = galleries.roofing;
let activeIndex = 0;

if (siteHeader && menuToggle && primaryNavigation) {
  const setMobileMenuState = (isOpen) => {
    siteHeader.classList.toggle("is-menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", `${isOpen}`);
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  };

  const closeMobileMenu = () => setMobileMenuState(false);

  menuToggle.addEventListener("click", () => {
    setMobileMenuState(!siteHeader.classList.contains("is-menu-open"));
  });

  primaryNavigation.addEventListener("click", (event) => {
    const link = event.target.closest ? event.target.closest("a") : null;
    if (link) closeMobileMenu();
  });

  document.addEventListener("click", (event) => {
    if (!siteHeader.classList.contains("is-menu-open")) return;
    if (siteHeader.contains(event.target)) return;
    closeMobileMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !siteHeader.classList.contains("is-menu-open")) return;
    closeMobileMenu();
    menuToggle.focus({ preventScroll: true });
  });

  const handleDesktopMenuChange = (event) => {
    if (event.matches) closeMobileMenu();
  };

  if (desktopMenuQuery && typeof desktopMenuQuery.addEventListener === "function") {
    desktopMenuQuery.addEventListener("change", handleDesktopMenuChange);
  } else if (desktopMenuQuery && typeof desktopMenuQuery.addListener === "function") {
    desktopMenuQuery.addListener(handleDesktopMenuChange);
  }
}

const setModalState = () => {
  const image = activeGallery.images[activeIndex];
  modalImage.src = image;
  modalImage.alt = `${activeGallery.title} image ${activeIndex + 1}`;
  modalTitle.textContent = activeGallery.title;
  modalCopy.textContent = activeGallery.copy;
  modalCount.textContent = `${activeIndex + 1} / ${activeGallery.images.length}`;

  [...modalThumbs.children].forEach((thumb, index) => {
    thumb.classList.toggle("is-active", index === activeIndex);
  });
};

const buildThumbs = () => {
  modalThumbs.replaceChildren();
  activeGallery.images.forEach((image, index) => {
    const button = document.createElement("button");
    button.className = "gallery-thumb";
    button.type = "button";
    button.setAttribute("aria-label", `Open image ${index + 1}`);

    const thumbnail = document.createElement("img");
    thumbnail.src = image;
    thumbnail.alt = "";

    button.append(thumbnail);
    button.addEventListener("click", () => {
      activeIndex = index;
      setModalState();
    });
    modalThumbs.append(button);
  });
};

const openGallery = (key) => {
  activeGallery = galleries[key];
  activeIndex = 0;
  buildThumbs();
  setModalState();
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  nextButton.focus();
};

const closeGallery = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

const stepGallery = (direction) => {
  activeIndex = (activeIndex + direction + activeGallery.images.length) % activeGallery.images.length;
  setModalState();
};

document.querySelectorAll("[data-gallery]").forEach((card) => {
  card.addEventListener("click", () => openGallery(card.dataset.gallery));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGallery(card.dataset.gallery);
    }
  });
});

closeButtons.forEach((button) => button.addEventListener("click", closeGallery));
prevButton.addEventListener("click", () => stepGallery(-1));
nextButton.addEventListener("click", () => stepGallery(1));

document.addEventListener("keydown", (event) => {
  if (!modal.classList.contains("is-open")) return;
  if (event.key === "Escape") closeGallery();
  if (event.key === "ArrowLeft") stepGallery(-1);
  if (event.key === "ArrowRight") stepGallery(1);
});

const motionShowcase = document.querySelector("[data-motion-showcase]");
const motionVideos = document.querySelectorAll("[data-motion-video]");
const reducedMotionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

if (motionShowcase) {
  let motionFrameQueued = false;
  const prefersReducedMotion = () => reducedMotionQuery && reducedMotionQuery.matches;

  const setMotionPlayback = (shouldPlay) => {
    motionVideos.forEach((video) => {
      if (shouldPlay && !prefersReducedMotion()) {
        video.muted = true;
        const playAttempt = video.play();
        if (playAttempt && typeof playAttempt.catch === "function") playAttempt.catch(() => {});
        return;
      }

      video.pause();
    });
  };

  const updateMotionProgress = () => {
    const rect = motionShowcase.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const rawProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
    const progress = Math.min(1, Math.max(0, rawProgress));
    const shift = `${(0.5 - progress) * 30}px`;
    const lift = `${(0.5 - progress) * 12}px`;
    const scale = (1.06 - progress * 0.025).toFixed(3);

    motionShowcase.style.setProperty("--motion-shift", shift);
    motionShowcase.style.setProperty("--motion-lift", lift);
    motionShowcase.style.setProperty("--motion-scale", scale);
  };

  const requestMotionUpdate = () => {
    if (motionFrameQueued) return;
    motionFrameQueued = true;
    requestAnimationFrame(() => {
      updateMotionProgress();
      motionFrameQueued = false;
    });
  };

  if ("IntersectionObserver" in window) {
    const motionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          motionShowcase.classList.toggle("is-visible", entry.isIntersecting);
          setMotionPlayback(entry.isIntersecting);
        });
      },
      { threshold: 0.18 }
    );

    motionObserver.observe(motionShowcase);
  } else {
    motionShowcase.classList.add("is-visible");
    setMotionPlayback(true);
  }

  updateMotionProgress();
  window.addEventListener("scroll", requestMotionUpdate, { passive: true });
  window.addEventListener("resize", requestMotionUpdate);

  const handleReducedMotionChange = () => {
    setMotionPlayback(motionShowcase.classList.contains("is-visible"));
  };

  if (reducedMotionQuery && typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
  } else if (reducedMotionQuery && typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(handleReducedMotionChange);
  }
}
