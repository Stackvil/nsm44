import './styles.css';
import { DB } from './db';
import type { PageKey } from './types';

// Type guard to check if a string is a valid PageKey
function isValidPageKey(key: string | undefined): key is PageKey {
  const validKeys: PageKey[] = [
    'about',
    'connect',
    'gallery',
    'alumni-day',
    'events',
    'reunion',
    'faq',
    'contact',
    'member',
    'home',
  ];
  return key !== undefined && validKeys.includes(key as PageKey);
}

// Initialize the application
function initApp(): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(
    '.nav-item > a[data-page]',
  );
  const heroTitle = document.getElementById('hero-title') as HTMLHeadingElement | null;
  const sidebarLinks = document.querySelectorAll<HTMLAnchorElement>('.sidebar-link');

  const pageSections: Record<PageKey, HTMLElement | null> = {
    home: document.getElementById('page-home'),
    about: document.getElementById('page-about'),
    connect: document.getElementById('page-connect'),
    gallery: document.getElementById('page-gallery'),
    'alumni-day': document.getElementById('page-alumni-day'),
    events: document.getElementById('page-events'),
    reunion: document.getElementById('page-reunion'),
    faq: document.getElementById('page-faq'),
    contact: document.getElementById('page-contact'),
    member: document.getElementById('page-member'),
  };

  const heroTitles: Record<PageKey, string> = {
    about: 'ABOUT NSMOSA',
    connect: 'NSMOSA ALUMNI CONNECT',
    gallery: 'PHOTO GALLERY',
    'alumni-day': 'NSMOSA ALUMNI DAY',
    events: 'NSMOSA ALUMNI EVENTS',
    reunion: 'RE-UNION',
    faq: "FAQ'S",
    contact: 'CONTACT US',
    member: 'BECOME A MEMBER',
    home: 'NSMOSA',
  };

  function setActivePage(pageKey: PageKey, category?: string): void {
    // Update navigation links
    navLinks.forEach((link) => {
      const parent = link.closest<HTMLElement>('.nav-item');
      if (!parent) return;
      if (link.dataset.page === pageKey) {
        parent.classList.add('active');
      } else {
        parent.classList.remove('active');
      }
    });

    // Update sidebar links
    sidebarLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.textContent?.trim() === 'About NSMOSA' && pageKey === 'about') {
        link.classList.add('active');
      }
    });

    // Update hero title
    if (heroTitle && heroTitles[pageKey]) {
      heroTitle.textContent = heroTitles[pageKey];
    }

    // Show/hide page sections
    (Object.entries(pageSections) as [PageKey, HTMLElement | null][]).forEach(
      ([key, el]) => {
        if (!el) return;
        el.classList.toggle('visible', key === pageKey);
      },
    );

    // Initialize sliders when home page is shown
    if (pageKey === 'home') {
      setTimeout(() => {
        initImageSliders();
      }, 100);
    }

    // Initialize member page when shown
    if (pageKey === 'member') {
      // Member page is already initialized, but we can add any specific initialization here if needed
    }

    // If navigating to FAQ with a category, filter to that category
    if (pageKey === 'faq' && category) {
      setTimeout(() => {
        const categoryBtn = document.querySelector<HTMLButtonElement>(`.faq-category-btn[data-category="${category}"]`);
        if (categoryBtn) {
          // Remove active from all category buttons
          document.querySelectorAll<HTMLButtonElement>('.faq-category-btn').forEach((btn) => {
            btn.classList.remove('active');
          });
          // Add active to the target category
          categoryBtn.classList.add('active');
          // Trigger click to filter
          categoryBtn.click();
          // Scroll to FAQ section after a short delay
          setTimeout(() => {
            const faqSection = document.getElementById('page-faq');
            if (faqSection) {
              faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 300);
        }
      }, 100);
    }
  }

  // Handle navigation link clicks
  navLinks.forEach((link) => {
    link.addEventListener('click', (e: MouseEvent) => {

      const navItem = link.closest<HTMLElement>('.nav-item');
      const hasDropdown = navItem?.classList.contains('has-dropdown');

      // If it has a dropdown, toggle it instead of navigating
      // If it has a dropdown, we rely on CSS hover, but prevent default click behavior for the parent link
      if (hasDropdown) {
        e.preventDefault();
        // Hover is handled by CSS, so we don't toggle classes here
        return;
      }

      // For non-dropdown items, navigate normally

      e.preventDefault();
      const pageKey = link.dataset.page;
      if (isValidPageKey(pageKey)) {
        setActivePage(pageKey);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Handle sidebar link clicks
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      // Map sidebar links to page keys
      const linkText = link.textContent?.trim();
      let targetPage: PageKey | null = null;

      if (linkText === 'About NSMOSA') targetPage = 'about';
      // Add more mappings as needed

      if (targetPage) {
        setActivePage(targetPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Handle dropdown subpage links
  const dropdownLinks = document.querySelectorAll<HTMLAnchorElement>(
    '.dropdown-item[data-subpage]',
  );
  dropdownLinks.forEach((link) => {
    link.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      const parentNav = link.closest<HTMLElement>('.nav-item');
      if (parentNav) {
        const mainLink = parentNav.querySelector<HTMLAnchorElement>('a[data-page]');
        if (mainLink) {
          const pageKey = mainLink.dataset.page;
          if (isValidPageKey(pageKey)) {
            setActivePage(pageKey);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Handle gallery subpages - activate the correct tab
            const subpage = link.dataset.subpage;
            if (pageKey === 'gallery' && subpage) {
              setTimeout(() => {
                // Map subpage to gallery type
                let galleryType = '';
                if (subpage === 'photo-gallery') galleryType = 'photo';
                else if (subpage === 'video-gallery') galleryType = 'video';
                else if (subpage === 'chapter-gallery') galleryType = 'chapter';
                else if (subpage === 'nostalgia-gallery') galleryType = 'nostalgia';
                else if (subpage === 'shop-gallery') galleryType = 'shop';

                if (galleryType) {
                  const galleryTabs = document.querySelectorAll<HTMLButtonElement>('.gallery-tab');
                  const gallerySections = document.querySelectorAll<HTMLElement>('.gallery-section');

                  // Update active tab
                  galleryTabs.forEach((tab) => {
                    if (tab.dataset.galleryType === galleryType) {
                      tab.classList.add('active');
                    } else {
                      tab.classList.remove('active');
                    }
                  });

                  // Update active section
                  gallerySections.forEach((section) => section.classList.remove('active'));
                  const targetSection = document.getElementById(`${galleryType}-gallery-section`);
                  if (targetSection) {
                    targetSection.classList.add('active');

                    // If video gallery, populate videos
                    if (galleryType === 'video') {
                      setTimeout(() => {
                        populateVideoGallery();
                      }, 100);
                    }
                  }
                }
              }, 100);
            }

            // Handle reunion subpages - activate the correct tab
            if (pageKey === 'reunion' && subpage) {
              setTimeout(() => {
                let reunionType = '';
                if (subpage === 'about-reunion') reunionType = 'about';
                else if (subpage === 'reunion-gallery') reunionType = 'gallery';

                if (reunionType) {
                  const reunionTabs = document.querySelectorAll<HTMLButtonElement>('.gallery-tab[data-reunion-type]');
                  const reunionSections = document.querySelectorAll<HTMLElement>('.reunion-section');

                  // Update active tab
                  reunionTabs.forEach((tab) => {
                    if (tab.dataset.reunionType === reunionType) {
                      tab.classList.add('active');
                    } else {
                      tab.classList.remove('active');
                    }
                  });

                  // Update active section
                  reunionSections.forEach((section) => section.classList.remove('active'));
                  let targetSectionId = '';
                  if (reunionType === 'about') {
                    targetSectionId = 'about-reunion-section';
                  } else if (reunionType === 'gallery') {
                    targetSectionId = 'reunion-gallery-section';
                  }
                  const targetSection = document.getElementById(targetSectionId);
                  if (targetSection) {
                    targetSection.classList.add('active');
                  }
                }
              }, 100);
            }
          }
        }
      }
    });
  });

  // Handle connect dropdown subpage links (separate handler for data-connect-subpage)
  const connectDropdownLinks = document.querySelectorAll<HTMLAnchorElement>(
    '.dropdown-item[data-connect-subpage]',
  );
  connectDropdownLinks.forEach((link) => {
    link.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      const parentNav = link.closest<HTMLElement>('.nav-item');
      if (parentNav) {
        const mainLink = parentNav.querySelector<HTMLAnchorElement>('a[data-page]');
        if (mainLink) {
          const pageKey = mainLink.dataset.page;
          if (isValidPageKey(pageKey)) {
            setActivePage(pageKey);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Handle connect subpages - activate the correct tab
            const connectSubpage = link.dataset.connectSubpage;
            if (pageKey === 'connect' && connectSubpage) {
              // Helper function to check if user is a member
              function isUserMember(): boolean {
                const memberships = JSON.parse(localStorage.getItem('nsm_memberships') || '[]');
                return memberships.length > 0;
              }

              // Helper function to navigate to member page
              function navigateToMemberPage(): void {
                const memberNavLink = document.querySelector<HTMLAnchorElement>('a[data-page="member"]');
                if (memberNavLink) {
                  memberNavLink.click();
                } else {
                  // Fallback: navigate directly to member page
                  const memberPage = document.getElementById('page-member');
                  if (memberPage) {
                    const pageSections = document.querySelectorAll('.page-section');
                    pageSections.forEach((section) => section.classList.remove('visible'));
                    memberPage.classList.add('visible');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
              }

              // Check membership for restricted sections
              const memberOnlySections = ['alumni-event', 'alumni-directory', 'business-directory'];
              if (memberOnlySections.includes(connectSubpage)) {
                if (!isUserMember()) {
                  // User is not a member - navigate to member page
                  navigateToMemberPage();
                  return; // Don't show the section
                }
              }

              setTimeout(() => {
                const connectTabs = document.querySelectorAll<HTMLButtonElement>('.gallery-tab[data-connect-type]');
                const connectSections = document.querySelectorAll<HTMLElement>('.connect-section');

                // Map subpage to connect type
                let connectType = connectSubpage;

                // Update active tab
                connectTabs.forEach((tab) => {
                  if (tab.dataset.connectType === connectType) {
                    tab.classList.add('active');
                  } else {
                    tab.classList.remove('active');
                  }
                });

                // Update active section
                connectSections.forEach((section) => section.classList.remove('active'));
                const targetSectionId = `${connectType}-connect-section`;
                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) {
                  targetSection.classList.add('active');
                }
              }, 100);
            }
          }
        }
      }
    });
  });

  // Handle footer quick links navigation
  const footerLinks = document.querySelectorAll<HTMLAnchorElement>(
    '.footer-links-modern a[data-page]',
  );
  footerLinks.forEach((link) => {
    link.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      const pageKey = link.dataset.page;
      const subpage = link.dataset.subpage;
      const connectSubpage = link.dataset.connectSubpage;

      if (isValidPageKey(pageKey)) {
        setActivePage(pageKey);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Handle gallery subpages (Photo Gallery, Video Gallery)
        if (pageKey === 'gallery' && subpage) {
          setTimeout(() => {
            // Map subpage to gallery type
            let galleryType = '';
            if (subpage === 'photo-gallery') galleryType = 'photo';
            else if (subpage === 'video-gallery') galleryType = 'video';
            else if (subpage === 'chapter-gallery') galleryType = 'chapter';

            if (galleryType) {
              const galleryTabs = document.querySelectorAll<HTMLButtonElement>(
                '.gallery-tab',
              );
              const gallerySections =
                document.querySelectorAll<HTMLElement>('.gallery-section');

              // Update active tab
              galleryTabs.forEach((tab) => {
                if (tab.dataset.galleryType === galleryType) {
                  tab.classList.add('active');
                } else {
                  tab.classList.remove('active');
                }
              });

              // Update active section
              gallerySections.forEach((section) =>
                section.classList.remove('active'),
              );
              const targetSection = document.getElementById(
                `${galleryType}-gallery-section`,
              );
              if (targetSection) {
                targetSection.classList.add('active');

                // If video gallery is activated, populate videos
                if (galleryType === 'video') {
                  setTimeout(() => {
                    populateVideoGallery();
                  }, 100);
                }
              }
            }
          }, 100);
        }

        // Handle about subsections (Alumni Chapter)
        if (pageKey === 'about') {
          const aboutSubsection = link.dataset.aboutSubsection;
          if (aboutSubsection) {
            setTimeout(() => {
              // Call the showAboutSubsection function if it exists
              const showAboutSubsectionFunc = (window as any).showAboutSubsection;
              if (typeof showAboutSubsectionFunc === 'function') {
                showAboutSubsectionFunc(aboutSubsection);
              } else {
                // Fallback: manually show the subsection
                const allSubsections = document.querySelectorAll('.about-subsection');
                allSubsections.forEach((section) => section.classList.remove('active'));
                const targetSection = document.getElementById(aboutSubsection);
                if (targetSection) {
                  targetSection.classList.add('active');
                }
              }
            }, 100);
          }
        }

        // Handle connect subpages
        if (pageKey === 'connect' && connectSubpage) {
          setTimeout(() => {
            const connectTabs = document.querySelectorAll<HTMLButtonElement>(
              '.gallery-tab[data-connect-type]',
            );
            const connectSections = document.querySelectorAll<HTMLElement>(
              '.connect-section',
            );

            // Map subpage to connect type
            let connectType = connectSubpage;

            // Update active tab
            connectTabs.forEach((tab) => {
              if (tab.dataset.connectType === connectType) {
                tab.classList.add('active');
              } else {
                tab.classList.remove('active');
              }
            });

            // Update active section
            connectSections.forEach((section) =>
              section.classList.remove('active'),
            );
            const targetSectionId = `${connectType}-connect-section`;
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
              targetSection.classList.add('active');
            }
          }, 100);
        }
      }
    });
  });

  // Initialize with 'about' page
  setActivePage('home');

  // Load admin data
  loadAdminData();
}

// Load data from admin dashboard
// Load data from admin dashboard
async function loadAdminData(): Promise<void> {
  console.log('loadAdminData: Starting to load admin data');
  // Load News & Updates (keep in localStorage for now)
  const updates = JSON.parse(localStorage.getItem('nsm_updates') || '[]');
  console.log('loadAdminData: Updates found', updates);
  if (updates.length > 0) {
    renderNewsUpdates(updates);
  } else {
    console.log('loadAdminData: No updates found in localStorage');
  }

  try {
    // Load Event Photos from IndexedDB
    const eventPhotos = await DB.getEvents();
    console.log('loadAdminData: Event photos found', eventPhotos.length);
    // Note: We might want to add these to the gallery dynamically, but for now we'll just expose them
    (window as any).adminEventPhotos = eventPhotos;

    // Load Gallery Photos from IndexedDB
    const galleryPhotos = await DB.getGallery();
    // Organize by year for the gallery view
    const galleryByYear: Record<number, string[]> = {};
    galleryPhotos.forEach((item: any) => {
      if (!galleryByYear[item.year]) {
        galleryByYear[item.year] = [];
      }
      item.photos.forEach((photo: any) => {
        galleryByYear[item.year].push(photo.url);
      });
    });
    (window as any).adminGalleryPhotos = galleryByYear;

    // Load Reunion Photos from IndexedDB
    const reunionPhotos = await DB.getReunion();
    // Organize by year
    const reunionByYear: Record<number, string[]> = {};
    reunionPhotos.forEach((item: any) => {
      if (!reunionByYear[item.year]) {
        reunionByYear[item.year] = [];
      }
      item.photos.forEach((photo: any) => {
        reunionByYear[item.year].push(photo.url);
      });
    });
    (window as any).adminReunionPhotos = reunionByYear;

  } catch (error) {
    console.error('Error loading data from IndexedDB:', error);
  }

  // Update photo counts if the function exists
  if ((window as any).updatePhotoCounts) {
    (window as any).updatePhotoCounts();
  }

  // Load Content Updates
  try {
    const heroTitle = localStorage.getItem('nsm_hero_title');
    const heroQuote = localStorage.getItem('nsm_hero_quote');

    if (heroTitle) {
      const titleEl = document.getElementById('hero-title');
      if (titleEl) titleEl.textContent = heroTitle;
    }

    if (heroQuote) {
      const quoteEl = document.querySelector('.hero-quote');
      if (quoteEl) quoteEl.textContent = quoteEl.textContent = heroQuote;
    }
  } catch (e) {
    console.error('Error loading content updates', e);
  }
}

function renderNewsUpdates(updates: any[]): void {
  // Sort by date descending
  updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Find container to inject into
  // We'll put it before the "How to Join" box in the left column
  const leftColumn = document.querySelector('.home-left-column');
  const howToJoinBox = document.querySelector('.home-info-box');

  console.log('renderNewsUpdates: Containers found?', { leftColumn: !!leftColumn, howToJoinBox: !!howToJoinBox });

  if (leftColumn && howToJoinBox) {
    // Check if news box already exists
    if (leftColumn.querySelector('.nsm-events-box.latest-news')) {
      console.log('renderNewsUpdates: News box already exists, removing old one');
      leftColumn.querySelector('.nsm-events-box.latest-news')?.remove();
    }

    // Create News Box
    const newsBox = document.createElement('div');
    newsBox.className = 'nsm-events-box latest-news'; // Use same styling as events box
    newsBox.style.marginTop = '0';
    newsBox.style.marginBottom = '20px'; // Add spacing

    // Create Content
    let updatesHtml = '';
    updates.slice(0, 3).forEach((update) => { // Show top 3
      updatesHtml += `
        <div class="news-item" style="padding: 15px; border-bottom: 1px solid #eee; last-child:border-bottom:none;">
          <h4 style="margin: 0 0 5px 0; color: #00274d; font-size: 16px;">${update.title}</h4>
          <p style="margin: 0; font-size: 13px; color: #666;">${update.date}</p>
          <p style="margin: 5px 0 0 0; font-size: 14px; line-height: 1.4;">${update.content.substring(0, 100)}${update.content.length > 100 ? '...' : ''}</p>
        </div>
      `;
    });

    newsBox.innerHTML = `
      <div class="events-box-header">
        <h3 class="events-box-heading">
          <i class="fas fa-bullhorn" style="margin-right: 10px; color: #c5a059;"></i>
          Latest News
        </h3>
      </div>
      <div class="news-content-container" style="background: white;">
        ${updatesHtml}
        ${updates.length > 3 ? `
          <div style="padding: 10px; text-align: center; border-top: 1px solid #eee;">
            <a href="#" class="view-all-news" style="color: #00274d; font-weight: 600; text-decoration: none; font-size: 13px;">View All Updates</a>
          </div>
        ` : ''}
      </div>
    `;

    // Insert before "How to Join"
    console.log('renderNewsUpdates: Inserting news box');
    leftColumn.insertBefore(newsBox, howToJoinBox);
  } else {
    console.error('renderNewsUpdates: Could not find target containers');
  }
}

// NSM School photos - all images from public/images/NSM School folder
const nsmSchoolImages = [
  '/images/NSM School/AE2P9912.JPG',
  '/images/NSM School/AE2P9913.JPG',
  '/images/NSM School/AE2P9925.JPG',
  '/images/NSM School/DJI_0184.JPG',
  '/images/NSM School/DJI_0186.JPG',
  '/images/NSM School/DJI_0211.JPG',
  '/images/NSM School/DJI_0213.JPG',
  '/images/NSM School/DSC07151.JPG',
  '/images/NSM School/DSC07152.JPG',
  '/images/NSM School/DSC07157.JPG',
  '/images/NSM School/DSC07158.JPG',
  '/images/NSM School/DSC07159.JPG',
  '/images/NSM School/DSC07160.JPG',
  '/images/NSM School/DSC07161.JPG',
  '/images/NSM School/IMG_6713.JPG',
  '/images/NSM School/IMG_6714.JPG',
  '/images/NSM School/IMG_6716.JPG',
  '/images/NSM School/IMG_8640.JPG',
  '/images/NSM School/IMG_8641.JPG',
  '/images/NSM School/Q64A9800.JPG',
  '/images/NSM School/Q64A9801.JPG',
  '/images/NSM School/RHL_5968.JPG',
  '/images/NSM School/RHL_5982.JPG',
  '/images/NSM School/RHL_6044.JPG',
  '/images/NSM School/RHL_6057.JPG',
  '/images/NSM School/RHL_6092.JPG',
  '/images/NSM School/RHL_6110.JPG',
  '/images/NSM School/RHL_6171.JPG',
  '/images/NSM School/RHL_6180.JPG',
  '/images/NSM School/RHL_6825.JPG',
  '/images/NSM School/RHL_6830.JPG',
  '/images/NSM School/RHL_6834.JPG',
  '/images/NSM School/RHL_6852.JPG',
  '/images/NSM School/RHL_6874.JPG',
  '/images/NSM School/RHL_6937.JPG',
  '/images/NSM School/RHL_6942.JPG',
  '/images/NSM School/RHL_7721.JPG',
  '/images/NSM School/RHL_7722.JPG',
  '/images/NSM School/RHL_7742.JPG',
  '/images/NSM School/RHL_7750.JPG',
  '/images/NSM School/RHL_7752.JPG',
  '/images/NSM School/RHL_7760.JPG',
  '/images/NSM School/RHL_7761.JPG',
  '/images/NSM School/RHL_7767.JPG',
  '/images/NSM School/RHL_8096.JPG',
  '/images/NSM School/RHL_8097.JPG',
  '/images/NSM School/RHL_8392.JPG',
  '/images/NSM School/RHL_8393.JPG',
  '/images/NSM School/RHL_8401.JPG',
  // Drone selected images
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0020.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0022.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0029.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0030.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0034.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0035.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0037.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0039.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0040.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0041.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0042.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0044.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0048.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0050.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0052.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0053.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0055.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0057.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0058.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0059.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0060.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0061.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0062.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0064.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0065.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0067.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0068.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0069.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0070.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0071.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0072.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0073.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0074.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0075.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0076.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0077.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0078.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0079.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0080.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0081.JPG',
  '/images/NSM School/NSM School  Dron - sELECTED/DJI_0082.JPG',
];

// Slider state
let sliderInterval: number | null = null;
let currentSlideIndex = 0;
let homeSliderInterval: number | null = null;
let homeSlideIndex = 0;

// Initialize automatic image sliders
function initImageSliders(): void {
  // Home page slider
  const homeSlides = document.querySelectorAll<HTMLElement>('.home-slide');
  const homeDots = document.querySelectorAll<HTMLElement>('.home-dot');

  if (homeSlides.length > 0) {
    // Clear any existing interval
    if (homeSliderInterval !== null) {
      clearInterval(homeSliderInterval);
    }

    const totalHomeSlides = homeSlides.length;
    homeSlideIndex = 0;

    function showHomeSlide(index: number): void {
      homeSlides.forEach((slide) => slide.classList.remove('active'));
      homeDots.forEach((dot) => dot.classList.remove('active'));

      if (homeSlides[index]) {
        homeSlides[index].classList.add('active');
      }
      if (homeDots[index]) {
        homeDots[index].classList.add('active');
      }
    }

    function nextHomeSlide(): void {
      homeSlideIndex = (homeSlideIndex + 1) % totalHomeSlides;
      showHomeSlide(homeSlideIndex);
    }

    // Show first slide
    showHomeSlide(0);

    // Auto-advance slider every 3 seconds (faster)
    homeSliderInterval = window.setInterval(nextHomeSlide, 3000);

    // Add click handlers for dots
    homeDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        homeSlideIndex = index;
        showHomeSlide(homeSlideIndex);
        if (homeSliderInterval !== null) {
          clearInterval(homeSliderInterval);
        }
        homeSliderInterval = window.setInterval(nextHomeSlide, 3000);
      });
    });
  }

  // Center slider (middle box)
  const centerSlides = document.querySelectorAll<HTMLElement>('.center-slide');
  const centerDots = document.querySelectorAll<HTMLElement>('.center-dot');
  const prevCenter = document.querySelector<HTMLElement>('.prev-center');
  const nextCenter = document.querySelector<HTMLElement>('.next-center');

  if (centerSlides.length > 0) {
    let centerSliderInterval: number | null = null;
    let centerSlideIndex = 0;

    // Clear any existing interval
    if (centerSliderInterval !== null) {
      clearInterval(centerSliderInterval);
    }

    const totalCenterSlides = centerSlides.length;

    function showCenterSlide(index: number): void {
      centerSlides.forEach((slide) => slide.classList.remove('active'));
      centerDots.forEach((dot) => dot.classList.remove('active'));

      if (centerSlides[index]) {
        centerSlides[index].classList.add('active');
      }
      if (centerDots[index]) {
        centerDots[index].classList.add('active');
      }
    }

    function nextCenterSlide(): void {
      centerSlideIndex = (centerSlideIndex + 1) % totalCenterSlides;
      showCenterSlide(centerSlideIndex);
    }

    function prevCenterSlide(): void {
      centerSlideIndex = (centerSlideIndex - 1 + totalCenterSlides) % totalCenterSlides;
      showCenterSlide(centerSlideIndex);
    }

    // Show first slide
    showCenterSlide(0);

    // Auto-advance slider every 4 seconds
    centerSliderInterval = window.setInterval(nextCenterSlide, 4000);

    // Add click handlers for dots
    centerDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        centerSlideIndex = index;
        showCenterSlide(centerSlideIndex);
        if (centerSliderInterval !== null) {
          clearInterval(centerSliderInterval);
        }
        centerSliderInterval = window.setInterval(nextCenterSlide, 4000);
      });
    });

    // Add click handlers for navigation arrows
    if (nextCenter) {
      nextCenter.addEventListener('click', () => {
        nextCenterSlide();
        if (centerSliderInterval !== null) {
          clearInterval(centerSliderInterval);
        }
        centerSliderInterval = window.setInterval(nextCenterSlide, 4000);
      });
    }

    if (prevCenter) {
      prevCenter.addEventListener('click', () => {
        prevCenterSlide();
        if (centerSliderInterval !== null) {
          clearInterval(centerSliderInterval);
        }
        centerSliderInterval = window.setInterval(nextCenterSlide, 4000);
      });
    }
  }

  // Modern slider
  const sliderContainerModern = document.querySelector('.slider-container-modern');
  const slidesModern = document.querySelectorAll<HTMLElement>('.slide-modern');
  const indicators = document.querySelectorAll<HTMLElement>('.indicator');
  const prevArrow = document.querySelector<HTMLElement>('.prev-arrow');
  const nextArrow = document.querySelector<HTMLElement>('.next-arrow');

  if (sliderContainerModern && slidesModern.length > 0) {
    // Clear any existing interval
    if (sliderInterval !== null) {
      clearInterval(sliderInterval);
    }

    const totalSlides = slidesModern.length;
    currentSlideIndex = 0;

    const progressFill = document.querySelector<HTMLElement>('.progress-fill');
    let progressInterval: number | null = null;

    function resetProgress(): void {
      if (progressFill) {
        progressFill.style.width = '0%';
      }
      if (progressInterval !== null) {
        clearInterval(progressInterval);
      }
      let progress = 0;
      progressInterval = window.setInterval(() => {
        progress += 0.2;
        if (progressFill) {
          progressFill.style.width = progress + '%';
        }
        if (progress >= 100) {
          if (progressInterval !== null) {
            clearInterval(progressInterval);
          }
        }
      }, 10);
    }

    function showSlide(index: number): void {
      // Remove active class from all slides and indicators
      slidesModern.forEach((slide) => slide.classList.remove('active'));
      indicators.forEach((indicator) => indicator.classList.remove('active'));

      // Add active class to current slide and indicator
      if (slidesModern[index]) {
        slidesModern[index].classList.add('active');
      }
      if (indicators[index]) {
        indicators[index].classList.add('active');
      }

      // Reset progress bar
      resetProgress();
    }

    function nextSlide(): void {
      currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
      showSlide(currentSlideIndex);
    }

    function prevSlide(): void {
      currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
      showSlide(currentSlideIndex);
    }

    // Show first slide
    showSlide(0);

    // Auto-advance slider every 5 seconds
    sliderInterval = window.setInterval(nextSlide, 5000);

    // Add click handlers for indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        currentSlideIndex = index;
        showSlide(currentSlideIndex);
        // Reset interval
        if (sliderInterval !== null) {
          clearInterval(sliderInterval);
        }
        sliderInterval = window.setInterval(nextSlide, 5000);
        resetProgress();
      });
    });

    // Add click handlers for navigation arrows
    if (nextArrow) {
      nextArrow.addEventListener('click', () => {
        nextSlide();
        if (sliderInterval !== null) {
          clearInterval(sliderInterval);
        }
        sliderInterval = window.setInterval(nextSlide, 5000);
        resetProgress();
      });
    }

    if (prevArrow) {
      prevArrow.addEventListener('click', () => {
        prevSlide();
        if (sliderInterval !== null) {
          clearInterval(sliderInterval);
        }
        sliderInterval = window.setInterval(nextSlide, 5000);
        resetProgress();
      });
    }
  }

  // Legacy slider support (if exists)
  const sliderContainer = document.querySelector('.slider-container');
  const slides = document.querySelectorAll<HTMLElement>('.slide');
  const dots = document.querySelectorAll<HTMLElement>('.dot');

  if (sliderContainer && slides.length > 0 && slidesModern.length === 0) {
    // Clear any existing interval
    if (sliderInterval !== null) {
      clearInterval(sliderInterval);
    }

    const totalSlides = slides.length;
    currentSlideIndex = 0;

    function showSlide(index: number): void {
      slides.forEach((slide) => slide.classList.remove('active'));
      dots.forEach((dot) => dot.classList.remove('active'));

      if (slides[index]) {
        slides[index].classList.add('active');
      }
      if (dots[index]) {
        dots[index].classList.add('active');
      }
    }

    function nextSlide(): void {
      currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
      showSlide(currentSlideIndex);
    }

    showSlide(0);
    sliderInterval = window.setInterval(nextSlide, 4000);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlideIndex = index;
        showSlide(currentSlideIndex);
        if (sliderInterval !== null) {
          clearInterval(sliderInterval);
        }
        sliderInterval = window.setInterval(nextSlide, 4000);
      });
    });
  }

  // Duplicate thumbnails for seamless loop
  const thumbnailContainer = document.querySelector('.thumbnail-container');
  if (thumbnailContainer) {
    const existingSlides = thumbnailContainer.querySelectorAll('.thumbnail-slide');
    if (existingSlides.length <= 7) {
      existingSlides.forEach((slide) => {
        const clone = slide.cloneNode(true) as HTMLElement;
        thumbnailContainer.appendChild(clone);
      });
    }
  }
}

