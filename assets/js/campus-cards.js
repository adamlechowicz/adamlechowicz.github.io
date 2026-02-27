$(function() {
  if ($(window).width() < 768) return;

  var $wrapper = $('#campus-stack-wrapper');
  if (!$wrapper.length) return;

  var $mainCard = $('#campus-main-card');
  var $pastBtn = $('#campus-past-btn');
  var $pastCards = $wrapper.find('.past-card');
  var $allTooltips = $wrapper.find('.campus-card-tooltip');

  // Inject page darkener overlay
  var $overlay = $('<div class="campus-page-overlay"></div>').appendTo('body');

  var isExpanded = false;
  var hoverTimer;
  var tooltipTimer;
  var $activeCard = null;  // card whose tooltip is currently shown

  // ── Tooltip helpers ───────────────────────────────────────────────────
  function showTooltip($card) {
    clearTimeout(tooltipTimer);
    // If switching cards, immediately clean up the old one
    if ($activeCard && !$activeCard.is($card)) {
      $activeCard.find('.campus-card-tooltip').removeClass('is-visible');
      $activeCard.css('z-index', '');
    }
    $activeCard = $card;
    $card.find('.campus-card-tooltip').addClass('is-visible');
  }

  function scheduleHideTooltip($card, delay) {
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(function() {
      $card.find('.campus-card-tooltip').removeClass('is-visible');
      $card.css('z-index', '');
      if ($activeCard && $activeCard.is($card)) $activeCard = null;
    }, delay !== undefined ? delay : 220);
  }

  // Tooltip link clicks: open in new tab only, stop bubbling to card handler.
  $allTooltips.find('a').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.open($(this).attr('href'), '_blank');
  });

  // Keep tooltip alive when mouse slides from card edge onto the tooltip.
  // On leave, schedule hide via the tracked active card.
  $allTooltips.on('mouseenter', function() {
    clearTimeout(tooltipTimer);
  }).on('mouseleave', function() {
    if ($activeCard) scheduleHideTooltip($activeCard, 120);
  });

  // ── Grouped hover (main card + past cards + past button) ──────────────
  function onEnter() {
    if (isExpanded) return;
    clearTimeout(hoverTimer);
    $wrapper.addClass('is-hovered');
  }
  function onLeave() {
    hoverTimer = setTimeout(function() {
      if (!isExpanded) $wrapper.removeClass('is-hovered');
    }, 120);
  }
  $mainCard.add($pastCards).add($pastBtn)
    .on('mouseenter', onEnter)
    .on('mouseleave', onLeave);

  // ── Main card click → UMass in new tab ────────────────────────────────
  $mainCard.on('click', function() {
    if (!isExpanded) window.open($(this).data('url'), '_blank');
  });

  // ── Main card tooltip in expanded state ───────────────────────────────
  $mainCard.on('mouseenter', function() {
    if (isExpanded) showTooltip($(this));
  }).on('mouseleave', function() {
    scheduleHideTooltip($(this));
  });

  // ── "past →" click → expand ───────────────────────────────────────────
  $pastBtn.on('click', function(e) {
    e.stopPropagation();
    expand();
  });

  function expand() {
    isExpanded = true;
    $wrapper.addClass('is-expanded').removeClass('is-hovered');
    $overlay.addClass('is-active');

    var cardH = $wrapper.height();
    var gap = -cardH * 0.20;
    var n = $pastCards.length;

    var xOffsets = [10, -12, 8];
    $pastCards.each(function(i) {
      var reverseIndex = n - 1 - i;
      var y = (reverseIndex + 1) * (cardH + gap);
      var x = xOffsets[reverseIndex] || 0;
      $(this).css('transform', 'translateY(' + y + 'px) translateX(' + x + 'px)');
    });
  }

  function collapse() {
    if (!isExpanded) return;
    clearTimeout(tooltipTimer);
    isExpanded = false;
    $activeCard = null;
    $wrapper.removeClass('is-expanded is-hovered');
    $overlay.removeClass('is-active');
    $pastCards.css({ 'transform': '', 'z-index': '' });
    $allTooltips.removeClass('is-visible');
  }

  // ── Past card interactions ────────────────────────────────────────────
  $pastCards.on('click', function(e) {
    e.stopPropagation();
    window.open($(this).data('url'), '_blank');
  });
  $pastCards.on('mouseenter', function() {
    if (isExpanded) {
      showTooltip($(this));
      $(this).css('z-index', 15);
    }
  }).on('mouseleave', function() {
    scheduleHideTooltip($(this));
  });

  // ── Click outside → collapse ─────────────────────────────────────────
  $overlay.on('click', collapse);
  $(document).on('click', function(e) {
    if (!$(e.target).closest('#campus-stack-wrapper').length) collapse();
  });

  // ── Page-load peek animation ──────────────────────────────────────────
  setTimeout(function() {
    if (!isExpanded) {
      $wrapper.addClass('is-peeking');
      setTimeout(function() {
        $wrapper.removeClass('is-peeking');
      }, 1200);
    }
  }, 1200);
});
