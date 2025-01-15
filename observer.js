// observer.js
const debug = true;
const threshold = 0.9;
const observerLine = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        window.createLineChart();
        if (debug) console.log('Line chart created');
        // Add the 'visible' class to trigger the fade-in
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: threshold });
  
  const observerBar = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        window.createBarChart();
        if (debug) console.log('Bar chart created');
        // Add the 'visible' class to trigger the fade-in
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: threshold });
  
  // Observe each canvas (run once DOM is ready; or simply place this script below the canvases)
  observerLine.observe(document.getElementById('line-chart'));
  observerBar.observe(document.getElementById('bar-chart'));