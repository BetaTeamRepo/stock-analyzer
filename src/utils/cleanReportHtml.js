export function extractChartHtml(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
  
    // Remove all head content including styles
    const head = doc.querySelector('head');
    if (head) head.remove();
  
    // Remove all text content elements
    const elementsToRemove = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'div.insights', 'span', 'a',
      'ul', 'ol', 'li', 'table', 'br', 'hr'
    ];
  
    elementsToRemove.forEach(selector => {
      doc.querySelectorAll(selector).forEach(el => el.remove());
    });
  
    // Special handling for visualization containers
    const visualizations = doc.querySelectorAll('.visualization');
    const body = doc.body;
  
    // Clear the entire body
    while (body.firstChild) {
      body.removeChild(body.firstChild);
    }
  
    // Add back only visualization containers
    visualizations.forEach(viz => {
      body.appendChild(viz);
    });
  
    // Clean up any empty parent elements
    const walker = document.createTreeWalker(
      body,
      NodeFilter.SHOW_ELEMENT,
      { acceptNode: (node) => 
        node.childNodes.length === 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP 
      },
      false
    );
  
    let node;
    while (node = walker.nextNode()) {
      node.remove();
    }
  
    return body.innerHTML;
  }