/* ==========================================================================
   Sable & Iron — interactions
   Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');

  const locationCards = $$('.location[data-hours]');
  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const dayLabels = { sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat' };

  const pad = (n) => String(n).padStart(2, '0');
  const isoDate = (date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  const formatMinutes = (minutes) => {
    const hour24 = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const suffix = hour24 >= 12 ? 'pm' : 'am';
    return `${hour12}${mins ? `:${pad(mins)}` : ''}${suffix}`;
  };

  const formatTimeOption = (minutes) => {
    const hour24 = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const suffix = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${pad(mins)} ${suffix}`;
  };

  const parseTimeValue = (value) => {
    const match = String(value).match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i);
    if (!match) return null;
    let hour = Number(match[1]) % 12;
    if (match[3].toUpperCase() === 'PM') hour += 12;
    return hour * 60 + Number(match[2]);
  };

  const dateFromValue = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return null;
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const miamiNow = () => {
    const now = new Date();
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).formatToParts(now);
      const find = (type) => {
        const part = parts.find((item) => item.type === type);
        return part ? part.value : '';
      };
      const year = Number(find('year'));
      const month = Number(find('month'));
      const day = Number(find('day'));
      return {
        date: `${year}-${pad(month)}-${pad(day)}`,
        minutes: (Number(find('hour')) % 24) * 60 + Number(find('minute')),
        day: new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay()
      };
    } catch (err) {
      return {
        date: isoDate(now),
        minutes: now.getHours() * 60 + now.getMinutes(),
        day: now.getDay()
      };
    }
  };

  const getSchedule = (location) => {
    const card = locationCards.find((item) => {
      const title = $('h3', item);
      return title && title.textContent.trim() === location;
    });
    if (!card) return null;
    try {
      return JSON.parse(card.dataset.hours);
    } catch (err) {
      return null;
    }
  };

  const getHoursFor = (location, date) => {
    const schedule = getSchedule(location);
    if (!schedule || !date) return null;
    return schedule[dayKeys[date.getDay()]] || null;
  };

  const syncScrollLock = () => {
    const anyOpen = document.querySelector('dialog[open]');
    document.body.classList.toggle('is-locked', Boolean(anyOpen));
  };

  /* ---------------------------------------------------------------- Header */
  const header = $('#site-header');
  const bookbar = $('#bookbar');
  const hero = $('.hero');
  const footer = $('.footer');
  const navLinks = $$('.nav a[href^="#"]');
  const navSections = navLinks
    .map((link) => ({ link, section: $(link.getAttribute('href')) }))
    .filter((item) => item.section);
  let lastScroll = -1;

  const updateNavCurrent = () => {
    if (!navSections.length) return;
    const marker = window.scrollY + window.innerHeight * 0.3;
    let current = null;
    navSections.forEach((item) => {
      if (item.section.offsetTop <= marker) current = item.link;
    });
    navLinks.forEach((link) => {
      const active = link === current;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const onScroll = () => {
    const y = window.scrollY;
    if (y === lastScroll) return;
    lastScroll = y;

    if (header) header.classList.toggle('is-scrolled', y > 24);

    if (bookbar && hero) {
      const footerVisible = footer
        ? footer.getBoundingClientRect().top < window.innerHeight - 12
        : false;
      const show = y > window.innerHeight * 0.62 && !footerVisible;
      bookbar.classList.toggle('is-visible', show);
      bookbar.setAttribute('aria-hidden', String(!show));
      bookbar.inert = !show;
    }

    updateNavCurrent();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    lastScroll = -1;
    onScroll();
  });
  onScroll();

  /* ----------------------------------------------------------- Mobile menu */
  const mobileMenu = $('#mobile-menu');
  const menuToggle = $('#menu-toggle');

  const openMenu = () => {
    if (!mobileMenu || mobileMenu.open) return;
    mobileMenu.showModal();
    menuToggle.setAttribute('aria-expanded', 'true');
    syncScrollLock();
  };
  const closeMenu = () => {
    if (mobileMenu && mobileMenu.open) mobileMenu.close();
  };

  menuToggle?.addEventListener('click', openMenu);
  $('#menu-close')?.addEventListener('click', closeMenu);
  mobileMenu?.addEventListener('close', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    syncScrollLock();
  });
  $$('.mobile-menu__nav a').forEach((link) =>
    link.addEventListener('click', closeMenu)
  );
  mobileMenu?.addEventListener('click', (event) => {
    if (event.target === mobileMenu) closeMenu();
  });

  /* --------------------------------------------------------------- Booking */
  const booking = $('#booking');
  const bookingForm = $('#booking-form');
  const bookingSuccess = $('#booking-success');
  const bookingSummary = $('#booking-summary');
  const bookingRef = $('#booking-ref');
  const bookingError = $('#booking-error');
  const bookingHint = $('#booking-time-hint');
  const locationSelect = $('#booking-location');
  const serviceSelect = $('#booking-service');
  const barberSelect = $('#booking-barber');
  const dateInput = $('#booking-date');
  const timeSelect = $('#booking-time');
  const nameInput = $('#booking-name');
  const phoneInput = $('#booking-phone');
  const nameError = $('#booking-name-error');
  const phoneError = $('#booking-phone-error');

  const serviceDurations = {
    'Signature Cut': 45,
    'Skin Fade': 45,
    'Hot-Towel Shave': 40,
    'Beard Sculpt': 30,
    'Line-Up': 15,
    'The Full Service': 90
  };

  const getSelectedDate = () => dateFromValue(dateInput ? dateInput.value : '');

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const nextOpenDate = (location, fromValue) => {
    const schedule = getSchedule(location);
    const date = dateFromValue(fromValue) || new Date();
    if (!schedule) return isoDate(date);
    for (let i = 0; i < 14; i += 1) {
      if (schedule[dayKeys[date.getDay()]]) return isoDate(date);
      date.setDate(date.getDate() + 1);
    }
    return isoDate(date);
  };

  const setMinDate = () => {
    if (!dateInput) return;
    const today = miamiNow().date;
    dateInput.min = today;
    if (!dateInput.value || dateInput.value < today) {
      const tomorrow = new Date(`${today}T12:00:00`);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = isoDate(tomorrow);
    }
  };

  const setHint = (message, warning = false) => {
    if (!bookingHint) return;
    bookingHint.textContent = message;
    bookingHint.classList.toggle('is-warning', warning);
  };

  const setFieldError = (input, errorEl, message) => {
    if (!input || !errorEl) return;
    if (message) {
      errorEl.textContent = message;
      errorEl.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', errorEl.id);
    } else {
      errorEl.textContent = '';
      errorEl.hidden = true;
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  };

  const validateName = () => {
    const value = nameInput ? nameInput.value.trim() : '';
    let message = '';
    if (!value) message = 'Please add your name.';
    else if (value.length < 2) message = 'Please use at least 2 characters.';
    setFieldError(nameInput, nameError, message);
    return !message;
  };

  const validatePhone = () => {
    const digits = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
    let message = '';
    if (!digits) message = 'Please add a phone number.';
    else if (digits.length < 10 || digits.length > 15) message = 'Use a phone number with 10 to 15 digits.';
    setFieldError(phoneInput, phoneError, message);
    return !message;
  };

  const populateSlots = () => {
    if (!timeSelect || !dateInput) return;
    const previous = timeSelect.value;
    const location = locationSelect ? locationSelect.value : 'Edgewater';
    const date = getSelectedDate();
    const service = serviceSelect ? serviceSelect.value : 'Signature Cut';
    const duration = serviceDurations[service] || 30;
    const now = miamiNow();

    timeSelect.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = 'Choose a time';
    timeSelect.appendChild(placeholder);

    if (!date) {
      placeholder.textContent = 'Choose a date';
      setHint('Pick a date to see available times.', true);
      return;
    }

    const hours = getHoursFor(location, date);
    if (!hours) {
      placeholder.textContent = 'Closed that day';
      setHint(`${location} is closed on ${formatDate(date)}. Choose another day or shop.`, true);
      return;
    }

    const earliest = dateInput.value === now.date ? now.minutes + 30 : 0;
    const starts = [];
    for (let minutes = hours[0]; minutes + duration <= hours[1]; minutes += 30) {
      if (minutes >= earliest) starts.push(minutes);
    }

    if (!starts.length) {
      placeholder.textContent = dateInput.value === now.date ? 'No times left today' : 'No times available';
      setHint(
        dateInput.value === now.date
          ? `No times left today at ${location}. Try another day.`
          : `No ${duration}-minute ${service} slots fit on this day. Try another day or shop.`,
        true
      );
      return;
    }

    starts.forEach((minutes) => {
      const option = document.createElement('option');
      option.value = formatTimeOption(minutes);
      option.textContent = option.value;
      timeSelect.appendChild(option);
    });

    const keepPrevious = previous && Array.from(timeSelect.options).some((option) => option.value === previous);
    timeSelect.value = keepPrevious ? previous : '';

    setHint(
      `${location} · ${formatDate(date)} · open ${formatMinutes(hours[0])}–${formatMinutes(hours[1])} · ${starts.length} time${starts.length === 1 ? '' : 's'} available`
    );
  };

  const syncBooking = ({ ensureOpen = false } = {}) => {
    setMinDate();
    if (ensureOpen && dateInput) {
      dateInput.value = nextOpenDate(locationSelect ? locationSelect.value : 'Edgewater', dateInput.value);
    }
    populateSlots();
  };

  const resetBooking = () => {
    if (!bookingForm) return;
    bookingForm.reset();
    // Dynamic slot options have no defaultSelected flag, so a reset would
    // otherwise leave the first available time selected before the visitor
    // has chosen anything.
    if (timeSelect) timeSelect.value = '';
    bookingForm.hidden = false;
    if (bookingSuccess) bookingSuccess.hidden = true;
    if (bookingError) bookingError.hidden = true;
    setFieldError(nameInput, nameError, '');
    setFieldError(phoneInput, phoneError, '');
    setMinDate();
    populateSlots();
  };

  const openBooking = (data = {}) => {
    if (!booking || booking.open) return;
    closeMenu();
    resetBooking();

    if (data.location) {
      const match = Array.from(locationSelect.options).find((opt) => opt.value === data.location);
      if (match) locationSelect.value = match.value;
    }
    if (data.service) {
      const match = Array.from(serviceSelect.options).find((opt) => opt.value === data.service);
      if (match) serviceSelect.value = match.value;
    }
    if (data.barber) {
      const match = Array.from(barberSelect.options).find((opt) => opt.value === data.barber);
      if (match) barberSelect.value = match.value;
    }

    syncBooking({ ensureOpen: true });
    booking.showModal();
    syncScrollLock();
    const main = $('.booking__main', booking);
    if (main) main.scrollTop = 0;
  };

  $$('[data-book]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      openBooking({
        location: trigger.dataset.location,
        service: trigger.dataset.service,
        barber: trigger.dataset.barber
      });
    });
  });

  $$('[data-close-booking]').forEach((button) =>
    button.addEventListener('click', () => booking && booking.close())
  );
  booking?.addEventListener('click', (event) => {
    if (event.target === booking) booking.close();
  });
  booking?.addEventListener('close', () => {
    resetBooking();
    syncScrollLock();
  });

  locationSelect?.addEventListener('change', () => syncBooking({ ensureOpen: true }));
  serviceSelect?.addEventListener('change', populateSlots);
  dateInput?.addEventListener('change', populateSlots);

  bookingForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (bookingError) bookingError.hidden = true;

    const nameOk = validateName();
    const phoneOk = validatePhone();
    const date = getSelectedDate();
    const location = locationSelect ? locationSelect.value : 'Edgewater';
    const hours = getHoursFor(location, date);

    if (!date) {
      setHint('Pick a date to see available times.', true);
      dateInput?.focus();
      return;
    }
    if (!hours) {
      setHint(`${location} is closed on ${formatDate(date)}. Choose another day or shop.`, true);
      dateInput?.focus();
      return;
    }
    if (!timeSelect || !timeSelect.value) {
      setHint('Choose one of the available times before requesting the chair.', true);
      timeSelect?.focus();
      return;
    }
    if (!nameOk || !phoneOk) {
      (nameOk ? phoneInput : nameInput)?.focus();
      return;
    }

    const service = serviceSelect ? serviceSelect.value : 'Signature Cut';
    const duration = serviceDurations[service] || 30;
    const minutes = parseTimeValue(timeSelect.value);
    const now = miamiNow();
    const stale = minutes === null ||
      minutes < hours[0] ||
      minutes + duration > hours[1] ||
      (dateInput.value === now.date && minutes < now.minutes + 30);

    if (stale) {
      populateSlots();
      if (bookingError) {
        bookingError.textContent = `That time no longer fits. Choose one of the available times for ${location}.`;
        bookingError.hidden = false;
        bookingError.focus();
      }
      return;
    }

    const data = new FormData(bookingForm);
    const dateText = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    const barber = String(data.get('barber') || 'No preference');
    const barberText = barber === 'No preference' ? 'the next available barber' : barber;
    const phone = String(data.get('phone') || '').trim();

    const serviceNode = document.createElement('b');
    serviceNode.textContent = service;
    bookingSummary.replaceChildren(
      serviceNode,
      document.createTextNode(
        ` with ${barberText} at our ${location} shop, ${dateText} at ${timeSelect.value}. ` +
        `We'll text ${phone} if anything changes.`
      )
    );
    bookingRef.textContent = `SI-${Math.floor(1000 + Math.random() * 9000)}`;

    bookingForm.hidden = true;
    bookingSuccess.hidden = false;
    const main = $('.booking__main', booking);
    if (main) main.scrollTop = 0;
    bookingSuccess.focus({ preventScroll: true });
  });

  bookingForm?.addEventListener('input', (event) => {
    if (bookingError) bookingError.hidden = true;
    if (event.target === nameInput) setFieldError(nameInput, nameError, '');
    if (event.target === phoneInput) setFieldError(phoneInput, phoneError, '');
  });

  bookingForm?.addEventListener('change', () => {
    if (bookingError) bookingError.hidden = true;
  });

  setMinDate();
  populateSlots();

  /* -------------------------------------------------------- Reveal on scroll */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = Number(el.dataset.delay || 0) * 110;
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('is-in');
          revealObserver.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -7% 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ------------------------------------------------------------- Count-up */
  const counters = $$('[data-count]');
  const animateCount = (el) => {
    const target = Number(el.dataset.count || 0);
    if (reduceMotion.matches || !Number.isFinite(target)) {
      el.textContent = String(target);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countObserver.observe(el));
  }

  /* ------------------------------------------------------- Service preview */
  const preview = $('#service-preview');
  const previewImg = preview ? $('img', preview) : null;
  const serviceList = $('#service-list');
  let previewFrame = null;
  let previewX = 0;
  let previewY = 0;

  const canPreview = () =>
    Boolean(preview) && finePointer.matches && window.innerWidth >= 1100;

  const positionPreview = () => {
    if (!preview) return;
    previewFrame = null;
    const halfW = 115;
    const x = Math.min(Math.max(previewX + 150, halfW + 16), window.innerWidth - halfW - 16);
    const y = Math.min(Math.max(previewY, 170), window.innerHeight - 170);
    preview.style.left = `${x}px`;
    preview.style.top = `${y}px`;
  };

  const showPreview = (service, event) => {
    if (!canPreview()) return;
    const src = service.dataset.image;
    if (src && previewImg && previewImg.getAttribute('src') !== src) {
      previewImg.src = src;
    }
    previewX = event.clientX;
    previewY = event.clientY;
    if (!previewFrame) previewFrame = requestAnimationFrame(positionPreview);
    preview.classList.add('is-visible');
  };

  const hidePreview = () => {
    if (!preview) return;
    preview.classList.remove('is-visible');
  };

  serviceList?.addEventListener('pointermove', (event) => {
    if (!canPreview()) return;
    const service = event.target.closest('.service');
    if (!service) {
      hidePreview();
      return;
    }
    showPreview(service, event);
  });
  serviceList?.addEventListener('pointerleave', hidePreview);
  window.addEventListener('scroll', hidePreview, { passive: true });

  /* --------------------------------------------------------------- Gallery */
  const rail = $('#gallery-rail');
  if (rail) {
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    let suppressClick = false;

    rail.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      isDown = true;
      moved = false;
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      rail.classList.add('is-dragging');
      if (rail.setPointerCapture) {
        try { rail.setPointerCapture(event.pointerId); } catch (err) { /* noop */ }
      }
    });

    rail.addEventListener('pointermove', (event) => {
      if (!isDown) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 5) moved = true;
      if (moved) rail.scrollLeft = startScroll - delta;
    });

    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      suppressClick = moved;
      rail.classList.remove('is-dragging');
    };
    rail.addEventListener('pointerup', endDrag);
    rail.addEventListener('pointercancel', endDrag);
    rail.addEventListener('pointerleave', endDrag);

    rail.addEventListener('click', (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    }, true);

    rail.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const step = Math.round(rail.clientWidth * 0.7);
      rail.scrollBy({
        left: event.key === 'ArrowRight' ? step : -step,
        behavior: reduceMotion.matches ? 'auto' : 'smooth'
      });
    });

    const scrollRail = (direction) => {
      rail.scrollBy({
        left: direction * Math.round(rail.clientWidth * 0.72),
        behavior: reduceMotion.matches ? 'auto' : 'smooth'
      });
    };
    $('#gallery-prev')?.addEventListener('click', () => scrollRail(-1));
    $('#gallery-next')?.addEventListener('click', () => scrollRail(1));
  }

  /* --------------------------------------------------------------- Reviews */
  const reviews = $$('.review');
  const reviewDots = $$('.reviews__dot');
  const reviewStage = $('.reviews__stage');
  const reviewStatus = $('#review-status');
  const reviewPause = $('#review-pause');
  let reviewIndex = 0;
  let reviewTimer = null;
  let userPaused = false;
  let reviewHovered = false;
  let reviewFocused = false;

  const announceReview = () => {
    if (!reviewStatus || !reviews.length) return;
    const name = $('.review__cite b', reviews[reviewIndex]);
    const label = name ? `: ${name.textContent.trim()}` : '';
    reviewStatus.textContent = `Review ${reviewIndex + 1} of ${reviews.length}${label}`;
  };

  const showReview = (nextIndex, { announce = false } = {}) => {
    if (!reviews.length) return;
    reviewIndex = (nextIndex + reviews.length) % reviews.length;
    reviews.forEach((review, i) => {
      const active = i === reviewIndex;
      review.classList.toggle('is-active', active);
      review.setAttribute('aria-hidden', String(!active));
    });
    reviewDots.forEach((dot, i) => {
      const active = i === reviewIndex;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
    if (announce) announceReview();
  };

  const autoRotationAllowed = () =>
    !userPaused &&
    !reduceMotion.matches &&
    !document.hidden &&
    !reviewHovered &&
    !reviewFocused &&
    reviews.length > 1;

  const startReviews = () => {
    if (reviewTimer || !autoRotationAllowed()) return;
    reviewTimer = window.setInterval(() => showReview(reviewIndex + 1), 6500);
  };
  const stopReviews = () => {
    if (!reviewTimer) return;
    window.clearInterval(reviewTimer);
    reviewTimer = null;
  };

  const syncPauseControl = () => {
    if (!reviewPause) return;
    reviewPause.hidden = reduceMotion.matches;
    reviewPause.classList.toggle('is-paused', userPaused);
    reviewPause.setAttribute('aria-label', userPaused ? 'Resume review rotation' : 'Pause review rotation');
  };

  const syncReviews = () => {
    stopReviews();
    startReviews();
    syncPauseControl();
  };

  if (reviews.length) {
    showReview(0);
    syncPauseControl();

    reviewDots.forEach((dot, i) => dot.addEventListener('click', () => {
      showReview(i, { announce: true });
      syncReviews();
    }));

    $('#review-prev')?.addEventListener('click', () => {
      showReview(reviewIndex - 1, { announce: true });
      syncReviews();
    });
    $('#review-next')?.addEventListener('click', () => {
      showReview(reviewIndex + 1, { announce: true });
      syncReviews();
    });

    reviewPause?.addEventListener('click', () => {
      userPaused = !userPaused;
      if (reviewStatus) {
        reviewStatus.textContent = userPaused ? 'Review rotation paused.' : 'Review rotation resumed.';
      }
      syncReviews();
    });

    reviewStage?.addEventListener('mouseenter', () => {
      reviewHovered = true;
      syncReviews();
    });
    reviewStage?.addEventListener('mouseleave', () => {
      reviewHovered = false;
      syncReviews();
    });
    reviewStage?.addEventListener('focusin', () => {
      reviewFocused = true;
      syncReviews();
    });
    reviewStage?.addEventListener('focusout', (event) => {
      if (reviewStage.contains(event.relatedTarget)) return;
      reviewFocused = false;
      syncReviews();
    });
    reviewStage?.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      showReview(reviewIndex + (event.key === 'ArrowRight' ? 1 : -1), { announce: true });
      syncReviews();
    });

    let swipeStartX = null;
    reviewStage?.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse') return;
      swipeStartX = event.clientX;
    });
    reviewStage?.addEventListener('pointerup', (event) => {
      if (swipeStartX === null) return;
      const delta = event.clientX - swipeStartX;
      swipeStartX = null;
      if (Math.abs(delta) < 45) return;
      showReview(reviewIndex + (delta < 0 ? 1 : -1), { announce: true });
      syncReviews();
    });

    document.addEventListener('visibilitychange', syncReviews);
    if (typeof reduceMotion.addEventListener === 'function') {
      reduceMotion.addEventListener('change', syncReviews);
    } else if (typeof reduceMotion.addListener === 'function') {
      reduceMotion.addListener(syncReviews);
    }

    startReviews();
  }

  /* ------------------------------------------------------------------- FAQ */
  const faqItems = $$('.faq__item');
  faqItems.forEach((item) => {
    const trigger = $('.faq__trigger', item);
    const panel = $('.faq__panel', item);
    if (!trigger || !panel) return;

    const setOpen = (open) => {
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      panel.setAttribute('aria-hidden', String(!open));
    };
    setOpen(trigger.getAttribute('aria-expanded') === 'true');

    trigger.addEventListener('click', () => {
      const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
      faqItems.forEach((other) => {
        if (other === item) return;
        const otherTrigger = $('.faq__trigger', other);
        const otherPanel = $('.faq__panel', other);
        if (!otherTrigger || !otherPanel) return;
        other.classList.remove('is-open');
        otherTrigger.setAttribute('aria-expanded', 'false');
        otherPanel.setAttribute('aria-hidden', 'true');
      });
      setOpen(willOpen);
    });
  });

  /* --------------------------------------------------------------- Offer */
  const offerForm = $('#offer-form');
  const offerEmail = $('#offer-email');
  const offerMsg = $('#offer-msg');
  const offerSuccess = $('#offer-success');

  offerForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!offerEmail || !offerMsg) return;
    const value = offerEmail.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

    offerMsg.classList.remove('is-success');
    if (!valid) {
      offerMsg.textContent = 'Please enter a valid email address.';
      offerEmail.setAttribute('aria-invalid', 'true');
      offerEmail.focus();
      return;
    }

    offerEmail.removeAttribute('aria-invalid');
    offerMsg.textContent = 'You’re on the list.';
    offerMsg.classList.add('is-success');
    offerForm.hidden = true;
    if (offerSuccess) {
      offerSuccess.hidden = false;
      offerSuccess.setAttribute('tabindex', '-1');
      offerSuccess.focus();
    }
  });

  offerEmail?.addEventListener('input', () => {
    if (!offerMsg) return;
    offerMsg.textContent = '';
    offerEmail.removeAttribute('aria-invalid');
  });

  const offerCopy = $('#offer-copy');
  const offerCopied = $('#offer-copied');
  let copyResetTimer = null;

  const copyText = async (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw new Error('Copy command failed.');
  };

  offerCopy?.addEventListener('click', async () => {
    const code = ($('.offer__code')?.textContent || 'WELCOME10').trim();
    try {
      await copyText(code);
      if (offerCopied) offerCopied.textContent = 'Code copied to clipboard.';
      offerCopy.textContent = 'Copied';
      offerCopy.setAttribute('aria-label', `Discount code ${code} copied`);
    } catch (err) {
      if (offerCopied) offerCopied.textContent = `Copy didn't work. The code is ${code}.`;
      offerCopy.textContent = 'Try again';
    }
    window.clearTimeout(copyResetTimer);
    copyResetTimer = window.setTimeout(() => {
      offerCopy.textContent = 'Copy code';
      offerCopy.setAttribute('aria-label', 'Copy discount code WELCOME10');
      if (offerCopied) offerCopied.textContent = '';
    }, 2600);
  });

  /* ------------------------------------------------------------ Concierge */
  const concierge = $('#concierge');
  const conciergePanel = $('#concierge-panel');
  const conciergeToggle = $('#concierge-toggle');
  const conciergeClose = $('#concierge-close');
  const conciergeMessages = $('#concierge-messages');
  const conciergeChips = $('#concierge-chips');
  const conciergeForm = $('#concierge-form');
  const conciergeInput = $('#concierge-input');

  const scrollChat = () => {
    if (!conciergeMessages) return;
    conciergeMessages.scrollTop = conciergeMessages.scrollHeight;
  };

  const appendMessage = (text, who) => {
    if (!conciergeMessages) return null;
    const bubble = document.createElement('div');
    bubble.className = `message message--${who}`;
    const p = document.createElement('p');
    p.textContent = text;
    bubble.appendChild(p);
    conciergeMessages.appendChild(bubble);
    scrollChat();
    return bubble;
  };

  const getConciergeReply = (question) => {
    const q = question.toLowerCase();
    if (/(price|cost|much|pricing|rate)/.test(q)) {
      return 'Haircuts start at $55, skin fades at $50, hot-towel shaves at $45 and beard sculpts at $30. The Full Service — cut, shave and a drink — is $120. Every service includes a consultation, hot towel and a drink.';
    }
    if (/(where|location|address|directions|find you)/.test(q)) {
      return 'Two shops: Edgewater at 2100 Biscayne Blvd, and Coral Gables at 120 Giralda Ave. Directions and booking links are in the Locations section.';
    }
    if (/(hour|open|close|closing|today|tomorrow)/.test(q)) {
      return 'Edgewater: Mon–Fri 9am–8pm, Sat 9am–6pm, Sun 10am–4pm. Coral Gables: Tue–Fri 10am–7pm, Sat 9am–5pm, closed Sun–Mon.';
    }
    if (/(park|parking|garage)/.test(q)) {
      return 'There’s street parking around both shops and paid garages within a block. Edgewater is easiest on NE 21st Street.';
    }
    if (/(walk|squeeze|availability|appointment)/.test(q)) {
      return 'Walk-ins are welcome whenever a chair is free. Weekends fill up fast, so booking is the safer bet — tap “Book a chair” and pick a time.';
    }
    if (/(book|reserve|reservation)/.test(q)) {
      return 'Tap “Book a chair” anywhere on the page, choose a shop, service, barber and time. Takes about 30 seconds.';
    }
    if (/(shave|razor|beard)/.test(q)) {
      return 'Our hot-towel shave is a proper ritual: steam towels, a straight razor and a cooling balm finish, $45. Beard sculpting is $30.';
    }
    if (/(gift|card|voucher)/.test(q)) {
      return 'Gift cards are available at the desk or by phone in any amount. The Full Service is the popular one.';
    }
    return 'I’m a simple demo concierge, so I don’t know that one. Call the shop at (305) 555-0142 and a human will help.';
  };

  const askConcierge = (question) => {
    if (!question) return;
    appendMessage(question, 'user');
    if (conciergeChips) conciergeChips.hidden = true;
    if (conciergeInput) conciergeInput.value = '';

    const typing = appendMessage('···', 'bot');
    typing?.classList.add('message--typing');

    window.setTimeout(() => {
      typing?.remove();
      appendMessage(getConciergeReply(question), 'bot');
    }, 600);
  };

  const setConciergeOpen = (open) => {
    if (!conciergePanel || !conciergeToggle) return;
    const hadFocus = conciergePanel.contains(document.activeElement);
    conciergePanel.hidden = !open;
    conciergeToggle.setAttribute('aria-expanded', String(open));
    if (open) {
      scrollChat();
      window.setTimeout(() => {
        if (!conciergePanel.hidden) conciergeInput?.focus({ preventScroll: true });
      }, 200);
    } else if (hadFocus) {
      conciergeToggle.focus({ preventScroll: true });
    }
  };

  conciergeToggle?.addEventListener('click', () => {
    setConciergeOpen(conciergePanel.hidden);
  });
  conciergeClose?.addEventListener('click', () => setConciergeOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (conciergePanel && !conciergePanel.hidden) setConciergeOpen(false);
  });
  conciergeChips?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-question]');
    if (!button) return;
    askConcierge(button.dataset.question);
  });
  conciergeForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    askConcierge(conciergeInput.value.trim());
  });

  const syncConciergeVisibility = () => {
    if (!concierge) return;
    const open = conciergePanel && !conciergePanel.hidden;
    const ready = window.innerWidth > 720 || window.scrollY > window.innerHeight * 0.62 || open;
    concierge.classList.toggle('is-ready', ready);
  };
  window.addEventListener('scroll', syncConciergeVisibility, { passive: true });
  window.addEventListener('resize', syncConciergeVisibility);
  syncConciergeVisibility();

  /* ------------------------------------------------------- Location status */
  const updateLocationStatuses = () => {
    if (!locationCards.length) return;
    const now = miamiNow();
    const currentDay = now.day;
    const currentMinutes = now.minutes;

    locationCards.forEach((card) => {
      let schedule;
      try {
        schedule = JSON.parse(card.dataset.hours);
      } catch (err) {
        return;
      }
      if (!schedule) return;

      const status = $('.location__status', card);
      const statusText = status ? $('[data-status-text]', status) : null;
      if (!status || !statusText) return;

      const today = schedule[dayKeys[currentDay]];
      let label = '';
      let open = false;

      if (today && currentMinutes >= today[0] && currentMinutes < today[1]) {
        open = true;
        label = `Open now · until ${formatMinutes(today[1])}`;
      } else if (today && currentMinutes < today[0]) {
        label = `Closed · opens ${formatMinutes(today[0])}`;
      } else {
        for (let offset = 1; offset <= 7; offset += 1) {
          const nextDay = (currentDay + offset) % 7;
          const range = schedule[dayKeys[nextDay]];
          if (!range) continue;
          const dayText = offset === 1 ? 'tomorrow' : dayLabels[dayKeys[nextDay]];
          label = `Closed · opens ${dayText} ${formatMinutes(range[0])}`;
          break;
        }
      }

      if (!label) label = 'Closed · opens soon';
      status.classList.toggle('is-open', open);
      status.classList.toggle('is-closed', !open);
      statusText.textContent = label;
    });
  };

  updateLocationStatuses();
  window.setInterval(updateLocationStatuses, 60000);

  /* --------------------------------------------------------------- Parallax */
  const heroMedia = $('.hero__media');
  if (heroMedia && !reduceMotion.matches) {
    let parallaxQueued = false;
    const updateParallax = () => {
      parallaxQueued = false;
      if (window.innerWidth < 721) {
        heroMedia.style.transform = '';
        return;
      }
      const y = Math.min(window.scrollY, window.innerHeight);
      heroMedia.style.transform = `translate3d(0, ${(y * 0.18).toFixed(2)}px, 0)`;
    };
    window.addEventListener('scroll', () => {
      if (parallaxQueued) return;
      parallaxQueued = true;
      requestAnimationFrame(updateParallax);
    }, { passive: true });
    updateParallax();
  }

  /* ------------------------------------------------------------------ Year */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
