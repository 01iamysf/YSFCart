# YSFCart

YSFCart is a responsive e-commerce website built with HTML, CSS, and JavaScript.

##  Project Structure

```
YSFCart/
├── index.html              ← Homepage
├── pages/
│   ├── shop.html           ← Browse all products
│   ├── login.html          ← User login
│   ├── register.html       ← New account registration
│   ├── cart.html           ← Shopping cart (localStorage-powered)
│   └── contact.html        ← Contact form
├── assets/
│   ├── css/
│   │   ├── styles.css      ← Core styles & component styles
│   │   └── mediaquery.css  ← All responsive breakpoints
│   ├── js/
│   │   └── main.js         ← Sidenav, Swiper, Cart logic, Forms
│   └── images/             ← All product & background images
└── README.md
```

##  Features

- Responsive design (mobile, tablet, desktop)
- Mobile hamburger sidenav with smooth animation
- Swiper.js carousel for trending products
- Add to Cart functionality (persists via `localStorage`)
- Cart page with quantity control and item removal
- Login & Register forms with validation
- Contact form with success feedback
- SEO-friendly meta tags on all pages

##  Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Flexbox, Grid
- **Vanilla JS** — No frameworks
- **Swiper.js** (CDN) — Product carousel
- **Font Awesome 4** (CDN) — Icons
- **Google Fonts** — Roboto, Akaya Kanadaka

## 🌐 Running Locally

Simply open `index.html` in any modern browser — no build step required.

---
Designed by Md Yusuf &copy; 2024
