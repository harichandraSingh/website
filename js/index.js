
'use strict';

/* ==========================================
   HARICHANDRA SINGH - PERSONAL WEBSITE
   Website: harichandrasingh.com.np
   JavaScript: website interactions, notes and notices
========================================== */

const $ = id => document.getElementById(id);

/* ==========================================
   1. COPYRIGHT YEAR
========================================== */

const yearElement = $('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* ==========================================
   2. MOBILE NAVIGATION
========================================== */

const menu = $('menuBtn');
const links = $('navLinks');

if (menu && links) {

  menu.addEventListener('click', () => {

    const open = links.classList.toggle('open');

    menu.setAttribute(
      'aria-expanded',
      String(open)
    );

    menu.setAttribute(
      'aria-label',
      open ? 'Close navigation' : 'Open navigation'
    );

    menu.textContent = open ? '×' : '☰';

  });

  links.querySelectorAll('a').forEach(a => {

    a.addEventListener('click', () => {

      links.classList.remove('open');

      menu.setAttribute(
        'aria-expanded',
        'false'
      );

      menu.setAttribute('aria-label', 'Open navigation');
      menu.textContent = '☰';

    });

  });

}

/* ==========================================
   3. AGRICULTURE PDF NOTES DATABASE
========================================== */

/*
  HOW TO ADD PDF NOTES:

  1. Upload PDF into:
     Assets/All Notes/

  2. Add a new object to the notes array.

  3. Use type: 'free' or 'premium'.

  IMPORTANT:
  Public PDF URLs are not secure.
  This version is for interface testing.
*/

const notes = [

  {
    id: 'food-crop-2082',
    title: 'Food Crop Production 2082',
    category: 'Agronomy',
    description:
      'Food crop production questions and study materials.',
    url:
      'Assets/All Notes/Food Crop Production 2082 Question.pdf',
    type: 'free',
    price: 0
  },

  {
    id: 'industrial-entomology',
    title: 'Industrial Entomology & Aquaculture',
    category: 'Plant Protection',
    description:
      'Industrial entomology and aquaculture study notes.',
    url:
      'Assets/All Notes/Industrial Entomology & Aquaculture by Harichandra Singh.pdf',
    type: 'premium',
    price: 99
  },

  {
    id: 'commercial-fruit',
    title: 'Commercial Fruit Production',
    category: 'Horticulture',
    description:
      'Commercial fruit production and post-harvest technology.',
    url:
      'Assets/All Notes/Commercial fruit production and pht.pdf',
    type: 'premium',
    price: 149
  },

  {
    id: 'citrus-production',
    title: 'Citrus Production',
    category: 'Horticulture',
    description:
      'Citrus cultivation and management notes.',
    url:
      'Assets/All Notes/Citrus.pdf',
    type: 'free',
    price: 0
  }

];

/* ==========================================
   4. NOTES SEARCH AND CATEGORY FILTER
========================================== */

function renderNotes() {

  const searchInput = $('noteSearch');
  const filterInput = $('noteFilter');
  const target = $('noteList');

  if (!target) return;

  const q = searchInput
    ? searchInput.value.trim().toLowerCase()
    : '';

  const filter = filterInput
    ? filterInput.value
    : 'all';

  const items = notes.filter(n => {

    const matchesCategory =
      filter === 'all' ||
      n.category === filter;

    const searchText = (
      n.title + ' ' +
      n.category + ' ' +
      n.description
    ).toLowerCase();

    return matchesCategory &&
      searchText.includes(q);

  });

  target.replaceChildren();

  if (!items.length) {

    const message = document.createElement('p');

    message.textContent =
      'No matching notes found.';

    target.append(message);

    return;
  }

  items.forEach(n => {

    const article = document.createElement('article');

    article.className = 'note';

    const category = document.createElement('small');

    category.textContent = n.category;

    const title = document.createElement('strong');

    title.textContent = '📄 ' + n.title;

    const description = document.createElement('p');

    description.textContent = n.description;

    /* ACCESS BADGE */

    const badge = document.createElement('small');

    badge.className = 'note-badge';

    badge.textContent = n.type === 'premium'
      ? '🔒 Premium Download'
      : '✅ Free Reading';

    /* VIEW BUTTON */

    const viewBtn = document.createElement('button');

    viewBtn.type = 'button';

    viewBtn.textContent = '👁 View PDF';

    viewBtn.className = 'note-view-btn';

    viewBtn.addEventListener('click', () => {

      openPdfViewer(n);

    });

    /* DOWNLOAD BUTTON */

    const downloadBtn = document.createElement('button');

    downloadBtn.type = 'button';

    downloadBtn.className = 'note-download-btn';

    if (n.type === 'premium') {

      downloadBtn.textContent =
        '🔒 Buy PDF - Rs. ' + n.price;

    } else {

      downloadBtn.textContent =
        '🔐 Login to Download';

    }

    downloadBtn.addEventListener('click', () => {

      requestNoteDownload(n);

    });

    /* BUTTON CONTAINER */

    const buttonGroup = document.createElement('div');

    buttonGroup.className = 'note-actions';

    buttonGroup.append(
      viewBtn,
      downloadBtn
    );

    article.append(
      category,
      title,
      description,
      badge,
      buttonGroup
    );

    target.append(article);

  });

}

/* SEARCH EVENTS */

if ($('noteSearch')) {

  $('noteSearch').addEventListener(
    'input',
    renderNotes
  );

}

if ($('noteFilter')) {

  const noteFilter = $('noteFilter');

  const existingCategories = Array.from(
    noteFilter.options
  ).map(option => option.value);

  const categories = [
    ...new Set(notes.map(n => n.category))
  ];

  categories.forEach(category => {

    if (!existingCategories.includes(category)) {

      const option = document.createElement('option');

      option.value = category;
      option.textContent = category;

      noteFilter.append(option);

    }

  });

  noteFilter.addEventListener(
    'change',
    renderNotes
  );

}

renderNotes();

/* ==========================================
   5. PDF READER
========================================== */

/*
  Public PDF reader.

  Note:
  An iframe does not prevent downloading,
  printing or copying the original PDF.

  For protected notes, use a custom viewer
  with private server-side PDF storage.
*/

function openPdfViewer(note) {

  let modal = $('pdfReadModal');

  if (!modal) {

    modal = document.createElement('div');

    modal.id = 'pdfReadModal';

    Object.assign(modal.style, {
      position: 'fixed',
      inset: '0',
      background: '#111827',
      zIndex: '9999',
      display: 'flex',
      flexDirection: 'column',
      padding: '0'
    });

    modal.setAttribute('role', 'dialog');

    modal.setAttribute('aria-modal', 'true');

    const header = document.createElement('div');

    Object.assign(header.style, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      background: '#166534',
      color: 'white'
    });

    const heading = document.createElement('strong');

    heading.id = 'pdfReadTitle';

    heading.style.flex = '1';

    const closeBtn = document.createElement('button');

    closeBtn.type = 'button';

    closeBtn.textContent = '✕ Close';

    Object.assign(closeBtn.style, {
      background: '#ffffff',
      color: '#166534',
      border: 'none',
      borderRadius: '6px',
      padding: '9px 14px',
      cursor: 'pointer'
    });

    closeBtn.addEventListener('click', closePdfViewer);

    header.append(heading, closeBtn);

    const frame = document.createElement('iframe');

    frame.id = 'pdfReadFrame';

    frame.title = 'Agriculture PDF Notes Reader';

    Object.assign(frame.style, {
      width: '100%',
      flex: '1',
      border: 'none',
      background: '#ffffff'
    });

    modal.append(header, frame);

    document.body.append(modal);

  }

  $('pdfReadTitle').textContent = note.title;

  $('pdfReadFrame').src =
    encodeURI(note.url);

  document.body.style.overflow = 'hidden';

}

