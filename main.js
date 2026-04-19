// Cinematic Observer to handle elegant fade-in/blur reveals
const slides = document.querySelectorAll('.slide-content');

// Intersection Observer configuration tailored for scroll-snapping 100vh slides
const observerOptions = {
  root: document.getElementById('narrative-scroll'),
  rootMargin: '0px',
  // Threshold determines when the animation triggers.
  // 0.4 means once 40% of the slide is visible, it snaps to full opacity.
  threshold: 0.4 
};

const observerCallback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    } else {
      // Re-hide gently if they scroll away to allow the reveal to happen multiple times flawlessly
      entry.target.classList.remove('is-visible');
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
slides.forEach(slide => observer.observe(slide));


// Elegant Progress Indicator Logic
const scrollContainer = document.getElementById('narrative-scroll');
const progressIndicator = document.getElementById('progress-indicator');

scrollContainer.addEventListener('scroll', () => {
    // Calculate total scrollable height exactly
    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    // Current scroll position relative to container
    const currentScroll = scrollContainer.scrollTop;
    
    // Calculate Percentage
    let progress = 0;
    if (maxScroll > 0) {
        progress = (currentScroll / maxScroll) * 100;
    }
    
    // Update CSS variables for bidirectional responsive scaling on mobile
    progressIndicator.style.setProperty('--p', `${progress}%`);
    
    // Make elegant vector flowers grow sequentially based on scroll depth
    let growthFactor = maxScroll > 0 ? currentScroll / maxScroll : 0;
    
    document.querySelectorAll('.flower').forEach(flower => {
        let offset = parseFloat(flower.style.getPropertyValue('--growth-offset') || 0);
        // Grow sharply after passing their offset percentage
        let amount = Math.max(0, (growthFactor - offset) * 3);
        amount = Math.min(1, amount); // clamp fully grown to 1 
        flower.style.setProperty('--flower-growth', amount);
    });
});

// Cursor Ripple Gradient Tracker
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  
  document.documentElement.style.setProperty('--mouse-x', `${x}%`);
  document.documentElement.style.setProperty('--mouse-y', `${y}%`);
});

// ------------------------------------------
// MODULE 1: Live Data Fetcher Simulation
// ------------------------------------------
const fetchBtn = document.getElementById('fetch-data-btn');
const dataResultBox = document.getElementById('data-result-box');
const dataStatus = document.getElementById('data-status');
const liveCounterVal = document.getElementById('live-counter-val');

if (fetchBtn) {
    fetchBtn.addEventListener('click', () => {
        fetchBtn.disabled = true;
        fetchBtn.style.opacity = '0.5';
        fetchBtn.innerText = 'Querying Observatories...';
        dataResultBox.style.display = 'block';
        
        let glitchInt = setInterval(() => {
            dataStatus.innerText = "Connecting to Geneva Nodes... " + Math.random().toString(36).substring(2,8).toUpperCase();
        }, 100);

        setTimeout(() => {
            clearInterval(glitchInt);
            dataStatus.innerText = "DATA ACQUIRED. SOURCE: WHO/HRW";
            fetchBtn.style.display = 'none';
            
            let targetCount = 724;
            let currentCount = 0;
            let countInt = setInterval(() => {
                currentCount += 15;
                if(currentCount >= targetCount) {
                    currentCount = targetCount;
                    clearInterval(countInt);
                }
                liveCounterVal.innerText = currentCount + "+";
            }, 30);
            
        }, 2000);
    });
}

// ------------------------------------------
// MODULE 4: Image Comparison Slider Logic
// ------------------------------------------
const compareWidget = document.getElementById('compare-widget');
const compareOverlay = document.getElementById('compare-overlay');
const compareHandle = document.getElementById('compare-handle');
const compareImgBefore = document.getElementById('compare-img-before');

if (compareWidget) {
    let isDragging = false;

    const resizeImage = () => {
        compareImgBefore.style.width = compareWidget.offsetWidth + 'px';
    };
    window.addEventListener('resize', resizeImage);
    setTimeout(resizeImage, 100);

    const slideMove = (e) => {
        if (!isDragging) return;
        
        let rect = compareWidget.getBoundingClientRect();
        let x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        
        let percent = (x / rect.width) * 100;
        
        compareOverlay.style.width = percent + '%';
        compareHandle.style.left = percent + '%';
    };

    compareWidget.addEventListener('mousedown', () => isDragging = true);
    compareWidget.addEventListener('touchstart', (e) => isDragging = true, {passive: true});
    
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('touchend', () => isDragging = false);
    
    window.addEventListener('mousemove', slideMove);
    window.addEventListener('touchmove', slideMove, {passive: true});
}
