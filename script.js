/* Query Selectors */
const headerContainer = document.querySelector(".navigation-header-container");
const heroSection = document.querySelector(".hero__section");

const logoImgElement = document.querySelector(
  ".navigation-header-logo-container img"
);
const menuImgElement = document.querySelector(
  ".navigation-header-menu-icon img"
);
const navMenuContainerElement = document.querySelector(
  ".navigation-header-nav-container"
);

const menuIconContainer = document.querySelector(
  ".navigation-header-menu-icon"
);

const navItemLinks = document.querySelectorAll(".nav-items-links");

/* Global Constants */
const logoColors = {
  colorSrc: "assets/logo/J&L Logo-Color.svg",
  whiteSrc: "assets/logo/J&L Logo-White.svg",
};

const closeIconColors = {
  colorSrc: "assets/icons/close_Icon-color.svg",
  whiteSrc: "assets/icons/close_Icon-white.svg",
};

const hamburgerIconColors = {
  colorSrc: "assets/icons/menu_Icon-color.svg",
  whiteSrc: "assets/icons/menu_Icon-white.svg",
};

const desktopDimensions = 768;

/* Utils */
const isWindowGreaterThan = (size) => {
  const windowSize = window.innerWidth;
  return windowSize > size;
};

/*=============================== HEADER ===============================*/

// change header and Icon colors onScroll
const observerOptions = {
  rootMargin: `-500px 0px 0px 0px`,
};

const headerObserver = new IntersectionObserver((entries, headerObserver) => {
  const isNavMenuOpen = navMenuContainerElement.classList.contains(
    "show_navigation-header-nav-container"
  );

  const isDesktopVersion = isWindowGreaterThan(desktopDimensions);

  const [entry] = entries;
  if (!entry.isIntersecting) {
    headerContainer.classList.add("add_navigation-header-container-color");
    logoImgElement.src = logoColors.colorSrc;
    menuImgElement.src = !isNavMenuOpen
      ? hamburgerIconColors.colorSrc
      : closeIconColors.colorSrc;
    // handle the color change for the nav item links.
    if (isDesktopVersion)
      navItemLinks.forEach((item) => {
        item.classList.add("nav-item-link-second-color");
      });
  } else {
    headerContainer.classList.remove("add_navigation-header-container-color");
    logoImgElement.src = logoColors.whiteSrc;
    menuImgElement.src = !isNavMenuOpen
      ? hamburgerIconColors.whiteSrc
      : closeIconColors.whiteSrc;
    if (isDesktopVersion)
      navItemLinks.forEach((item) => {
        item.classList.remove("nav-item-link-second-color");
      });
  }
}, observerOptions);

headerObserver.observe(heroSection);

// toggle open nav menu
const hideNavMenu = () => {
  const isHeaderColorBackground = headerContainer.classList.contains(
    "add_navigation-header-container-color"
  );

  const hamburgerIconSrc = isHeaderColorBackground
    ? hamburgerIconColors.colorSrc
    : hamburgerIconColors.whiteSrc;

  menuImgElement.src = hamburgerIconSrc;
  navMenuContainerElement.classList.remove(
    "show_navigation-header-nav-container"
  );
  navMenuContainerElement.style.maxHeight = "0px";
};

const showNavMenu = () => {
  const isHeaderColorBackground = headerContainer.classList.contains(
    "add_navigation-header-container-color"
  );

  const navMenuElementHeight = navMenuContainerElement.scrollHeight;

  const closeIconSrc = isHeaderColorBackground
    ? closeIconColors.colorSrc
    : closeIconColors.whiteSrc;

  menuImgElement.src = closeIconSrc;
  navMenuContainerElement.classList.add("show_navigation-header-nav-container");
  // set max-height to animate the nav menu opening
  navMenuContainerElement.style.maxHeight = `${navMenuElementHeight}px`;
};

const toggleMenu = () => {
  const isNavMenuOpen = navMenuContainerElement.classList.contains(
    "show_navigation-header-nav-container"
  );
  isNavMenuOpen ? hideNavMenu() : showNavMenu();
};

const hideNavMenuWhenClickedOutside = (event) => {
  const clickedInsideNavMenu = headerContainer.contains(event.target);
  const isNavMenuOpen = navMenuContainerElement.classList.contains(
    "show_navigation-header-nav-container"
  );

  const shouldHideNavMenu = !clickedInsideNavMenu && isNavMenuOpen;
  shouldHideNavMenu && hideNavMenu();
};

menuIconContainer.addEventListener("click", toggleMenu);
document.addEventListener("click", hideNavMenuWhenClickedOutside);

// on nav menu item click hide the nav menu - first check if the navMenu is open
const onNavLinkClickCloseNavMenu = () => {
  navItemLinks.forEach((item) => {
    item.addEventListener("click", hideNavMenu);
  });
};

onNavLinkClickCloseNavMenu();

/*=============================== Hero Section ===============================*/
const track = document.querySelector(".carousel__track");
const slides = Array.from(track.children);
const carouselNav = document.querySelector(".carousel__nav");
const carouselIndicators = Array.from(carouselNav.children);
let timer = null;

const moveSlide = (currentSlide, targetedSlide) => {
  currentSlide.classList.remove("carousel__slide--active");
  targetedSlide.classList.add("carousel__slide--active");
};

const moveNavIndicator = (currentNavIndicator, targetedNavIndicator) => {
  currentNavIndicator.classList.remove("carousel__nav--active");
  targetedNavIndicator.classList.add("carousel__nav--active");
};

const carouselController = (targetedSlide, targetedIndex) => {
  let nextSlide = targetedSlide;
  let nextIndicator = targetedIndex;

  const currentSlide = track.querySelector(".carousel__slide--active");
  const currentNavIndicator = carouselNav.querySelector(
    ".carousel__nav--active"
  );

  if (!nextSlide)
    nextSlide = currentSlide.nextElementSibling
      ? currentSlide.nextElementSibling
      : slides[0];

  if (!nextIndicator)
    nextIndicator = currentNavIndicator.nextElementSibling
      ? currentNavIndicator.nextElementSibling
      : carouselIndicators[0];

  moveSlide(currentSlide, nextSlide);
  moveNavIndicator(currentNavIndicator, nextIndicator);

  timer = setTimeout(() => carouselController(), 3500);
};

const onNavigationIndicatorClick = (e) => {
  const targetCarouselIndicator = e.target.closest("button");
  if (!targetCarouselIndicator) return;
  clearTimeout(timer);
  const indicatorIndex = carouselIndicators.findIndex(
    (indicator) => indicator === targetCarouselIndicator
  );
  const targetedSlide = slides[indicatorIndex];
  carouselController(targetedSlide, targetCarouselIndicator);
};

setTimeout(() => carouselController(), 3500);
carouselNav.addEventListener("click", onNavigationIndicatorClick);