function closePdfViewer() {

  const modal = $('pdfReadModal');

  if (modal) {

    const frame = $('pdfReadFrame');

    if (frame) {
      frame.src = 'about:blank';
    }

    modal.remove();

  }

  document.body.style.overflow = '';

}

/* CLOSE PDF USING ESCAPE KEY */

document.addEventListener('keydown', e => {

  if (e.key === 'Escape' && $('pdfReadModal')) {

    closePdfViewer();

  }

});

/* ==========================================
   6. STUDENT LOGIN MODAL
========================================== */

const loginModal = $('loginModal');

function setModal(open) {

  if (!loginModal) return;

  loginModal.classList.toggle('open', open);

  loginModal.setAttribute(
    'aria-hidden',
    String(!open)
  );

  if (open) {

    if ($('closeLogin')) {
      $('closeLogin').focus();
    }

  } else {

    if ($('loginBtn')) {
      $('loginBtn').focus();
    }

  }

}

const loginBtn = $('loginBtn');

if (loginBtn) {

  loginBtn.addEventListener('click', () => {

    if (links) {
      links.classList.remove('open');
    }

    if (menu) {

      menu.setAttribute(
        'aria-expanded',
        'false'
      );

      menu.setAttribute('aria-label', 'Open navigation');
      menu.textContent = '☰';

    }

    setModal(true);

  });

}

