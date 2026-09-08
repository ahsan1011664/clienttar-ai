/* ==========================================================================
   CLIENTARA AI — MAIN INTERACTIVE LOGIC ENGINE
   ========================================================================== */

// Prevent browser from restoring scroll to bottom sections on load/reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

function initClientaraApp() {
  // Clean stale hash if pointing to bottom contact section
  if (
    window.location.hash === '#contact' ||
    window.location.hash === '#transformation-cta' ||
    window.location.hash === '#transformationBookBtn'
  ) {
    history.replaceState(null, document.title, window.location.pathname + window.location.search);
  }

  // ==========================================================================
  // 1. HEADER SCROLL & NAVIGATION
  // ==========================================================================
  try {
    const header = document.querySelector('.main-header');
    const handleScroll = () => {
      if (window.scrollY > 30) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    // Mobile Menu Toggle & Drawer
    const mobileToggles = document.querySelectorAll('.mobile-toggle');
    const navMenu = document.querySelector('.nav-links');
    const headerEl = document.querySelector('.main-header');

    if (mobileToggles.length > 0 && navMenu) {
      mobileToggles.forEach((toggle) => {
        toggle.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = navMenu.classList.contains('is-open');
          if (isOpen) {
            navMenu.classList.remove('is-open');
            toggle.classList.remove('is-active');
            toggle.setAttribute('aria-expanded', 'false');
          } else {
            navMenu.classList.add('is-open');
            toggle.classList.add('is-active');
            toggle.setAttribute('aria-expanded', 'true');
          }
        });
      });

      // Close mobile menu when clicking any nav link
      navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('is-open');
          mobileToggles.forEach((t) => {
            t.classList.remove('is-active');
            t.setAttribute('aria-expanded', 'false');
          });
        });
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('is-open') && !headerEl?.contains(e.target)) {
          navMenu.classList.remove('is-open');
          mobileToggles.forEach((t) => {
            t.classList.remove('is-active');
            t.setAttribute('aria-expanded', 'false');
          });
        }
      });

      // Close mobile menu on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          mobileToggles.forEach((t) => {
            t.classList.remove('is-active');
            t.setAttribute('aria-expanded', 'false');
          });
        }
      });
    }
  } catch (err) {
    console.error('Header init error:', err);
  }

  // ==========================================================================
  // 2. 3D INTERACTIVE MOUSE PARALLAX (HERO STAGE - DESKTOP ONLY)
  // ==========================================================================
  try {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (!isTouchDevice) {
      const heroSection = document.querySelector('.hero-section');
      const hologramStage = document.getElementById('hologramStage');

      if (heroSection && hologramStage) {
        heroSection.addEventListener('mousemove', (e) => {
          const rect = hologramStage.getBoundingClientRect();
          const stageCenterX = rect.left + rect.width / 2;
          const stageCenterY = rect.top + rect.height / 2;

          const deltaX = (e.clientX - stageCenterX) / (window.innerWidth / 2);
          const deltaY = (e.clientY - stageCenterY) / (window.innerHeight / 2);

          const rotateX = -deltaY * 12;
          const rotateY = deltaX * 14;

          hologramStage.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        });

        heroSection.addEventListener('mouseleave', () => {
          hologramStage.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
      }

      // 3D Parallax for About Page Hero Stage Card
      const aboutHeroSection = document.getElementById('aboutHeroSection');
      const aboutStageCard = document.getElementById('aboutStageCard');
      if (aboutHeroSection && aboutStageCard) {
        aboutHeroSection.addEventListener('mousemove', (e) => {
          const rect = aboutStageCard.getBoundingClientRect();
          const stageCenterX = rect.left + rect.width / 2;
          const stageCenterY = rect.top + rect.height / 2;

          const deltaX = (e.clientX - stageCenterX) / (window.innerWidth / 2);
          const deltaY = (e.clientY - stageCenterY) / (window.innerHeight / 2);

          const rotateX = -deltaY * 10;
          const rotateY = deltaX * 12;

          aboutStageCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        });

        aboutHeroSection.addEventListener('mouseleave', () => {
          aboutStageCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
      }
    }
  } catch (err) {
    console.error('Parallax init error:', err);
  }

  // ==========================================================================
  // 3. CONTINUOUS TRIGONOMETRIC CIRCULAR ORBIT (HERO STAGE)
  // ==========================================================================
  try {
    const pill0 = document.getElementById('orbitPill0');
    const pill1 = document.getElementById('orbitPill1');
    const pill2 = document.getElementById('orbitPill2');
    const pill3 = document.getElementById('orbitPill3');
    const pill4 = document.getElementById('orbitPill4');
    const pills = [pill0, pill1, pill2, pill3, pill4].filter(Boolean);

    if (pills.length > 0) {
      let globalAngle = 0;
      const numPills = pills.length;

      const getOrbitRadii = () => {
        const w = window.innerWidth;
        if (w <= 375) return { rx: 90, ry: 60 };
        if (w <= 480) return { rx: 105, ry: 72 };
        if (w <= 768) return { rx: 135, ry: 95 };
        if (w <= 1200) return { rx: 175, ry: 125 };
        return { rx: 200, ry: 145 };
      };

      let orbitRadii = getOrbitRadii();
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          orbitRadii = getOrbitRadii();
        }, 100);
      });

      let isOrbitPaused = false;
      const orbitContainer = document.getElementById('hologramStage') || document.getElementById('orbitSystem');
      if (orbitContainer) {
        orbitContainer.addEventListener('mouseenter', () => {
          isOrbitPaused = true;
        });
        orbitContainer.addEventListener('mouseleave', () => {
          isOrbitPaused = false;
        });
      }

      const animateOrbit = () => {
        if (!isOrbitPaused) {
          globalAngle += 0.0035;
        }

        for (let i = 0; i < numPills; i++) {
          const angle = globalAngle + i * ((2 * Math.PI) / numPills);
          const x = orbitRadii.rx * Math.cos(angle);
          const y = orbitRadii.ry * Math.sin(angle);
          const sinVal = Math.sin(angle);

          // 3D Depth perception
          const scale = 0.94 + 0.12 * ((sinVal + 1) / 2);
          const opacity = 0.85 + 0.15 * ((sinVal + 1) / 2);
          const zIndex = sinVal > 0 ? 30 : 20;

          pills[i].style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
          pills[i].style.zIndex = zIndex;
          pills[i].style.opacity = opacity.toFixed(3);
        }

        requestAnimationFrame(animateOrbit);
      };

      requestAnimationFrame(animateOrbit);
    }
  } catch (err) {
    console.error('Orbit init error:', err);
  }

  // ==========================================================================
  // 4. DYNAMIC ROI CALCULATOR
  // ==========================================================================
  try {
    const teamSlider = document.getElementById('teamSizeSlider');
    const hoursSlider = document.getElementById('hoursSlider');
    const rateSlider = document.getElementById('rateSlider');

    const teamDisplay = document.getElementById('teamSizeDisplay');
    const hoursDisplay = document.getElementById('hoursDisplay');
    const rateDisplay = document.getElementById('rateDisplay');

    const hoursSavedNum = document.getElementById('calcHoursSaved');
    const annualSavingsNum = document.getElementById('calcAnnualSavings');
    const roiMultipleNum = document.getElementById('calcRoiMultiple');

    const updateRoiCalculations = () => {
      if (!teamSlider || !hoursSlider || !rateSlider) return;

      const teamSize = parseInt(teamSlider.value, 10) || 5;
      const weeklyHours = parseInt(hoursSlider.value, 10) || 10;
      const hourlyRate = parseInt(rateSlider.value, 10) || 30;

      if (teamDisplay) teamDisplay.textContent = `${teamSize} ${teamSize === 1 ? 'person' : 'people'}`;
      if (hoursDisplay) hoursDisplay.textContent = `${weeklyHours} hrs/wk`;
      if (rateDisplay) rateDisplay.textContent = `$${hourlyRate} / hr`;

      // 75% automation efficiency over 4.33 weeks/month
      const monthlyHoursSaved = Math.round(teamSize * weeklyHours * 4.33 * 0.75);
      const annualSavings = Math.round(monthlyHoursSaved * hourlyRate * 12);

      const baseCost = 12000;
      const roiMultiple = (annualSavings / baseCost).toFixed(1);

      if (hoursSavedNum) hoursSavedNum.textContent = `${monthlyHoursSaved.toLocaleString()} hrs`;
      if (annualSavingsNum) annualSavingsNum.textContent = `$${annualSavings.toLocaleString()}`;
      if (roiMultipleNum) roiMultipleNum.textContent = `${roiMultiple}x ROI`;
    };

    if (teamSlider && hoursSlider && rateSlider) {
      teamSlider.addEventListener('input', updateRoiCalculations);
      teamSlider.addEventListener('change', updateRoiCalculations);
      hoursSlider.addEventListener('input', updateRoiCalculations);
      hoursSlider.addEventListener('change', updateRoiCalculations);
      rateSlider.addEventListener('input', updateRoiCalculations);
      rateSlider.addEventListener('change', updateRoiCalculations);
      updateRoiCalculations();
    }
  } catch (err) {
    console.error('ROI Calculator init error:', err);
  }

  // ==========================================================================
  // 6. INTERACTIVE FAQ ACCORDION
  // ==========================================================================
  try {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
      const btn = item.querySelector('.faq-question-btn');
      btn?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach((i) => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  } catch (err) {
    console.error('FAQ init error:', err);
  }

  // ==========================================================================
  // 7. 3D INDUSTRIES SHOWCASE ENGINE
  // ==========================================================================
  try {
    const industriesData = [
      {
        code: '01',
        name: 'E-Commerce & Retail',
        categoryTag: 'E-COMMERCE & RETAIL',
        headline: 'Built for high-velocity online commerce',
        desc: 'Automated cart recovery, 24/7 customer support, and real-time inventory sync.',
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon-display"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
        deliverables: [
          '24/7 customer support',
          'Abandoned cart recovery',
          'Inventory synchronization',
          'Product recommendations'
        ]
      },
      {
        code: '02',
        name: 'Real Estate',
        categoryTag: 'REAL ESTATE',
        headline: 'Built for instant buyer qualification & viewings',
        desc: 'Under-5-second lead screening, automated viewing bookings, and CRM property dispatch.',
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon-display"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`,
        deliverables: [
          'Instant buyer qualification',
          'Showing & viewing scheduler',
          'CRM property routing',
          'Lease agreement extraction'
        ]
      },
      {
        code: '03',
        name: 'Healthcare & Clinics',
        categoryTag: 'HEALTHCARE & CLINICS',
        headline: 'Built for frictionless patient intake & scheduling',
        desc: 'Automated patient registration, insurance verification, and EHR calendar sync.',
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon-display"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`,
        deliverables: [
          'Multilingual intake chatbots',
          'Insurance validation workflows',
          'Automated appointment booking',
          'EHR system synchronization'
        ]
      },
      {
        code: '04',
        name: 'SaaS & Startups',
        categoryTag: 'SAAS & STARTUPS',
        headline: 'Built for rapid user activation & churn prevention',
        desc: 'Self-serve onboarding flows, automated user telemetry, and high-intent sales alerts.',
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon-display"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
        deliverables: [
          'Self-serve onboarding flows',
          'High-intent demo lead scoring',
          'Automated churn alerts',
          'Customer usage telemetry'
        ]
      },
      {
        code: '05',
        name: 'Marketing Agencies',
        categoryTag: 'MARKETING AGENCIES',
        headline: 'Built to eliminate manual weekly reporting',
        desc: 'Automated multi-platform ad metrics ingestion, client report generation, and CRM sync.',
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon-display"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>`,
        deliverables: [
          'Automated client weekly reports',
          'Cross-platform ad data sync',
          'Multi-client CRM lead routing',
          'Content approval pipelines'
        ]
      },
      {
        code: '06',
        name: 'Finance & FinTech',
        categoryTag: 'FINANCE & FINTECH',
        headline: 'Built for how modern finance actually runs',
        desc: 'Optical invoice parsing, automated ledger reconciliation, and secure digital workflows.',
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon-display"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`,
        deliverables: [
          '99.9% accurate invoice extraction',
          'ERP & QuickBooks reconciliation',
          'Real-time cashflow alerts',
          'Automated client KYC checks'
        ]
      },
      {
        code: '07',
        name: 'Legal Services',
        categoryTag: 'LEGAL SERVICES',
        headline: 'Built for rapid case intake & document synthesis',
        desc: 'Automated client discovery questionnaires, instant document synthesis, and calendar conflict checks.',
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon-display"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,
        deliverables: [
          'Client intake questionnaires',
          'AI document & contract synthesis',
          'Calendar conflict checks',
          'Matter & case CRM routing'
        ]
      },
      {
        code: '08',
        name: 'Recruitment & HR',
        categoryTag: 'RECRUITMENT & HR',
        headline: 'Built for high-speed candidate pipelines',
        desc: 'Autonomous resume screening against role criteria, interview scheduling bots, and employee onboarding.',
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon-display"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        deliverables: [
          'AI resume screening & scoring',
          'Self-service interview booking',
          'Employee onboarding workflows',
          'HR document e-sign automation'
        ]
      },
      {
        code: '09',
        name: 'Consulting Firms',
        categoryTag: 'CONSULTING FIRMS',
        headline: 'Built to accelerate proposal generation & deliverables',
        desc: 'Company knowledge-base RAG intelligence, automated RFP draft generation, and project billing sync.',
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon-display"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
        deliverables: [
          'Knowledge-base RAG search',
          'Automated proposal drafting',
          'Project milestones & billing sync',
          'Client collaboration portals'
        ]
      },
      {
        code: '10',
        name: 'Education & EdTech',
        categoryTag: 'EDUCATION & EDTECH',
        headline: 'Built for 24/7 student support & enrollment',
        desc: 'Intelligent admissions qualification assistants, 24/7 academic tutoring chatbots, and student course onboarding.',
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon-display"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`,
        deliverables: [
          '24/7 student academic tutoring',
          'Admissions lead qualification',
          'Course enrollment sequences',
          'Student retention tracking'
        ]
      }
    ];

    let currentIndustryIdx = 0;
    const industryTabBtns = document.querySelectorAll('.industry-tab-btn');
    const floatingIndustryIcon = document.getElementById('floatingIndustryIcon');
    const indCategoryTag = document.getElementById('indCategoryTag');
    const indHeadline = document.getElementById('indHeadline');
    const indDescription = document.getElementById('indDescription');
    const indDeliverablesGrid = document.getElementById('indDeliverablesGrid');
    const industry3dStage = document.getElementById('industry3dStage');

    const selectIndustry = (idx) => {
      const total = industriesData.length;
      currentIndustryIdx = ((idx % total) + total) % total;
      const data = industriesData[currentIndustryIdx];
      if (!data) return;

      industryTabBtns.forEach((btn, i) => {
        const btnId = parseInt(btn.getAttribute('data-industry-id') || `${i}`, 10);
        if (btnId === currentIndustryIdx) {
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          if (window.innerWidth <= 768) {
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        }
      });

      if (floatingIndustryIcon) {
        floatingIndustryIcon.style.opacity = '0.3';
        floatingIndustryIcon.style.transform = 'scale(0.85)';
      }

      setTimeout(() => {
        if (floatingIndustryIcon) {
          floatingIndustryIcon.innerHTML = data.iconSvg;
          floatingIndustryIcon.style.opacity = '1';
          floatingIndustryIcon.style.transform = 'scale(1)';
        }

        if (indCategoryTag) indCategoryTag.textContent = data.categoryTag;
        if (indHeadline) indHeadline.textContent = data.headline;
        if (indDescription) indDescription.textContent = data.desc;

        if (indDeliverablesGrid) {
          indDeliverablesGrid.innerHTML = data.deliverables
            .map(
              (deliv) => `
            <div class="ind-deliverable-item">
              <span class="deliv-check">✓</span>
              <span>${deliv}</span>
            </div>
          `
            )
            .join('');
        }
      }, 120);
    };

    if (industryTabBtns.length > 0) {
      industryTabBtns.forEach((btn, i) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const attrId = btn.getAttribute('data-industry-id');
          const idx = attrId !== null ? parseInt(attrId, 10) : i;
          selectIndustry(idx);
        });
      });
    }

    // 3D Parallax Tilt on Industry Display (Desktop only)
    if (industry3dStage && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      industry3dStage.addEventListener('mousemove', (e) => {
        const rect = industry3dStage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -9;
        const rotateY = ((x - centerX) / centerX) * 9;

        industry3dStage.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.01)`;
      });

      industry3dStage.addEventListener('mouseleave', () => {
        industry3dStage.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
      });
    }
  } catch (err) {
    console.error('Industries init error:', err);
  }

  // ==========================================================================
  // 8. SERVICES PAGE FILTER TABS & 3D PARALLAX STAGE
  // ==========================================================================
  try {
    const serviceFilterBtns = document.querySelectorAll('.service-filter-btn');
    const servicePillarCards = document.querySelectorAll('.service-pillar-card');

    serviceFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        serviceFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter');

        servicePillarCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          if (filterVal === 'all' || cardCat === filterVal) {
            card.style.display = 'block';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });

        if (filterVal !== 'all') {
          const targetCard = document.querySelector(`.service-pillar-card[data-category="${filterVal}"]`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    });

    const services3dStage = document.getElementById('services3dStage');
    if (services3dStage) {
      window.addEventListener('mousemove', (e) => {
        const rect = services3dStage.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = ((e.clientY - centerY) / window.innerHeight) * -16;
        const rotateY = ((e.clientX - centerX) / window.innerWidth) * 16;

        services3dStage.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      });
    }
  } catch (err) {
    console.error('Services Filter init error:', err);
  }

  // ==========================================================================
  // 9. 3D HOLOGRAPHIC TECH COMMAND HUB INTERACTION
  // ==========================================================================
  try {
    const techLayerCards = document.querySelectorAll('.tech-layer-card');
    const hudLayerViews = document.querySelectorAll('.hud-layer-view');
    const hudActiveTag = document.getElementById('hudActiveTag');
    const orbitCoreSphere = document.getElementById('orbitCoreSphere');
    const techHudTerminal = document.getElementById('techHudTerminal');

    const layerThemes = {
      ai: {
        tag: 'INSPECTING // LAYER_01: AI_INTELLIGENCE',
        color: 'radial-gradient(circle at 35% 35%, #c084fc 0%, #7e22ce 70%, #020b22 100%)',
        shadow: '0 0 25px rgba(168, 85, 247, 0.75)',
        icon: '✦'
      },
      automation: {
        tag: 'INSPECTING // LAYER_02: WORKFLOW_AUTOMATION',
        color: 'radial-gradient(circle at 35% 35%, #fbbf24 0%, #d97706 70%, #020b22 100%)',
        shadow: '0 0 25px rgba(245, 158, 11, 0.75)',
        icon: '⚙'
      },
      frontend: {
        tag: 'INSPECTING // LAYER_03: FRONTEND_ARCHITECTURE',
        color: 'radial-gradient(circle at 35% 35%, #38bdf8 0%, #0284c7 70%, #020b22 100%)',
        shadow: '0 0 25px rgba(0, 212, 255, 0.75)',
        icon: '▲'
      },
      backend: {
        tag: 'INSPECTING // LAYER_04: DISTRIBUTED_BACKEND_DB',
        color: 'radial-gradient(circle at 35% 35%, #34d399 0%, #059669 70%, #020b22 100%)',
        shadow: '0 0 25px rgba(16, 185, 129, 0.75)',
        icon: '●'
      },
      cloud: {
        tag: 'INSPECTING // LAYER_05: CLOUD_DEVOPS_CONTAINERS',
        color: 'radial-gradient(circle at 35% 35%, #60a5fa 0%, #2563eb 70%, #020b22 100%)',
        shadow: '0 0 25px rgba(59, 130, 246, 0.75)',
        icon: '☁'
      },
      integrations: {
        tag: 'INSPECTING // LAYER_06: APIS_PAYMENTS_TELECOM',
        color: 'radial-gradient(circle at 35% 35%, #2dd4bf 0%, #0d9488 70%, #020b22 100%)',
        shadow: '0 0 25px rgba(20, 184, 166, 0.75)',
        icon: '◈'
      }
    };

    const activateLayer = (layerKey) => {
      if (!layerKey || !layerThemes[layerKey]) return;

      techLayerCards.forEach((c) => {
        if (c.getAttribute('data-layer') === layerKey) {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });

      hudLayerViews.forEach((view) => {
        if (view.id === `view-${layerKey}`) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });

      if (hudActiveTag) {
        hudActiveTag.textContent = layerThemes[layerKey].tag;
      }

      if (orbitCoreSphere) {
        orbitCoreSphere.style.background = layerThemes[layerKey].color;
        orbitCoreSphere.style.boxShadow = layerThemes[layerKey].shadow;
        const sphereIcon = orbitCoreSphere.querySelector('.sphere-icon');
        if (sphereIcon) {
          sphereIcon.textContent = layerThemes[layerKey].icon;
        }
      }
    };

    techLayerCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        activateLayer(card.getAttribute('data-layer'));
      });
      card.addEventListener('click', () => {
        activateLayer(card.getAttribute('data-layer'));
      });
    });

    if (techHudTerminal) {
      techHudTerminal.addEventListener('mousemove', (e) => {
        const rect = techHudTerminal.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        techHudTerminal.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      });

      techHudTerminal.addEventListener('mouseleave', () => {
        techHudTerminal.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      });
    }
  } catch (err) {
    console.error('Tech Hub init error:', err);
  }

  // ==========================================================================
  // 10. 3D HOLOGRAPHIC PERFORMANCE BENCHMARK COCKPIT
  // ==========================================================================
  try {
    const benchmarkData = [
      {
        legacyVal: '2 to 8 Hours Average Delay',
        legacyDesc:
          'Inbound leads wait in queue for human agent availability during evenings and weekends, causing 40%+ drop-offs.',
        legacyGauge: '25%',
        legacyGaugeText: '25% (Manual Delay)',
        legacyTrait1: 'High drop-off rate during peak & off-hours',
        legacyTrait2: 'Heavy staff burnout and repetitive ticket fatigue',
        deltaText: '+310% Faster Conversion',
        aiVal: 'Under 45 Seconds (24/7/365)',
        aiDesc:
          'Instant neural voice triage answers every lead on the first ring, qualifies pre-approvals, and locks calendar tours automatically.',
        aiGauge: '98%',
        aiGaugeText: '99.8% Precision',
        aiTrait1: 'Zero-delay instant engagement across 100% of volume',
        aiTrait2: 'Zero headcount scaling needed for 10x lead spikes'
      },
      {
        legacyVal: 'Manual Entry Across 4+ Tools',
        legacyDesc:
          'Copy-pasting statements, forms, and IDs into CRMs creates human fatigue and transcription error risks.',
        legacyGauge: '30%',
        legacyGaugeText: '30% (Error Prone)',
        legacyTrait1: 'Frequent typos in compliance and financial fields',
        legacyTrait2: 'Hours wasted on repetitive paperwork formatting',
        deltaText: '99.8% Neural Precision',
        aiVal: 'Sub-Second Neural OCR Parsing',
        aiDesc:
          'Direct document extraction pipeline reads PDFs, images, and tables with automated validation and instant webhook dispatch.',
        aiGauge: '99%',
        aiGaugeText: '99.8% Automated Accuracy',
        aiTrait1: 'Instant parsing across structured & unstructured docs',
        aiTrait2: 'Direct synchronization with database & CRM schemas'
      },
      {
        legacyVal: 'Queue Backlogs During Nights & Weekends',
        legacyDesc:
          'Customer support tickets pile up during non-business hours, leading to frustrated buyers and delayed issue resolution.',
        legacyGauge: '35%',
        legacyGaugeText: '35% (Queue Stagnation)',
        legacyTrait1: 'Slow weekend responses frustrating urgent requests',
        legacyTrait2: 'Agents overwhelmed by repetitive Tier-1 questions',
        deltaText: '82% Auto-Resolved',
        aiVal: 'Sub-2s Conversational Resolution',
        aiDesc:
          '24/7 smart assistant across WhatsApp and web chat answers orders, sizing, and policies with zero queue delay.',
        aiGauge: '94%',
        aiGaugeText: '82% First-Contact Resolution',
        aiTrait1: 'Multi-channel instant replies with zero human waiting',
        aiTrait2: 'Smooth human escalation only when complex edge cases occur'
      },
      {
        legacyVal: '10 to 14 Business Days of Paperwork',
        legacyDesc:
          'Back-and-forth email chains for identity verification, forms, and contracts stall new client momentum.',
        legacyGauge: '20%',
        legacyGaugeText: '20% (Chokepoint)',
        legacyTrait1: 'Lengthy onboarding cycle causing client friction',
        legacyTrait2: 'Manual compliance audits slowing deal execution',
        deltaText: '85% Cycle Reduction',
        aiVal: 'Automated in Under 24 Hours',
        aiDesc:
          'Digital intake, automated KYC background scoring, and instant e-signature retainers provision accounts immediately.',
        aiGauge: '96%',
        aiGaugeText: '85% Faster Activation',
        aiTrait1: 'One-click paperless intake and digital signature flow',
        aiTrait2: 'Automated instant compliance check and portal setup'
      },
      {
        legacyVal: 'Linear Payroll Cost Growth',
        legacyDesc:
          'Scaling operations requires constantly recruiting, onboarding, and paying salaries for additional manual support staff.',
        legacyGauge: '25%',
        legacyGaugeText: 'Linear Overhead Growth',
        legacyTrait1: 'Escalating payroll overhead with every new client',
        legacyTrait2: 'High recruitment churn and onboarding lag',
        deltaText: '60–80% Overhead Savings',
        aiVal: 'Fixed Modular Investment',
        aiDesc:
          'Deploy autonomous software once and handle 10x transaction volume spikes with zero incremental hiring.',
        aiGauge: '97%',
        aiGaugeText: '60–80% Lower Overhead',
        aiTrait1: 'Infinite throughput scalability with zero salary bloat',
        aiTrait2: 'Predictable operational costs and compounded ROI'
      }
    ];

    const bmTabBtns = document.querySelectorAll('.bm-tab-btn');
    const bmLegacyVal = document.getElementById('bmLegacyVal');
    const bmLegacyDesc = document.getElementById('bmLegacyDesc');
    const bmLegacyGauge = document.getElementById('bmLegacyGauge');
    const bmLegacyGaugeText = document.getElementById('bmLegacyGaugeText');
    const bmLegacyTrait1 = document.getElementById('bmLegacyTrait1');
    const bmLegacyTrait2 = document.getElementById('bmLegacyTrait2');
    const bmDeltaText = document.getElementById('bmDeltaText');
    const bmAiVal = document.getElementById('bmAiVal');
    const bmAiDesc = document.getElementById('bmAiDesc');
    const bmAiGauge = document.getElementById('bmAiGauge');
    const bmAiGaugeText = document.getElementById('bmAiGaugeText');
    const bmAiTrait1 = document.getElementById('bmAiTrait1');
    const bmAiTrait2 = document.getElementById('bmAiTrait2');

    if (bmTabBtns.length > 0 && bmLegacyVal) {
      bmTabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          bmTabBtns.forEach((b) => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');

          const index = parseInt(btn.getAttribute('data-bm-index'), 10) || 0;
          const d = benchmarkData[index];

          if (d) {
            bmLegacyVal.style.opacity = '0';
            bmAiVal.style.opacity = '0';

            setTimeout(() => {
              bmLegacyVal.textContent = d.legacyVal;
              bmLegacyDesc.textContent = d.legacyDesc;
              bmLegacyGauge.style.width = d.legacyGauge;
              bmLegacyGaugeText.textContent = d.legacyGaugeText;
              bmLegacyTrait1.textContent = d.legacyTrait1;
              bmLegacyTrait2.textContent = d.legacyTrait2;

              bmDeltaText.textContent = d.deltaText;

              bmAiVal.textContent = d.aiVal;
              bmAiDesc.textContent = d.aiDesc;
              bmAiGauge.style.width = d.aiGauge;
              bmAiGaugeText.textContent = d.aiGaugeText;
              bmAiTrait1.textContent = d.aiTrait1;
              bmAiTrait2.textContent = d.aiTrait2;

              bmLegacyVal.style.opacity = '1';
              bmAiVal.style.opacity = '1';
            }, 150);
          }
        });
      });
    }
  } catch (err) {
    console.error('Benchmark init error:', err);
  }

  // ==========================================================================
  // 11. CLEAN SIMPLE CONTACT FORM SUBMISSION
  // ==========================================================================
  try {
    const simpleContactForm = document.getElementById('simpleContactForm');
    const cleanSuccessBox = document.getElementById('cleanSuccessBox');
    const cleanResetBtn = document.getElementById('cleanResetBtn');

    if (simpleContactForm && cleanSuccessBox) {
      simpleContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        simpleContactForm.style.display = 'none';
        cleanSuccessBox.style.display = 'flex';
      });

      if (cleanResetBtn) {
        cleanResetBtn.addEventListener('click', () => {
          simpleContactForm.reset();
          cleanSuccessBox.style.display = 'none';
          simpleContactForm.style.display = 'flex';
        });
      }
    }
  } catch (err) {
    console.error('Contact Form init error:', err);
  }

  // ==========================================================================
  // 12. CINEMATIC 3D STARTUP SPLASH SCREEN (SHOW ONLY ONCE PER SESSION)
  // ==========================================================================
  try {
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
      const hasShownSplash = sessionStorage.getItem('clientara_splash_shown');
      if (hasShownSplash) {
        splashScreen.style.display = 'none';
        document.body.style.overflow = '';
      } else {
        sessionStorage.setItem('clientara_splash_shown', 'true');
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
          splashScreen.classList.add('splash-hidden');
          document.body.style.overflow = '';

          setTimeout(() => {
            splashScreen.style.display = 'none';
          }, 750);
        }, 2800);
      }
    }
  } catch (err) {
    console.error('Splash Screen init error:', err);
  }

  // ==========================================================================
  // 13. SHOWCASE VIDEO CONTROLLER (PLAY ONCE, CLICK TO REPLAY, SCROLL AUTO-PAUSE)
  // ==========================================================================
  try {
    const realTeamVideo = document.getElementById('realTeamVideo');
    const videoWrapper = document.getElementById('videoWrapper');
    const videoPlayPauseBtn = document.getElementById('videoPlayPauseBtn');
    const videoMuteBtn = document.getElementById('videoMuteBtn');
    const iconPause = document.getElementById('iconPause');
    const iconPlay = document.getElementById('iconPlay');
    const iconMuted = document.getElementById('iconMuted');
    const iconUnmuted = document.getElementById('iconUnmuted');

    if (realTeamVideo) {
      // Helper: sync UI states
      const syncPlayState = (isPlaying) => {
        if (iconPause && iconPlay) {
          iconPause.style.display = isPlaying ? 'block' : 'none';
          iconPlay.style.display = isPlaying ? 'none' : 'block';
        }
        if (videoWrapper) {
          if (isPlaying) {
            videoWrapper.classList.remove('is-paused');
          } else {
            videoWrapper.classList.add('is-paused');
          }
        }
      };

      // Toggle Play / Pause / Replay
      const toggleVideo = () => {
        if (realTeamVideo.paused || realTeamVideo.ended) {
          if (realTeamVideo.ended) {
            realTeamVideo.currentTime = 0;
          }
          realTeamVideo.play().catch(() => {});
        } else {
          realTeamVideo.pause();
        }
      };

      // Event Listeners for Video State
      realTeamVideo.addEventListener('play', () => syncPlayState(true));
      realTeamVideo.addEventListener('pause', () => syncPlayState(false));
      realTeamVideo.addEventListener('ended', () => {
        syncPlayState(false);
      });

      // Click on Video / Wrapper to Toggle/Replay
      if (videoWrapper) {
        videoWrapper.addEventListener('click', (e) => {
          // If clicked directly on mute button, don't toggle play
          if (videoMuteBtn && (videoMuteBtn === e.target || videoMuteBtn.contains(e.target))) {
            return;
          }
          toggleVideo();
        });
      } else {
        realTeamVideo.addEventListener('click', () => toggleVideo());
      }

      // Play/Pause button click
      if (videoPlayPauseBtn) {
        videoPlayPauseBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleVideo();
        });
      }

      // Mute/Unmute button click
      if (videoMuteBtn) {
        videoMuteBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          realTeamVideo.muted = !realTeamVideo.muted;
          if (iconMuted && iconUnmuted) {
            iconMuted.style.display = realTeamVideo.muted ? 'block' : 'none';
            iconUnmuted.style.display = realTeamVideo.muted ? 'none' : 'block';
          }
        });
      }

      // Auto-Pause when user scrolls down / away
      if ('IntersectionObserver' in window) {
        const scrollObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            // When less than 20% visible or out of view, automatically pause
            if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
              if (!realTeamVideo.paused) {
                realTeamVideo.pause();
              }
            }
          });
        }, {
          threshold: [0, 0.2, 0.5]
        });
        scrollObserver.observe(realTeamVideo);
      } else {
        window.addEventListener('scroll', () => {
          const rect = realTeamVideo.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          if (!isVisible && !realTeamVideo.paused) {
            realTeamVideo.pause();
          }
        }, { passive: true });
      }

      // Initial state sync
      syncPlayState(!realTeamVideo.paused);
    }
  } catch (err) {
    console.error('Video controller init error:', err);
  }

  console.log('⚡ Clientara AI — Platform Initialized.');
}

// Immediate + DOM Ready Execution Check
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initClientaraApp);
} else {
  initClientaraApp();
}