// Gallery Tab Switching
function initGalleryTabs(): void {
  const galleryTabs = document.querySelectorAll<HTMLButtonElement>('.gallery-tab[data-gallery-type]');
  const gallerySections = document.querySelectorAll<HTMLElement>('.gallery-section');

  galleryTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const galleryType = tab.dataset.galleryType;

      // Update active tab
      galleryTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active section
      gallerySections.forEach((section) => section.classList.remove('active'));
      const targetSection = document.getElementById(`${galleryType}-gallery-section`);
      if (targetSection) {
        targetSection.classList.add('active');

        // If video gallery is activated, populate videos
        if (galleryType === 'video') {
          setTimeout(() => {
            populateVideoGallery();
          }, 100);
        }
      }
    });
  });
}

// Reunion Tab Switching
function initReunionTabs(): void {
  const reunionTabs = document.querySelectorAll<HTMLButtonElement>('.gallery-tab[data-reunion-type]');
  const reunionSections = document.querySelectorAll<HTMLElement>('.reunion-section');

  reunionTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const reunionType = tab.dataset.reunionType;

      // Update active tab
      reunionTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active section
      reunionSections.forEach((section) => section.classList.remove('active'));
      let targetSectionId = '';
      if (reunionType === 'about') {
        targetSectionId = 'about-reunion-section';
      } else if (reunionType === 'gallery') {
        targetSectionId = 'reunion-gallery-section';
      }
      const targetSection = document.getElementById(targetSectionId);
      if (targetSection) {
        targetSection.classList.add('active');

        // Force images to load when gallery section is shown
        if (reunionType === 'gallery') {
          setTimeout(() => {
            const images = targetSection.querySelectorAll<HTMLImageElement>('.reunion-year-image');
            images.forEach((img) => {
              if (img.dataset.src) {
                img.src = img.dataset.src;
              }
              // Force image reload
              const src = img.src;
              img.src = '';
              img.src = src;
            });
          }, 100);
        }
      }
    });
  });
}

