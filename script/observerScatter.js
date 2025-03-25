// observer.js
const debug = true;
const threshold = 0.9;
const observerScatter = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      window.createScatterChart();
      if (debug) console.log('Scatter chart created');
      // Add the 'visible' class to trigger the fade-in
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: threshold });

// Observe each canvas (run once DOM is ready; or simply place this script below the canvases)
observerScatter.observe(document.getElementById('scatter-chart'));