if ($('closeLogin')) {

  $('closeLogin').addEventListener(
    'click',
    () => setModal(false)
  );

}

if (loginModal) {

  loginModal.addEventListener('click', e => {

    if (e.target === loginModal) {

      setModal(false);

    }

  });

}

document.addEventListener('keydown', e => {

  if (
    e.key === 'Escape' &&
    loginModal &&
    loginModal.classList.contains('open')
  ) {

    setModal(false);

  }

});

/* LOGIN FORM */

/*
  Login interface only.

  Real authentication requires:
  - Supabase Auth or another provider
  - Secure session handling
  - Server-side access verification
*/

const loginForm = $('loginForm');

if (loginForm) {

  loginForm.addEventListener('submit', e => {

    e.preventDefault();

    alert(
      'Student login is not configured yet. ' +
      'Authentication will be available after backend setup.'
    );

  });

}

/* ==========================================
   7. DOWNLOAD ACCESS CONTROL
========================================== */

/*
  Frontend demonstration only.

  No PDF download is granted here.

  A secure backend must verify:
  - User authentication
  - Note access type
  - Payment status
  - Download permission
*/

function requestNoteDownload(note) {

  if (note.type === 'premium') {

    showPaymentInformation(note);

    return;

  }

  alert(
    'Please log in to download this PDF. ' +
    'Downloads will be enabled after authentication setup.'
  );

  setModal(true);

}

/* ==========================================
   8. PREMIUM NOTES PAYMENT
========================================== */

function showPaymentInformation(note) {

  const message =
    'Premium Agriculture Notes\n\n' +
    'Title: ' + note.title + '\n' +
    'Price: Rs. ' + note.price + '\n\n' +
    'Online payment is not configured yet.\n\n' +
    'After payment integration, registered users ' +
    'will be able to purchase and download this note.';

  alert(message);

}

/* ==========================================
   9. DONATION SECTION
========================================== */

const donateBtn = $('donateBtn');

if (donateBtn) {

  donateBtn.addEventListener('click', () => {

    const donateInfo = $('donateInfo');

    if (donateInfo) {

      donateInfo.classList.toggle('hidden');

    }

  });

}

/* ==========================================
   10. CONTACT FORM
========================================== */

const contactForm = $('contactForm');