function initConnectTabs(): void {
  const connectTabs = document.querySelectorAll<HTMLButtonElement>('.gallery-tab[data-connect-type]');
  const connectSections = document.querySelectorAll<HTMLElement>('.connect-section');

  // Helper function to check if user is a member
  function isUserMember(): boolean {
    const memberships = JSON.parse(localStorage.getItem('nsm_memberships') || '[]');
    return memberships.length > 0;
  }

  // Helper function to navigate to member page
  function navigateToMemberPage(): void {
    const memberNavLink = document.querySelector<HTMLAnchorElement>('a[data-page="member"]');
    if (memberNavLink) {
      memberNavLink.click();
    } else {
      // Fallback: navigate directly to member page
      const memberPage = document.getElementById('page-member');
      if (memberPage) {
        const pageSections = document.querySelectorAll('.page-section');
        pageSections.forEach((section) => section.classList.remove('visible'));
        memberPage.classList.add('visible');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  connectTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const connectType = tab.dataset.connectType;

      // Check membership for restricted sections
      const memberOnlySections = ['alumni-event', 'alumni-directory', 'business-directory'];
      if (memberOnlySections.includes(connectType || '')) {
        if (!isUserMember()) {
          // User is not a member - navigate to member page
          navigateToMemberPage();
          return; // Don't show the section
        }
      }

      // Update active tab
      connectTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active section
      connectSections.forEach((section) => section.classList.remove('active'));
      const targetSectionId = connectType + '-connect-section';
      const targetSection = document.getElementById(targetSectionId);
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  });
}

// Chapter Type Tab Switching
function initChapterTabs(): void {
  const chapterTabs = document.querySelectorAll<HTMLButtonElement>('.chapter-tab');
  const chapterSections = document.querySelectorAll<HTMLElement>('.chapter-section');

  chapterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const chapterType = tab.dataset.chapterType;
      const nostalgiaType = tab.dataset.nostalgiaType;
      const shopType = tab.dataset.shopType;

      // Update active tab
      chapterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active section based on which gallery we're in
      if (chapterType) {
        chapterSections.forEach((section) => section.classList.remove('active'));
        const targetSection = document.getElementById(`${chapterType}-chapters-section`);
        if (targetSection) {
          targetSection.classList.add('active');
        }
      } else if (nostalgiaType) {
        chapterSections.forEach((section) => section.classList.remove('active'));
        const targetSection = document.getElementById(`${nostalgiaType}-nostalgia-section`);
        if (targetSection) {
          targetSection.classList.add('active');
        }
      } else if (shopType) {
        chapterSections.forEach((section) => section.classList.remove('active'));
        const targetSection = document.getElementById(`${shopType}-shop-section`);
        if (targetSection) {
          targetSection.classList.add('active');
        }
      }
    });
  });
}

