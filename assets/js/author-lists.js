(function() {
  var animationTimers = new WeakMap();

  function makeAuthorNode(html) {
    var span = document.createElement('span');
    span.className = 'author';
    span.innerHTML = html;
    return span;
  }

  function moreAuthorsLabel(count) {
    return count + (count === 1 ? ' more author' : ' more authors');
  }

  function htmlToText(html) {
    var span = document.createElement('span');
    span.innerHTML = html;
    return span.textContent;
  }

  function hiddenAuthorsLabel(authors, visibleCount) {
    return authors.slice(visibleCount).map(htmlToText).join(', ');
  }

  function getLineWidth(list) {
    var container = list.closest('p') || list.parentElement;
    var width = container ? container.getBoundingClientRect().width : 0;
    return Math.max(width - 1, 0);
  }

  function appendAuthorText(target, authors, visibleCount, toggleText) {
    for (var i = 0; i < visibleCount; i += 1) {
      if (i > 0) {
        target.appendChild(document.createTextNode(', '));
      }
      target.appendChild(makeAuthorNode(authors[i]));
    }

    if (toggleText) {
      if (visibleCount > 0) {
        target.appendChild(document.createTextNode(', '));
      }

      var toggle = document.createElement('span');
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('tabindex', '0');
      toggle.className = 'author-toggle';
      toggle.textContent = toggleText;
      target.appendChild(toggle);
      return toggle;
    }

    return null;
  }

  function measureAuthorList(list, authors, visibleCount, toggleText) {
    var measurer = document.createElement('span');
    measurer.className = 'author-list author-list-ready';
    measurer.style.position = 'absolute';
    measurer.style.left = '-99999px';
    measurer.style.top = '0';
    measurer.style.visibility = 'hidden';
    measurer.style.whiteSpace = 'nowrap';
    measurer.style.pointerEvents = 'none';

    appendAuthorText(measurer, authors, visibleCount, toggleText);
    (list.parentElement || document.body).appendChild(measurer);
    var width = measurer.getBoundingClientRect().width;
    measurer.parentNode.removeChild(measurer);

    return width;
  }

  function computeVisibleCount(list, authors) {
    var lineWidth = getLineWidth(list);
    if (lineWidth === 0) {
      return authors.length;
    }

    if (measureAuthorList(list, authors, authors.length, '') <= lineWidth) {
      return authors.length;
    }

    for (var visibleCount = authors.length - 1; visibleCount >= 1; visibleCount -= 1) {
      var hiddenCount = authors.length - visibleCount;
      if (measureAuthorList(list, authors, visibleCount, moreAuthorsLabel(hiddenCount)) <= lineWidth) {
        return visibleCount;
      }
    }

    return 1;
  }

  function animateButtonText(button, text) {
    var existingTimer = animationTimers.get(button);
    if (existingTimer) {
      window.clearInterval(existingTimer);
    }

    var cursorPosition = 0;
    button.textContent = '';

    var timer = window.setInterval(function() {
      button.textContent = text.substring(0, cursorPosition + 1);
      cursorPosition += 1;

      if (cursorPosition >= text.length) {
        window.clearInterval(timer);
        animationTimers.delete(button);
      }
    }, 10);

    animationTimers.set(button, timer);
  }

  function renderAuthorList(list, authors, visibleCount, expanded, animate) {
    list.innerHTML = '';

    if (visibleCount >= authors.length) {
      appendAuthorText(list, authors, authors.length, '');
      list.dataset.expanded = 'false';
      return;
    }

    var hiddenCount = authors.length - visibleCount;
    var collapsedText = moreAuthorsLabel(hiddenCount);
    var expandedText = hiddenAuthorsLabel(authors, visibleCount);
    var toggleText = expanded ? expandedText : collapsedText;
    var toggle = appendAuthorText(list, authors, visibleCount, toggleText);

    list.dataset.expanded = expanded ? 'true' : 'false';
    list.dataset.visibleCount = String(visibleCount);
    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    var toggleExpanded = function() {
      var nextExpanded = list.dataset.expanded !== 'true';
      list.dataset.expanded = nextExpanded ? 'true' : 'false';
      toggle.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
      animateButtonText(toggle, nextExpanded ? expandedText : collapsedText);
    };

    toggle.addEventListener('click', toggleExpanded);
    toggle.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleExpanded();
      }
    });

    if (animate) {
      animateButtonText(toggle, toggleText);
    }
  }

  function setupAuthorList(list) {
    if (!list.dataset.authors) {
      var authorNodes = Array.prototype.slice.call(list.querySelectorAll('.author'));
      list.dataset.authors = JSON.stringify(authorNodes.map(function(author) {
        return author.innerHTML;
      }));
    }

    var authors = JSON.parse(list.dataset.authors || '[]');
    if (authors.length === 0) {
      return;
    }

    list.classList.add('author-list-ready');

    var visibleCount = computeVisibleCount(list, authors);
    var expanded = list.dataset.expanded === 'true';
    renderAuthorList(list, authors, visibleCount, expanded, false);
  }

  function setupAuthorLists() {
    Array.prototype.slice.call(document.querySelectorAll('.author-list')).forEach(setupAuthorList);
  }

  function debounce(fn, delay) {
    var timeout;
    return function() {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(fn, delay);
    };
  }

  document.addEventListener('DOMContentLoaded', setupAuthorLists);
  window.addEventListener('load', setupAuthorLists);
  window.addEventListener('resize', debounce(setupAuthorLists, 150));
  window.addEventListener('orientationchange', setupAuthorLists);
}());