if (contactForm) {

  contactForm.addEventListener('submit', e => {

    e.preventDefault();

    /*
      REPLACE WITH YOUR EMAIL ADDRESS
    */

    const address = 'harichandrasingh222@gmail.com';

    const name = $('contactName')
      ? $('contactName').value.trim()
      : '';

    const email = $('contactEmail')
      ? $('contactEmail').value.trim()
      : '';

    const message = $('contactMessage')
      ? $('contactMessage').value.trim()
      : '';

    const subject = encodeURIComponent(
      'Website inquiry from ' + name
    );

    const body = encodeURIComponent(
      'Name: ' + name +
      '\nEmail: ' + email +
      '\n\n' + message
    );

    location.href =
      'mailto:' + address +
      '?subject=' + subject +
      '&body=' + body;

  });

}

/* ==========================================
   LATEST WEBSITE NOTICES + SPECIAL WISHES
   Harichandra Singh | Learn Krishi
   Website: harichandrasingh.com.np
========================================== */

(function initLatestBanner() {

  const track = document.getElementById('latestTrack');
  const wishBox = document.getElementById('latestWish');

  if (!track || !wishBox) return;

  /* ========================================
     1. WEBSITE LATEST UPDATES
     Add or remove announcements here.
  ======================================== */

  const notices = [

    {
      text: '📚 Browse Agriculture Study Notes',
      href: '#notes'
    },

    {
      text: '🎓 Watch Agriculture Online Classes',
      href: '#classes'
    },

    {
      text: '🌱 Learn Agriculture. Grow Together.',
      href: '#about'
    },

    {
      text: '📩 Questions or collaboration? Contact us',
      href: '#contact'
    }

  ];

  /* ========================================
     2. FESTIVALS AND SPECIAL OCCASIONS

     Dates: YYYY-MM-DD
     Start and end dates are inclusive.
     Verify festival dates before publishing.
  ======================================== */

  const occasions = [

    {
      start: '2026-10-18',
      end: '2026-10-22',
      title: '🎉 Happy Dashain & Tihar!',
      message:
        'Wishing you and your family happiness, peace and prosperity.'
    },

    {
      start: '2026-11-08',
      end: '2026-11-12',
      title: '🪔 Happy Tihar!',
      message:
        'May your home be filled with light and joy.'
    },

    {
      start: '2026-12-05',
      end: '2026-12-05',
      title: '🌍 World Soil Day',
      message:
        'Healthy soil supports healthy crops and a better future.'
    }

  ];

  /* ========================================
     3. GET CURRENT NEPAL DATE
  ======================================== */

  function nepalDate() {

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kathmandu',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(new Date());

    const part = type =>
      parts.find(p => p.type === type).value;

    return `${part('year')}-${part('month')}-${part('day')}`;

  }

  /* ========================================
     4. DISPLAY NOTICES AND GREETINGS
  ======================================== */

  function render() {

    const today = nepalDate();

    const occasion = occasions.find(o =>
      today >= o.start && today <= o.end
    );

    /* Show special greeting */

    wishBox.hidden = !occasion;

    if (occasion) {

      document.getElementById(
        'latestWishTitle'
      ).textContent = occasion.title;

      document.getElementById(
        'latestWishMessage'
      ).textContent = occasion.message;

    }

    /* Clear previous announcements */

    track.replaceChildren();

    /* Create notice links */

    function addNotice(item, duplicate) {

      const link = document.createElement('a');

      link.className = 'latest-item';
      link.href = item.href;
      link.textContent = item.text;

      if (duplicate) {
        link.setAttribute('aria-hidden', 'true');
        link.tabIndex = -1;
      }

      track.append(link);

    }

    /* Original announcements */

    notices.forEach(item =>
      addNotice(item, false)
    );

    /* Duplicate for continuous animation */

    notices.forEach(item =>
      addNotice(item, true)
    );

  }

  /* ========================================
     5. INITIALIZE
  ======================================== */

  render();

  /* Refresh when visitor returns to tab */

  document.addEventListener(
    'visibilitychange',
    () => {
      if (!document.hidden) render();
    }
  );

})();

/* ==========================================
   END OF JAVASCRIPT
   Developed for Harichandra Singh
   Seed Calculator Removed
========================================== */