// Year Photo Gallery Functionality
function initYearPhotoGallery(): void {
  const viewLinks = document.querySelectorAll<HTMLAnchorElement>('.view-link[data-year][data-type="photo"]');
  const modal = document.getElementById('year-photo-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalOverlay = modal?.querySelector<HTMLElement>('.modal-overlay');
  const modalYear = document.getElementById('modal-year');
  const photosGrid = document.getElementById('year-photos-grid');
  const prevYearBtn = document.getElementById('prev-year-btn');
  const nextYearBtn = document.getElementById('next-year-btn');

  let currentYear = 2025;

  // Generate photos for all years (1993-2025)
  function generateYearPhotos(year: number): string[] {
    // Check for admin-uploaded photos first
    const adminPhotos = (window as any).adminGalleryPhotos?.[year];
    if (adminPhotos && adminPhotos.length > 0) {
      return adminPhotos;
    }

    // Distribute NSM School images across years (1993-2025 = 33 years)
    // Each year gets a subset of images, cycling through the array
    const imagesPerYear = 6; // Show 6 images per year
    const yearIndex = year - 1993; // Convert to 0-based index

    // Calculate starting index for this year
    const startIndex = (yearIndex * imagesPerYear) % nsmSchoolImages.length;

    // Get images for this year (cycling through the array)
    const yearImages: string[] = [];
    for (let i = 0; i < imagesPerYear; i++) {
      const imageIndex = (startIndex + i) % nsmSchoolImages.length;
      yearImages.push(nsmSchoolImages[imageIndex]);
    }

    return yearImages;
  }

  function openYearModal(year: number): void {
    currentYear = year;
    if (!modal || !modalYear || !photosGrid) return;

    // Update year title
    modalYear.textContent = year.toString();

    // Clear existing photos
    photosGrid.innerHTML = '';

    // Get photos for this year
    const photos = generateYearPhotos(year);

    // Add photos to grid
    photos.forEach((photoUrl, index) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'year-photo-item';
      photoItem.innerHTML = `<img src="${photoUrl}" alt="NSM ${year} Photo ${index + 1}" loading="lazy" data-photo-index="${index}" data-photo-url="${photoUrl}">`;
      photosGrid.appendChild(photoItem);
    });

    // Add click handlers to photos for full screen view using event delegation
    const photoItems = photosGrid.querySelectorAll<HTMLImageElement>('.year-photo-item img');
    const allPhotos = Array.from(photoItems).map((i) => i.dataset.photoUrl || i.src);

    // Use event delegation on the grid container instead of individual images
    photosGrid.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const img = target.closest('img');
      if (img && img.parentElement?.classList.contains('year-photo-item') && !isLightboxOpen) {
        e.preventDefault();
        e.stopPropagation();
        const currentIndex = parseInt(img.dataset.photoIndex || '0', 10);
        openPhotoLightbox(allPhotos, currentIndex);
      }
    });

    // Set cursor style
    photoItems.forEach((img) => {
      img.style.cursor = 'pointer';
    });

    // Update navigation buttons
    if (prevYearBtn && prevYearBtn instanceof HTMLButtonElement) {
      prevYearBtn.disabled = year <= 1993;
    }
    if (nextYearBtn && nextYearBtn instanceof HTMLButtonElement) {
      nextYearBtn.disabled = year >= 2025;
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeYearModal(): void {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateYear(direction: 'prev' | 'next'): void {
    const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1;
    if (newYear >= 1993 && newYear <= 2025) {
      openYearModal(newYear);
    }
  }

  // Function to update photo counts in year cards
  function updatePhotoCounts(): void {
    const yearCards = document.querySelectorAll('.year-card[data-year][data-type="photo"]');
    yearCards.forEach((card) => {
      const year = parseInt((card as HTMLElement).dataset.year || '2025', 10);
      const photos = generateYearPhotos(year);
      const photoCount = photos.length;
      const viewLink = card.querySelector('.view-link[data-year][data-type="photo"]');
      if (viewLink) {
        viewLink.textContent = photoCount.toString();
      }
    });
  }

  // Make updatePhotoCounts available globally
  (window as any).updatePhotoCounts = updatePhotoCounts;

  // Update photo counts on initialization
  updatePhotoCounts();

  // Add event listeners
  viewLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const year = parseInt(link.dataset.year || '2025', 10);
      openYearModal(year);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeYearModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeYearModal);
  }

  if (prevYearBtn) {
    prevYearBtn.addEventListener('click', () => navigateYear('prev'));
  }

  if (nextYearBtn) {
    nextYearBtn.addEventListener('click', () => navigateYear('next'));
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeYearModal();
    }
  });
}

// Video Gallery - Direct Display Functionality
function populateVideoGallery(): void {
  const videosGrid = document.getElementById('videos-direct-grid');
  if (!videosGrid) return;

  // Don't populate if already populated
  if (videosGrid.children.length > 0) return;

  // Different YouTube video IDs for variety
  const allVideos = [
    'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
    'jNQXAC9IVRw', // Me at the zoo
    'kJQP7kiw5Fk', // PSY - GANGNAM STYLE
    '9bZkp7q19f0', // PSY - GENTLEMAN
    'L_jWHffIx5E', // Smosh - Food Battle 2010
    'fJ9rUzIMcZQ', // Evolution of Dance
    'ZbZSe6N_BXs', // Charlie bit my finger
    'a1Y73sPHKxw', // The Gummy Bear Song
    'OPf0YbXqDm0', // Mark Ronson - Uptown Funk
    'kXYiU_JCYtU', // Linkin Park - Numb
    'YQHsXMglC9A', // Adele - Hello
    '9bZkp7q19f0', // PSY - GENTLEMAN
    'dQw4w9WgXcQ', // Rick Astley
    'jNQXAC9IVRw', // Me at the zoo
    'kJQP7kiw5Fk', // PSY - GANGNAM STYLE
    'L_jWHffIx5E', // Smosh
    'fJ9rUzIMcZQ', // Evolution of Dance
    'ZbZSe6N_BXs', // Charlie bit my finger
  ];

  // Add all videos to grid
  allVideos.forEach((videoId, index) => {
    const videoItem = document.createElement('div');
    videoItem.className = 'video-direct-item';
    videoItem.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${videoId}" 
        title="NSM Video ${index + 1}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
        loading="lazy">
      </iframe>
    `;
    videosGrid.appendChild(videoItem);
  });
}

// Legacy function name for compatibility
function initYearVideoGallery(): void {
  populateVideoGallery();
}

// Year Chapter Gallery Functionality
function initYearChapterGallery(): void {
  const viewLinks = document.querySelectorAll<HTMLAnchorElement>('.view-link[data-year][data-type="chapter"]');
  const modal = document.getElementById('year-chapter-modal');
  const modalCloseBtn = document.getElementById('modal-chapter-close-btn');
  const modalOverlay = modal?.querySelector<HTMLElement>('.modal-overlay');
  const modalYear = document.getElementById('modal-chapter-year');
  const modalChapterType = document.getElementById('modal-chapter-type');
  const photosGrid = document.getElementById('year-chapter-photos-grid');
  const prevYearBtn = document.getElementById('prev-chapter-year-btn');
  const nextYearBtn = document.getElementById('next-chapter-year-btn');

  let currentYear = 2025;
  let currentChapterType = 'all';

  // Generate photos for all years (2016-2025)
  function generateChapterPhotos(year: number, chapterType: string): string[] {
    // Distribute NSM School images across years for all chapter types
    // Each year gets a subset of images, cycling through the array
    const imagesPerYear = 6; // Show 6 images per year
    const yearIndex = year - 2016; // Convert to 0-based index

    // Calculate starting index for this year
    // Use different offsets for different chapter types to show variety
    let baseOffset = 0;
    if (chapterType === 'india') {
      baseOffset = 0;
    } else if (chapterType === 'international') {
      baseOffset = Math.floor(nsmSchoolImages.length / 3); // Start from 1/3 of images
    } else {
      baseOffset = Math.floor(nsmSchoolImages.length / 2); // Start from middle for 'all'
    }

    const startIndex = (baseOffset + yearIndex * imagesPerYear) % nsmSchoolImages.length;

    // Get images for this year (cycling through the array)
    const yearImages: string[] = [];
    for (let i = 0; i < imagesPerYear; i++) {
      const imageIndex = (startIndex + i) % nsmSchoolImages.length;
      yearImages.push(nsmSchoolImages[imageIndex]);
    }

    return yearImages;
  }

  function openYearModal(year: number, chapterType: string): void {
    currentYear = year;
    currentChapterType = chapterType;
    if (!modal || !modalYear || !modalChapterType || !photosGrid) return;

    // Update year and chapter type title
    modalYear.textContent = year.toString();
    const chapterTypeName = chapterType === 'india' ? 'India' : chapterType === 'international' ? 'International' : 'All Chapters';
    modalChapterType.textContent = chapterTypeName;

    // Clear existing photos
    photosGrid.innerHTML = '';

    // Get photos for this year and chapter type
    const photos = generateChapterPhotos(year, chapterType);

    // Add photos to grid
    photos.forEach((photoUrl, index) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'year-photo-item';
      photoItem.innerHTML = `<img src="${photoUrl}" alt="NSM ${chapterTypeName} ${year} Photo ${index + 1}" loading="lazy" data-photo-index="${index}" data-photo-url="${photoUrl}">`;
      photosGrid.appendChild(photoItem);
    });

    // Add click handlers to photos for full screen view using event delegation
    const photoItems = photosGrid.querySelectorAll<HTMLImageElement>('.year-photo-item img');
    const allPhotos = Array.from(photoItems).map((i) => i.dataset.photoUrl || i.src);

    // Use event delegation on the grid container instead of individual images
    photosGrid.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const img = target.closest('img');
      if (img && img.parentElement?.classList.contains('year-photo-item') && !isLightboxOpen) {
        e.preventDefault();
        e.stopPropagation();
        const currentIndex = parseInt(img.dataset.photoIndex || '0', 10);
        openPhotoLightbox(allPhotos, currentIndex);
      }
    });

    // Set cursor style
    photoItems.forEach((img) => {
      img.style.cursor = 'pointer';
    });

    // Update navigation buttons
    if (prevYearBtn && prevYearBtn instanceof HTMLButtonElement) {
      prevYearBtn.disabled = year <= 2016;
    }
    if (nextYearBtn && nextYearBtn instanceof HTMLButtonElement) {
      nextYearBtn.disabled = year >= 2025;
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeYearModal(): void {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateYear(direction: 'prev' | 'next'): void {
    const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1;
    if (newYear >= 2016 && newYear <= 2025) {
      openYearModal(newYear, currentChapterType);
    }
  }

  // Add event listeners
  viewLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const year = parseInt(link.dataset.year || '2025', 10);
      const chapterType = link.dataset.chapter || 'all';
      openYearModal(year, chapterType);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeYearModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeYearModal);
  }

  if (prevYearBtn) {
    prevYearBtn.addEventListener('click', () => navigateYear('prev'));
  }

  if (nextYearBtn) {
    nextYearBtn.addEventListener('click', () => navigateYear('next'));
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeYearModal();
    }
  });
}

// Year Nostalgia Gallery Functionality
function initYearNostalgiaGallery(): void {
  const viewLinks = document.querySelectorAll<HTMLAnchorElement>('.view-link[data-year][data-type="nostalgia"]');
  const modal = document.getElementById('year-nostalgia-modal');
  const modalCloseBtn = document.getElementById('modal-nostalgia-close-btn');
  const modalOverlay = modal?.querySelector<HTMLElement>('.modal-overlay');
  const modalYear = document.getElementById('modal-nostalgia-year');
  const modalNostalgiaType = document.getElementById('modal-nostalgia-type');
  const photosGrid = document.getElementById('year-nostalgia-photos-grid');
  const prevYearBtn = document.getElementById('prev-nostalgia-year-btn');
  const nextYearBtn = document.getElementById('next-nostalgia-year-btn');

  let currentYear = 2025;
  let currentNostalgiaType = 'all';

  function generateNostalgiaPhotos(year: number, nostalgiaType: string): string[] {
    const baseImages = [
      '1516321318423-f06f85e504b3',
      '1522202176988-66273c2fd55f',
      '1523050854058-8df90110c9f1',
      '1541339907198-e08756dedf3f',
      '1509062522246-3755977927d7',
      '1517486808906-6ca8b3f04846',
      '1497633762265-9d179a990aa6',
      '1503676260728-1c00da094a0b',
      '1517245386807-bb43f82c33c4',
      '1524178232363-1fb2b075b655',
      '1511578314322-379afb476865',
      '1529390079861-591de354faf5',
    ];

    const yearOffset = nostalgiaType === 'india' ? year % baseImages.length : (year + 7) % baseImages.length;
    return baseImages.map((_imgId, index) => {
      const selectedIndex = (index + yearOffset) % baseImages.length;
      return `https://images.unsplash.com/photo-${baseImages[selectedIndex]}?w=800&q=95&auto=format&fit=crop`;
    });
  }

  function openYearModal(year: number, nostalgiaType: string): void {
    currentYear = year;
    currentNostalgiaType = nostalgiaType;
    if (!modal || !modalYear || !modalNostalgiaType || !photosGrid) return;

    modalYear.textContent = year.toString();
    const typeName = nostalgiaType === 'india' ? 'India' : nostalgiaType === 'international' ? 'International' : 'All';
    modalNostalgiaType.textContent = typeName;

    photosGrid.innerHTML = '';
    const photos = generateNostalgiaPhotos(year, nostalgiaType);

    photos.forEach((photoUrl, index) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'year-photo-item';
      photoItem.innerHTML = `<img src="${photoUrl}" alt="NSM Nostalgia ${typeName} ${year} Photo ${index + 1}" loading="lazy">`;
      photosGrid.appendChild(photoItem);
    });

    if (prevYearBtn && prevYearBtn instanceof HTMLButtonElement) prevYearBtn.disabled = year <= 1993;
    if (nextYearBtn && nextYearBtn instanceof HTMLButtonElement) nextYearBtn.disabled = year >= 2025;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeYearModal(): void {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateYear(direction: 'prev' | 'next'): void {
    const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1;
    if (newYear >= 1993 && newYear <= 2025) {
      openYearModal(newYear, currentNostalgiaType);
    }
  }

  viewLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const year = parseInt(link.dataset.year || '2025', 10);
      const nostalgiaType = link.dataset.nostalgia || 'all';
      openYearModal(year, nostalgiaType);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeYearModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeYearModal);
  if (prevYearBtn) prevYearBtn.addEventListener('click', () => navigateYear('prev'));
  if (nextYearBtn) nextYearBtn.addEventListener('click', () => navigateYear('next'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeYearModal();
    }
  });
}

// Year Reunion Gallery Functionality
function initYearReunionGallery(): void {
  const viewLinks = document.querySelectorAll<HTMLAnchorElement>('.view-link[data-year][data-type="reunion"]');
  const modal = document.getElementById('year-reunion-modal');
  const modalCloseBtn = document.getElementById('modal-reunion-close-btn');
  const modalOverlay = modal?.querySelector<HTMLElement>('.modal-overlay');
  const modalYear = document.getElementById('modal-reunion-year');
  const photosGrid = document.getElementById('year-reunion-photos-grid');
  const prevYearBtn = document.getElementById('prev-reunion-year-btn');
  const nextYearBtn = document.getElementById('next-reunion-year-btn');

  let currentYear = 2025;
  const availableYears = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993];

  function generateReunionPhotos(year: number): string[] {
    // Check for admin-uploaded photos first
    const adminPhotos = (window as any).adminReunionPhotos?.[year];
    if (adminPhotos && adminPhotos.length > 0) {
      return adminPhotos;
    }

    // Reunion-specific photos - people gathering, celebrations, group photos
    const baseImages = [
      '1522202176988-66273c2fd55f', // Group meeting
      '1516321318423-f06f85e504b3', // Award ceremony
      '1523050854058-8df90110c9f1', // Conference
      '1529390079861-591de354faf5', // Graduation
      '1541339907198-e08756dedf3f', // Seminar
      '1509062522246-3755977927d7', // Event
      '1517486808906-6ca8b3f04846', // Campus
      '1497633762265-9d179a990aa6', // Library
      '1503676260728-1c00da094a0b', // Meeting
      '1517245386807-bb43f82c33c4', // Discussion
      '1524178232363-1fb2b075b655', // Group
      '1511578314322-379afb476865', // Collaboration
    ];

    const yearOffset = year % baseImages.length;
    return baseImages.map((_imgId, index) => {
      const selectedIndex = (index + yearOffset) % baseImages.length;
      return `https://images.unsplash.com/photo-${baseImages[selectedIndex]}?w=800&q=95&auto=format&fit=crop`;
    });
  }

  function openYearModal(year: number): void {
    currentYear = year;
    if (!modal || !modalYear || !photosGrid) return;

    modalYear.textContent = year.toString();
    photosGrid.innerHTML = '';
    const photos = generateReunionPhotos(year);

    photos.forEach((photoUrl, index) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'year-photo-item';
      photoItem.innerHTML = `<img src="${photoUrl}" alt="NSM Reunion ${year} Photo ${index + 1}" loading="lazy" data-photo-index="${index}" data-photo-url="${photoUrl}">`;
      photosGrid.appendChild(photoItem);
    });

    // Add click handlers to photos for full screen view using event delegation
    const photoItems = photosGrid.querySelectorAll<HTMLImageElement>('.year-photo-item img');
    const allPhotos = Array.from(photoItems).map((i) => i.dataset.photoUrl || i.src);

    // Use event delegation on the grid container instead of individual images
    photosGrid.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const img = target.closest('img');
      if (img && img.parentElement?.classList.contains('year-photo-item') && !isLightboxOpen) {
        e.preventDefault();
        e.stopPropagation();
        const currentIndex = parseInt(img.dataset.photoIndex || '0', 10);
        openPhotoLightbox(allPhotos, currentIndex);
      }
    });

    // Set cursor style
    photoItems.forEach((img) => {
      img.style.cursor = 'pointer';
    });

    const currentIndex = availableYears.indexOf(year);
    if (prevYearBtn && prevYearBtn instanceof HTMLButtonElement) prevYearBtn.disabled = currentIndex <= 0;
    if (nextYearBtn && nextYearBtn instanceof HTMLButtonElement) nextYearBtn.disabled = currentIndex >= availableYears.length - 1;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeYearModal(): void {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateYear(direction: 'prev' | 'next'): void {
    const currentIndex = availableYears.indexOf(currentYear);
    if (currentIndex === -1) return;

    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < availableYears.length) {
      openYearModal(availableYears[newIndex]);
    }
  }

  viewLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const year = parseInt(link.dataset.year || '2025', 10);
      openYearModal(year);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeYearModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeYearModal);
  if (prevYearBtn) prevYearBtn.addEventListener('click', () => navigateYear('prev'));
  if (nextYearBtn) nextYearBtn.addEventListener('click', () => navigateYear('next'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeYearModal();
    }
  });
}

// Photo Lightbox Functionality - Global state to prevent multiple listeners
let lightboxKeyboardHandler: ((e: KeyboardEvent) => void) | null = null;
let isLightboxOpen = false;

function openPhotoLightbox(photos: string[], currentIndex: number): void {
  // Prevent opening if already open
  if (isLightboxOpen) return;

  const lightbox = document.getElementById('photo-lightbox');
  const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const lightboxOverlay = lightbox?.querySelector<HTMLElement>('.lightbox-overlay');

  if (!lightbox || !lightboxImage) return;

  let currentPhotoIndex = currentIndex;
  const totalPhotos = photos.length;

  function updateLightboxImage(): void {
    if (lightboxImage && photos[currentPhotoIndex]) {
      // Show loading state
      lightboxImage.style.opacity = '0.5';

      // Preload image before setting src to prevent hanging
      const img = new Image();
      img.onload = () => {
        if (lightboxImage && photos[currentPhotoIndex]) {
          lightboxImage.src = photos[currentPhotoIndex];
          lightboxImage.style.opacity = '1';
        }
      };
      img.onerror = () => {
        if (lightboxImage) {
          lightboxImage.style.opacity = '1';
        }
      };
      img.src = photos[currentPhotoIndex];

      // Update UI immediately
      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${totalPhotos}`;
      }
      if (lightboxPrevBtn) {
        lightboxPrevBtn.style.display = currentPhotoIndex === 0 ? 'none' : 'flex';
      }
      if (lightboxNextBtn) {
        lightboxNextBtn.style.display = currentPhotoIndex === totalPhotos - 1 ? 'none' : 'flex';
      }
    }
  }

  function showNextPhoto(): void {
    if (currentPhotoIndex < totalPhotos - 1) {
      currentPhotoIndex++;
      updateLightboxImage();
    }
  }

  function showPrevPhoto(): void {
    if (currentPhotoIndex > 0) {
      currentPhotoIndex--;
      updateLightboxImage();
    }
  }

  function closeLightbox(): void {
    if (!lightbox || !isLightboxOpen) return;

    isLightboxOpen = false;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';

    // Remove keyboard listener
    if (lightboxKeyboardHandler) {
      document.removeEventListener('keydown', lightboxKeyboardHandler);
      lightboxKeyboardHandler = null;
    }

    // Clear image src to free memory
    if (lightboxImage) {
      lightboxImage.src = '';
    }
  }

  // Mark as open
  isLightboxOpen = true;

  // Open lightbox
  updateLightboxImage();
  if (lightbox) {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Remove old event listeners and add new ones
  if (lightboxCloseBtn) {
    lightboxCloseBtn.onclick = closeLightbox;
  }
  if (lightboxOverlay) {
    lightboxOverlay.onclick = closeLightbox;
  }
  if (lightboxNextBtn) {
    lightboxNextBtn.onclick = showNextPhoto;
  }
  if (lightboxPrevBtn) {
    lightboxPrevBtn.onclick = showPrevPhoto;
  }

  // Remove old keyboard listener if exists
  if (lightboxKeyboardHandler) {
    document.removeEventListener('keydown', lightboxKeyboardHandler);
  }

  // Keyboard navigation - single handler
  lightboxKeyboardHandler = (e: KeyboardEvent): void => {
    if (!isLightboxOpen || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      showNextPhoto();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showPrevPhoto();
    }
  };

  document.addEventListener('keydown', lightboxKeyboardHandler, { once: false });
}

// Year Shop@1925 Gallery Functionality
function initYearShopGallery(): void {
  const viewLinks = document.querySelectorAll<HTMLAnchorElement>('.view-link[data-year][data-type="shop"]');
  const modal = document.getElementById('year-shop-modal');
  const modalCloseBtn = document.getElementById('modal-shop-close-btn');
  const modalOverlay = modal?.querySelector<HTMLElement>('.modal-overlay');
  const modalYear = document.getElementById('modal-shop-year');
  const modalShopType = document.getElementById('modal-shop-type');
  const photosGrid = document.getElementById('year-shop-photos-grid');
  const prevYearBtn = document.getElementById('prev-shop-year-btn');
  const nextYearBtn = document.getElementById('next-shop-year-btn');

  let currentYear = 2025;
  let currentShopType = 'all';

  function generateShopPhotos(year: number, shopType: string): string[] {
    const baseImages = [
      '1516321318423-f06f85e504b3',
      '1522202176988-66273c2fd55f',
      '1523050854058-8df90110c9f1',
      '1541339907198-e08756dedf3f',
      '1509062522246-3755977927d7',
      '1517486808906-6ca8b3f04846',
      '1497633762265-9d179a990aa6',
      '1503676260728-1c00da094a0b',
      '1517245386807-bb43f82c33c4',
      '1524178232363-1fb2b075b655',
      '1511578314322-379afb476865',
      '1529390079861-591de354faf5',
    ];

    const yearOffset = shopType === 'india' ? (year + 3) % baseImages.length : (year + 9) % baseImages.length;
    return baseImages.map((_imgId, index) => {
      const selectedIndex = (index + yearOffset) % baseImages.length;
      return `https://images.unsplash.com/photo-${baseImages[selectedIndex]}?w=800&q=95&auto=format&fit=crop`;
    });
  }

  function openYearModal(year: number, shopType: string): void {
    currentYear = year;
    currentShopType = shopType;
    if (!modal || !modalYear || !modalShopType || !photosGrid) return;

    modalYear.textContent = year.toString();
    const typeName = shopType === 'india' ? 'India' : shopType === 'international' ? 'International' : 'All';
    modalShopType.textContent = typeName;

    photosGrid.innerHTML = '';
    const photos = generateShopPhotos(year, shopType);

    photos.forEach((photoUrl, index) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'year-photo-item';
      photoItem.innerHTML = `<img src="${photoUrl}" alt="NSM Shop@1925 ${typeName} ${year} Photo ${index + 1}" loading="lazy">`;
      photosGrid.appendChild(photoItem);
    });

    if (prevYearBtn && prevYearBtn instanceof HTMLButtonElement) prevYearBtn.disabled = year <= 1993;
    if (nextYearBtn && nextYearBtn instanceof HTMLButtonElement) nextYearBtn.disabled = year >= 2025;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeYearModal(): void {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateYear(direction: 'prev' | 'next'): void {
    const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1;
    if (newYear >= 1993 && newYear <= 2025) {
      openYearModal(newYear, currentShopType);
    }
  }

  viewLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const year = parseInt(link.dataset.year || '2025', 10);
      const shopType = link.dataset.shop || 'all';
      openYearModal(year, shopType);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeYearModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeYearModal);
  if (prevYearBtn) prevYearBtn.addEventListener('click', () => navigateYear('prev'));
  if (nextYearBtn) nextYearBtn.addEventListener('click', () => navigateYear('next'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeYearModal();
    }
  });
}

// Initialize PPT Gallery - Display PPT files directly
function initPPTGallery(): void {
  const pptConfigs = [
    {
      containerId: 'ppt-images-2023-24',
      pptPath: '/Gen Sec report 2023-24.pptx',
      name: 'Gen Sec Report 2023-24'
    },
    {
      containerId: 'ppt-images-2024-25',
      pptPath: '/Gen Sec report PPT 2024-25.pptx',
      name: 'Gen Sec Report PPT 2024-25'
    }
  ];

  pptConfigs.forEach(config => {
    const container = document.getElementById(config.containerId);
    if (!container) return;

    // Create PPT viewer container
    const viewerContainer = document.createElement('div');
    viewerContainer.className = 'ppt-viewer-container';
    viewerContainer.style.cssText = 'width: 100%; margin: 20px 0;';

    // Check if we're in production (deployed) or local
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const fileUrl = window.location.origin + config.pptPath;

    if (!isLocal) {
      // For deployed sites, use Office Online viewer
      const viewerWrapper = document.createElement('div');
      viewerWrapper.className = 'ppt-viewer-wrapper';
      viewerWrapper.style.cssText = 'width: 100%; height: 600px; margin: 20px 0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); background: #f5f5f5; display: flex; align-items: center; justify-content: center;';

      const iframe = document.createElement('iframe');
      iframe.src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
      iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.setAttribute('loading', 'lazy');

      // Add loading message
      const loadingMsg = document.createElement('div');
      loadingMsg.textContent = 'Loading presentation...';
      loadingMsg.style.cssText = 'position: absolute; color: #666; font-size: 16px;';
      viewerWrapper.appendChild(loadingMsg);

      iframe.onload = () => {
        loadingMsg.style.display = 'none';
      };

      iframe.onerror = () => {
        // Fallback to Google viewer
        iframe.src = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      };

      viewerWrapper.appendChild(iframe);
      viewerContainer.appendChild(viewerWrapper);
    } else {
      // For local development, show download and info
      const localInfo = document.createElement('div');
      localInfo.style.cssText = 'background: #fff3cd; border: 2px solid #ffc107; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;';
      localInfo.innerHTML = `
        <p style="margin: 0 0 15px 0; color: #856404; font-size: 16px;">
          <i class="fas fa-info-circle"></i> PPT viewer requires the site to be deployed. 
          For local development, please download the file to view it.
        </p>
      `;
      viewerContainer.appendChild(localInfo);
    }

    // Add download/view buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 15px; justify-content: center; margin-top: 15px; flex-wrap: wrap;';

    const downloadBtn = document.createElement('a');
    downloadBtn.href = config.pptPath;
    downloadBtn.download = config.pptPath.split('/').pop() || 'presentation.pptx';
    downloadBtn.className = 'ppt-download-btn';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download PPT';
    downloadBtn.style.cssText = 'display: inline-block; padding: 12px 24px; background: #00274d; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease;';
    downloadBtn.onmouseover = () => {
      downloadBtn.style.background = '#003d7a';
      downloadBtn.style.transform = 'translateY(-2px)';
    };
    downloadBtn.onmouseout = () => {
      downloadBtn.style.background = '#00274d';
      downloadBtn.style.transform = 'translateY(0)';
    };

    const viewBtn = document.createElement('a');
    viewBtn.href = config.pptPath;
    viewBtn.target = '_blank';
    viewBtn.className = 'ppt-view-btn';
    viewBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Open in New Tab';
    viewBtn.style.cssText = 'display: inline-block; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease;';
    viewBtn.onmouseover = () => {
      viewBtn.style.background = '#218838';
      viewBtn.style.transform = 'translateY(-2px)';
    };
    viewBtn.onmouseout = () => {
      viewBtn.style.background = '#28a745';
      viewBtn.style.transform = 'translateY(0)';
    };

    buttonContainer.appendChild(downloadBtn);
    buttonContainer.appendChild(viewBtn);
    viewerContainer.appendChild(buttonContainer);

    container.appendChild(viewerContainer);

    // Also try to load as images from folder (if extracted)
    const folderPath = config.pptPath.replace('.pptx', '/').replace('/Gen Sec report', '/Gen Sec report');
    const maxSlides = 50;
    const loadedImages: string[] = [];

    const tryLoadImage = (slideNum: number): Promise<string | null> => {
      return new Promise((resolve) => {
        const formats = ['.jpg', '.jpeg', '.png', '.webp'];
        const prefixes = ['slide-', 'Slide-', 'slide_', 'Slide_', ''];

        let attempts = 0;
        const totalAttempts = formats.length * prefixes.length;

        const tryNext = (): void => {
          const prefix = prefixes[Math.floor(attempts / formats.length)];
          const format = formats[attempts % formats.length];
          const imagePath = `${folderPath}${prefix}${slideNum}${format}`;

          const img = new Image();
          img.onload = () => {
            resolve(imagePath);
          };
          img.onerror = () => {
            attempts++;
            if (attempts < totalAttempts) {
              tryNext();
            } else {
              resolve(null);
            }
          };
          img.src = imagePath;
        };

        tryNext();
      });
    };

    // Try to load extracted images in background
    const loadSlides = async (): Promise<void> => {
      for (let i = 1; i <= maxSlides; i++) {
        const imagePath = await tryLoadImage(i);
        if (imagePath) {
          loadedImages.push(imagePath);
        } else {
          break;
        }
      }

      // If images found, add them below the viewer
      if (loadedImages.length > 0) {
        const imagesGrid = document.createElement('div');
        imagesGrid.className = 'ppt-images-grid';
        imagesGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 30px;';

        loadedImages.forEach((imagePath, index) => {
          const imgContainer = document.createElement('div');
          imgContainer.className = 'ppt-slide-item';
          imgContainer.innerHTML = `
            <img src="${imagePath}" 
                 alt="${config.name} - Slide ${index + 1}" 
                 loading="lazy" 
                 data-slide-index="${index}"
                 data-slide-url="${imagePath}"
                 style="width: 100%; height: 100%; object-fit: contain; cursor: pointer; border-radius: 8px;">
          `;
          imagesGrid.appendChild(imgContainer);
        });

        container.appendChild(imagesGrid);

        // Add click handlers for lightbox
        const allPhotos = loadedImages;
        imagesGrid.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          const img = target.closest('img');
          if (img && img.parentElement?.classList.contains('ppt-slide-item') && !isLightboxOpen) {
            e.preventDefault();
            e.stopPropagation();
            const currentIndex = parseInt(img.dataset.slideIndex || '0', 10);
            openPhotoLightbox(allPhotos, currentIndex);
          }
        });
      }
    };

    // Load images in background (non-blocking)
    loadSlides();
  });
}

// Initialize School Photos Gallery in About Section
function initSchoolPhotosGallery(): void {
  const gallery = document.querySelector('.school-photos-grid');
  if (!gallery) return;

  // Check if already initialized
  if (gallery.hasAttribute('data-lightbox-initialized')) return;
  gallery.setAttribute('data-lightbox-initialized', 'true');

  const photoItems = gallery.querySelectorAll<HTMLImageElement>('.school-photo-item img');
  if (photoItems.length === 0) return;

  // Get all photo URLs
  const allPhotos = Array.from(photoItems).map((img) => img.src);

  // Use event delegation - single listener on the grid
  gallery.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const img = target.closest('img');
    if (img && img.parentElement?.classList.contains('school-photo-item') && !isLightboxOpen) {
      e.preventDefault();
      e.stopPropagation();
      const index = Array.from(photoItems).indexOf(img);
      if (index >= 0) {
        openPhotoLightbox(allPhotos, index);
      }
    }
  });

  // Set cursor style
  photoItems.forEach((img) => {
    img.style.cursor = 'pointer';
  });
}

// Initialize 3D Globe Image Effect
function initGlobe3DEffect(): void {
  const globeImage = document.querySelector<HTMLImageElement>('.about-globe-image');
  const imageContainer = document.querySelector<HTMLElement>('.about-image-content');

  if (!globeImage || !imageContainer) return;

  let mouseX = 0;
  let mouseY = 0;
  let targetRotateX = 0;
  let targetRotateY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;

  // Mouse move handler
  imageContainer.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = imageContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX = e.clientX - centerX;
    mouseY = e.clientY - centerY;

    // Calculate rotation based on mouse position (max 15 degrees)
    targetRotateY = (mouseX / rect.width) * 15;
    targetRotateX = -(mouseY / rect.height) * 15;
  });

  // Mouse leave handler - reset to center
  imageContainer.addEventListener('mouseleave', () => {
    targetRotateX = 0;
    targetRotateY = 0;
  });

  // Scroll handler - move image within container's white space
  function handleScroll(): void {
    if (!imageContainer || !globeImage) return;
    const containerRect = imageContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const containerTop = containerRect.top;
    const containerBottom = containerRect.bottom;
    const containerHeight = containerRect.height;

    // Calculate how much of the container is visible
    const viewportTop = window.scrollY;
    const viewportBottom = window.scrollY + windowHeight;

    // Calculate scroll progress through the container
    // When container enters viewport from bottom, progress goes from 0 to 1
    // When container exits viewport from top, progress goes from 1 to 2
    let scrollProgress = 0;

    if (containerBottom > viewportTop && containerTop < viewportBottom) {
      // Container is in viewport
      const visibleTop = Math.max(containerTop, viewportTop);
      const visibleBottom = Math.min(containerBottom, viewportBottom);
      const visibleHeight = visibleBottom - visibleTop;
      scrollProgress = (viewportTop - containerTop + visibleHeight / 2) / (windowHeight + containerHeight);
    } else if (containerTop >= viewportBottom) {
      // Container is below viewport
      scrollProgress = 0;
    } else {
      // Container is above viewport
      scrollProgress = 1;
    }

    // Map scroll progress to vertical movement within white space
    // Move from -30px (up) to +30px (down) as you scroll
    const maxMovement = 30; // pixels of movement within white space
    const translateY = (scrollProgress - 0.5) * 2 * maxMovement;

    // Optional: Keep some rotation for 3D effect
    const scrollRotateX = (scrollProgress - 0.5) * 5;

    // Combine scroll and mouse effects
    const finalRotateX = currentRotateX + scrollRotateX * 0.2;
    const finalRotateY = currentRotateY;

    // Apply transform with vertical movement within container
    globeImage.style.transform = `perspective(1000px) rotateX(${finalRotateX}deg) rotateY(${finalRotateY}deg) translateY(${translateY}px) translateZ(0)`;
  }

  // Smooth animation loop
  function animate(): void {
    // Smooth interpolation for mouse-based rotation
    currentRotateX += (targetRotateX - currentRotateX) * 0.1;
    currentRotateY += (targetRotateY - currentRotateY) * 0.1;

    handleScroll();
    requestAnimationFrame(animate);
  }

  // Start animation
  animate();

  // Update on scroll
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// Contact Form Functionality
function initContactForm(): void {
  const contactForm = document.getElementById('contact-form') as HTMLFormElement;
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e: Event) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const formObject: Record<string, string> = {};
    formData.forEach((value, key) => {
      formObject[key] = value.toString();
    });

    // Show success message (in a real app, this would send to a server)
    const submitBtn = contactForm.querySelector('.submit-btn') as HTMLButtonElement;
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-check"></i> Submitted!';
    submitBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    submitBtn.disabled = true;

    // Reset form after 2 seconds
    setTimeout(() => {
      contactForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;

      // Show alert (in production, this would be a proper notification)
      alert('Thank you for your message! We will get back to you soon.');
    }, 2000);

    // In a real application, you would send the data to a server:
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formObject)
    // })
    // .then(response => response.json())
    // .then(data => {
    //   // Handle success
    // })
    // .catch(error => {
    //   // Handle error
    // });
  });
}

// Initialize Admin Integration
function initAdminIntegration(): void {
  // Load admin data from localStorage
  function loadAdminData(): void {
    // Gallery photos
    const galleryPhotos = localStorage.getItem('nsm_gallery_photos');
    if (galleryPhotos) {
      const galleries = JSON.parse(galleryPhotos);
      const photosByYear: Record<number, string[]> = {};
      galleries.forEach((gallery: any) => {
        if (!photosByYear[gallery.year]) {
          photosByYear[gallery.year] = [];
        }
        photosByYear[gallery.year].push(...gallery.photos.map((p: any) => p.url));
      });
      (window as any).adminGalleryPhotos = photosByYear;
    }

    // Chapter photos
    const chapterPhotos = localStorage.getItem('nsm_chapter_photos');
    if (chapterPhotos) {
      const chapters = JSON.parse(chapterPhotos);
      const photosByChapter: Record<string, Record<number, string[]>> = {};
      chapters.forEach((chapter: any) => {
        if (!photosByChapter[chapter.chapterType]) {
          photosByChapter[chapter.chapterType] = {};
        }
        if (!photosByChapter[chapter.chapterType][chapter.year]) {
          photosByChapter[chapter.chapterType][chapter.year] = [];
        }
        photosByChapter[chapter.chapterType][chapter.year].push(...chapter.photos.map((p: any) => p.url));
      });
      (window as any).adminChapterPhotos = photosByChapter;
    }

    // Reunion photos
    const reunionPhotos = localStorage.getItem('nsm_reunion_photos');
    if (reunionPhotos) {
      const reunions = JSON.parse(reunionPhotos);
      const photosByYear: Record<number, string[]> = {};
      reunions.forEach((reunion: any) => {
        if (!photosByYear[reunion.year]) {
          photosByYear[reunion.year] = [];
        }
        photosByYear[reunion.year].push(...reunion.photos.map((p: any) => p.url));
      });
      (window as any).adminReunionPhotos = photosByYear;
    }
  }

  // Load footer events from localStorage
  function loadFooterEvents(): void {
    const footerEvents = localStorage.getItem('nsm_footer_events');
    if (footerEvents) {
      try {
        const events = JSON.parse(footerEvents);

        // Update upcoming event
        if (events.upcoming) {
          const upcoming = events.upcoming;
          const upcomingMonthEl = document.getElementById('footer-upcoming-month');
          const upcomingDayEl = document.getElementById('footer-upcoming-day');
          const upcomingYearEl = document.getElementById('footer-upcoming-year');
          const upcomingTitleEl = document.getElementById('footer-upcoming-title-text');

          if (upcomingMonthEl && upcoming.month) upcomingMonthEl.textContent = upcoming.month.toUpperCase();
          if (upcomingDayEl && upcoming.day) upcomingDayEl.textContent = upcoming.day;
          if (upcomingYearEl && upcoming.year) upcomingYearEl.textContent = upcoming.year;
          if (upcomingTitleEl && upcoming.title) upcomingTitleEl.textContent = upcoming.title;
        }

        // Update past event
        if (events.past) {
          const past = events.past;
          const pastMonthEl = document.getElementById('footer-past-month');
          const pastDayEl = document.getElementById('footer-past-day');
          const pastYearEl = document.getElementById('footer-past-year');
          const pastTitleEl = document.getElementById('footer-past-title-text');

          if (pastMonthEl && past.month) pastMonthEl.textContent = past.month.toUpperCase();
          if (pastDayEl && past.day) pastDayEl.textContent = past.day;
          if (pastYearEl && past.year) pastYearEl.textContent = past.year;
          if (pastTitleEl && past.title) pastTitleEl.textContent = past.title;
        }
      } catch (e) {
        console.error('Error loading footer events:', e);
      }
    }
  }

  loadAdminData();

  // Load footer events
  loadFooterEvents();

  // Update hero section
  const heroTitle = document.getElementById('hero-title');
  const heroQuote = document.querySelector('.hero-quote');
  const adminHeroTitle = localStorage.getItem('nsm_hero_title');
  const adminHeroQuote = localStorage.getItem('nsm_hero_quote');
  if (adminHeroTitle && heroTitle) {
    heroTitle.textContent = adminHeroTitle;
  }
  if (adminHeroQuote && heroQuote) {
    heroQuote.textContent = adminHeroQuote;
  }

  // Display latest updates
  function displayLatestUpdates(): void {
    const updates = localStorage.getItem('nsm_updates');
    if (!updates) return;

    const updatesList = JSON.parse(updates);
    if (updatesList.length === 0) return;

    const sortedUpdates = updatesList.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const homePage = document.getElementById('page-home');
    if (!homePage) return;

    let updatesSection = document.getElementById('admin-updates-section');
    if (!updatesSection) {
      const leftColumn = homePage.querySelector('.home-left-column');
      if (leftColumn) {
        updatesSection = document.createElement('div');
        updatesSection.id = 'admin-updates-section';
        updatesSection.className = 'home-info-box admin-updates-box';
        const eventsBox = leftColumn.querySelector('.nsm-events-box');
        if (eventsBox && eventsBox.nextSibling) {
          leftColumn.insertBefore(updatesSection, eventsBox.nextSibling);
        } else {
          leftColumn.appendChild(updatesSection);
        }
      }
    }

    if (updatesSection) {
      const displayUpdates = sortedUpdates.slice(0, 5);
      updatesSection.innerHTML = `
        <h3 class="home-info-heading">
          <i class="fas fa-bullhorn"></i>
          Latest Updates
        </h3>
        <div class="admin-updates-list">
          ${displayUpdates.map((update: any) => `
            <div class="admin-update-item">
              <div class="update-date">${new Date(update.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              <h4 class="update-title">${update.title}</h4>
              <p class="update-content">${update.content.substring(0, 100)}${update.content.length > 100 ? '...' : ''}</p>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  // Display event photos
  function displayEventPhotos(): void {
    const eventPhotos = localStorage.getItem('nsm_event_photos');
    if (!eventPhotos) return;

    const eventsList = JSON.parse(eventPhotos);
    if (eventsList.length === 0) return;

    const sortedEvents = eventsList.sort((a: any, b: any) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
    const eventsContainer = document.querySelector('.events-photos-container');
    if (!eventsContainer) return;

    const latestEvent = sortedEvents[0];
    if (latestEvent.photos && latestEvent.photos.length > 0) {
      const slides = eventsContainer.querySelectorAll('.event-photo-slide img');
      latestEvent.photos.slice(0, Math.min(slides.length, latestEvent.photos.length)).forEach((photo: any, index: number) => {
        if (slides[index]) {
          (slides[index] as HTMLImageElement).src = photo.url;
          (slides[index] as HTMLImageElement).alt = latestEvent.eventName;
        }
      });
    }
  }

  displayLatestUpdates();
  displayEventPhotos();

  // Update photo counts when admin data loads
  const updatePhotoCountsFunction = (window as any).updatePhotoCounts;
  if (typeof updatePhotoCountsFunction === 'function') {
    setTimeout(updatePhotoCountsFunction, 100);
  }

  // Re-run when home page becomes visible
  const observer = new MutationObserver(() => {
    const homePage = document.getElementById('page-home');
    if (homePage && homePage.classList.contains('visible')) {
      loadAdminData();
      displayLatestUpdates();
      displayEventPhotos();
      // Update photo counts after admin data loads
      const updateFn = (window as any).updatePhotoCounts;
      if (typeof updateFn === 'function') {
        setTimeout(updateFn, 100);
      }
    }
  });

  // Update photo counts when gallery page becomes visible
  const galleryObserver = new MutationObserver(() => {
    const galleryPage = document.getElementById('page-gallery');
    if (galleryPage && galleryPage.classList.contains('visible')) {
      // Re-initialize photo gallery to update counts
      setTimeout(() => {
        const photoGallerySection = document.getElementById('photo-gallery-section');
        if (photoGallerySection && photoGallerySection.classList.contains('active')) {
          // Call updatePhotoCounts if available globally
          const updateFunction = (window as any).updatePhotoCounts;
          if (typeof updateFunction === 'function') {
            updateFunction();
          }
        }
      }, 100);
    }
  });

  const pageContent = document.querySelector('.page-content');
  if (pageContent) {
    observer.observe(pageContent, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true,
    });

    galleryObserver.observe(pageContent, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true,
    });
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAdminIntegration();
    initApp();
    initGalleryTabs();
    initReunionTabs();
    initConnectTabs();
    initChapterTabs();
    initYearPhotoGallery();
    initYearVideoGallery();
    initYearChapterGallery();
    initYearNostalgiaGallery();
    initYearShopGallery();
    initYearReunionGallery();
    initContactForm();
    initGlobe3DEffect();
    initSchoolPhotosGallery();
    initPPTGallery();
  });
} else {
  initAdminIntegration();
  initApp();
  initGalleryTabs();
  initReunionTabs();
  initConnectTabs();
  initChapterTabs();
  initYearPhotoGallery();
  initYearVideoGallery();
  initYearChapterGallery();
  initYearNostalgiaGallery();
  initYearShopGallery();
  initYearReunionGallery();
  initContactForm();
  initMemberPage();
  initFAQPage();
  initHomeGallerySlider();
  initGlobe3DEffect();
  initEventsTabs();
  initSchoolPhotosGallery();
  initPPTGallery();
}

// Initialize Events Tabs
function initEventsTabs(): void {
  // Support both old and new tab classes
  const eventTabBtns = document.querySelectorAll<HTMLButtonElement>('.event-tab-modern, .event-tab-btn');
  const eventSections = document.querySelectorAll<HTMLElement>('.events-section');

  eventTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const eventType = btn.getAttribute('data-event-type');

      // Update active tab
      eventTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Show corresponding section
      eventSections.forEach((section) => {
        section.classList.remove('active');
        if (section.id === `${eventType}-events-section`) {
          section.classList.add('active');
        }
      });
    });
  });
}

// Initialize Home Gallery Slider
function initHomeGallerySlider(): void {
  const galleryContainer = document.querySelector('.gallery-slider-container');
  if (!galleryContainer) return;

  const galleryWrapper = galleryContainer.querySelector<HTMLElement>('.gallery-slider-wrapper');
  const gallerySlides = galleryContainer.querySelectorAll<HTMLElement>('.gallery-slide');
  const galleryDots = galleryContainer.querySelectorAll<HTMLElement>('.gallery-dot');
  const prevBtn = galleryContainer.querySelector<HTMLElement>('.gallery-prev');
  const nextBtn = galleryContainer.querySelector<HTMLElement>('.gallery-next');

  if (!galleryWrapper || gallerySlides.length === 0) return;

  let currentSlide = 0;
  let sliderInterval: number | null = null;

  function showSlide(index: number): void {
    // Update active slide
    gallerySlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    // Update active dot
    galleryDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Move wrapper
    if (galleryWrapper) {
      galleryWrapper.style.transform = `translateX(-${index * 100}%)`;
    }

    currentSlide = index;
  }

  function nextSlide(): void {
    const nextIndex = (currentSlide + 1) % gallerySlides.length;
    showSlide(nextIndex);
  }

  function prevSlide(): void {
    const prevIndex = (currentSlide - 1 + gallerySlides.length) % gallerySlides.length;
    showSlide(prevIndex);
  }

  function startAutoSlide(): void {
    if (sliderInterval !== null) {
      clearInterval(sliderInterval);
    }
    sliderInterval = window.setInterval(nextSlide, 4000);
  }

  function stopAutoSlide(): void {
    if (sliderInterval !== null) {
      clearInterval(sliderInterval);
      sliderInterval = null;
    }
  }

  // Initialize first slide
  showSlide(0);
  startAutoSlide();

  // Navigation buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAutoSlide();
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAutoSlide();
      startAutoSlide();
    });
  }

  // Dot navigation
  galleryDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      stopAutoSlide();
      startAutoSlide();
    });
  });

  // Pause on hover
  galleryContainer.addEventListener('mouseenter', stopAutoSlide);
  galleryContainer.addEventListener('mouseleave', startAutoSlide);
}

// Initialize Member Page
function initMemberPage(): void {
  // Member registration form
  const memberForm = document.getElementById('member-registration-form') as HTMLFormElement | null;

  function showMemberPaymentSection(): void {
    const paymentSection = document.getElementById('member-payment-section');
    if (paymentSection) {
      paymentSection.style.display = 'block';
      paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update QR code with fixed amount
      const qrCodeImg = document.getElementById('member-qr-code') as HTMLImageElement | null;
      if (qrCodeImg) {
        qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=UPI:nsmalumni@paytm?am=5000&tn=NSMOSA%20Membership%20Fee`;
      }
    }
  }

  if (memberForm) {
    memberForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showMemberPaymentSection();
    });
  }

  // Payment method tabs
  const paymentTabBtns = document.querySelectorAll<HTMLButtonElement>('.payment-tab-btn');
  const bankPaymentDetails = document.getElementById('bank-payment-details');
  const razorpayPaymentDetails = document.getElementById('razorpay-payment-details');

  paymentTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const method = btn.getAttribute('data-payment-method');

      paymentTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      if (method === 'bank') {
        bankPaymentDetails?.classList.add('active');
        razorpayPaymentDetails?.classList.remove('active');
      } else {
        razorpayPaymentDetails?.classList.add('active');
        bankPaymentDetails?.classList.remove('active');
      }
    });
  });

  // Payment confirmation
  const confirmBankPaymentBtn = document.getElementById('confirm-member-bank-payment');
  const razorpayPayBtn = document.getElementById('razorpay-member-pay-btn');
  const memberPaymentSuccessSection = document.getElementById('member-payment-success-section');

  function showMemberPaymentSuccess(transactionId: string, method: string): void {
    if (!memberPaymentSuccessSection) return;

    // Hide payment details
    if (bankPaymentDetails) bankPaymentDetails.classList.remove('active');
    if (razorpayPaymentDetails) razorpayPaymentDetails.classList.remove('active');

    // Update success section details
    const txnIdEl = document.getElementById('member-payment-success-txn-id');
    const amountEl = document.getElementById('member-payment-success-amount');
    const amount = '5000';

    if (txnIdEl) txnIdEl.textContent = transactionId;
    if (amountEl) amountEl.textContent = '₹5,000';

    // Store transaction details for receipt
    memberPaymentSuccessSection.dataset.transactionId = transactionId;
    memberPaymentSuccessSection.dataset.amount = amount;
    memberPaymentSuccessSection.dataset.method = method;

    // Track membership registration
    const memberForm = document.getElementById('member-registration-form') as HTMLFormElement | null;
    let memberName = 'Member';
    let memberEmail = '';

    if (memberForm) {
      const formData = new FormData(memberForm);
      memberName = (formData.get('name') || 'Member').toString();
      memberEmail = (formData.get('email') || '').toString();
    }

    const memberships = JSON.parse(localStorage.getItem('nsm_memberships') || '[]');
    memberships.push({
      id: Date.now().toString(),
      name: memberName,
      email: memberEmail,
      amount: amount,
      method: method,
      transactionId: transactionId,
      timestamp: Date.now()
    });
    localStorage.setItem('nsm_memberships', JSON.stringify(memberships));

    // Show success section
    memberPaymentSuccessSection.style.display = 'block';
    memberPaymentSuccessSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Download Receipt Functionality for Membership
  const memberDownloadReceiptBtn = document.getElementById('member-download-receipt-btn');

  function downloadMemberReceipt(): void {
    if (!memberPaymentSuccessSection) return;

    const transactionId = memberPaymentSuccessSection.dataset.transactionId || 'TXN' + Date.now();
    const method = memberPaymentSuccessSection.dataset.method || 'Payment';

    // Get member details from form
    const memberForm = document.getElementById('member-registration-form') as HTMLFormElement | null;
    let memberName = 'Member';
    let memberEmail = '';

    if (memberForm) {
      const formData = new FormData(memberForm);
      const name = formData.get('name') || '';
      memberName = name.toString().trim() || 'Member';
      memberEmail = (formData.get('email') || '').toString();
    }

    // Create receipt HTML
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Membership Receipt - NSMOSA</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 3px solid #00274d; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 32px; font-weight: bold; color: #00274d; margin-bottom: 10px; }
          .title { font-size: 24px; color: #333; margin: 10px 0; }
          .receipt-details { background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #ddd; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #666; }
          .value { font-weight: 700; color: #333; }
          .success-badge { background: #28a745; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">NSMOSA</div>
          <div class="title">Membership Registration</div>
          <div class="success-badge">✓ Registration Successful</div>
        </div>
        
        <h2 style="color: #00274d; margin-bottom: 20px;">Membership Receipt</h2>
        
        <div class="receipt-details">
          <div class="detail-row">
            <span class="label">Transaction ID:</span>
            <span class="value">${transactionId}</span>
          </div>
          <div class="detail-row">
            <span class="label">Date:</span>
            <span class="value">${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div class="detail-row">
            <span class="label">Time:</span>
            <span class="value">${new Date().toLocaleTimeString('en-IN')}</span>
          </div>
          <div class="detail-row">
            <span class="label">Member Name:</span>
            <span class="value">${memberName}</span>
          </div>
          ${memberEmail ? `<div class="detail-row">
            <span class="label">Email:</span>
            <span class="value">${memberEmail}</span>
          </div>` : ''}
          <div class="detail-row">
            <span class="label">Payment Method:</span>
            <span class="value">${method}</span>
          </div>
          <div class="detail-row">
            <span class="label">Registration Fee:</span>
            <span class="value">₹5,000</span>
          </div>
        </div>
        
        <div class="footer">
          <p>This is a computer-generated receipt. No signature is required.</p>
          <p>For any queries, please contact: nsmalumni@example.com</p>
          <p style="margin-top: 20px;">Welcome to NSMOSA! Thank you for joining us.</p>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NSMOSA_Membership_Receipt_${transactionId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (memberDownloadReceiptBtn) {
    memberDownloadReceiptBtn.addEventListener('click', downloadMemberReceipt);
  }

  if (confirmBankPaymentBtn) {
    confirmBankPaymentBtn.addEventListener('click', () => {
      if (confirm('Have you completed the bank transfer/UPI payment?')) {
        const transactionId = 'TXN' + Date.now();
        showMemberPaymentSuccess(transactionId, 'Bank Transfer / UPI');
      }
    });
  }

  if (razorpayPayBtn) {
    razorpayPayBtn.addEventListener('click', () => {
      const amount = '5000';
      const amountInPaise = Math.round(parseFloat(amount) * 100);

      // Razorpay Key - Replace with your actual Razorpay key
      const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID'; // TODO: Add your Razorpay Key ID here

      // Check if Razorpay is loaded
      if (typeof (window as any).Razorpay === 'undefined') {
        alert('Razorpay SDK is not loaded. Please check your internet connection.');
        return;
      }

      // If key is not set, show alert and use simulation
      if (RAZORPAY_KEY_ID === 'YOUR_RAZORPAY_KEY_ID') {
        if (confirm(`Razorpay key not configured. Simulating payment of ₹5,000?`)) {
          setTimeout(() => {
            const transactionId = 'RZP' + Date.now();
            showMemberPaymentSuccess(transactionId, 'Razorpay');
          }, 1500);
        }
        return;
      }

      // Initialize Razorpay checkout
      const Razorpay = (window as any).Razorpay;
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: 'INR',
        name: 'NSMOSA',
        description: 'Membership Registration Fee',
        handler: function (response: any) {
          const transactionId = response.razorpay_payment_id || 'RZP' + Date.now();
          showMemberPaymentSuccess(transactionId, 'Razorpay');
        },
        theme: {
          color: '#ff6b9d'
        }
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    });
  }
}

// Initialize FAQ Page
function initFAQPage(): void {
  // FAQ Accordion
  const faqItems = document.querySelectorAll<HTMLElement>('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector<HTMLElement>('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items
        faqItems.forEach((i) => i.classList.remove('active'));

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // FAQ Search
  const faqSearchInput = document.getElementById('faq-search') as HTMLInputElement | null;
  const faqCategoryBtns = document.querySelectorAll<HTMLButtonElement>('.faq-category-btn');
  const faqNoResults = document.querySelector<HTMLElement>('.faq-no-results');

  function filterFAQs(searchTerm: string = '', category: string = 'all'): void {
    let visibleCount = 0;

    faqItems.forEach((item) => {
      const question = item.querySelector('h3')?.textContent?.toLowerCase() || '';
      const answer = item.querySelector('p')?.textContent?.toLowerCase() || '';
      const itemCategory = item.getAttribute('data-category') || '';

      const matchesSearch = !searchTerm || question.includes(searchTerm) || answer.includes(searchTerm);
      const matchesCategory = category === 'all' || itemCategory === category;

      if (matchesSearch && matchesCategory) {
        item.style.display = 'block';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (faqNoResults) {
      faqNoResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', (e) => {
      const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
      const activeCategory = document.querySelector<HTMLButtonElement>('.faq-category-btn.active')?.getAttribute('data-category') || 'all';
      filterFAQs(searchTerm, activeCategory);
    });
  }

  faqCategoryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      faqCategoryBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category') || 'all';
      const searchTerm = faqSearchInput?.value.toLowerCase() || '';
      filterFAQs(searchTerm, category);
    });
  });
}




