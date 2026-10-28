/* The breadcrumb capsule at the top of each page: a back chevron and the trail (Sites › Site › Zone), on glass.
   Drag the capsule to the right, or swipe in from the left edge on a touch screen, and the page slides away to
   the one before it, as on iPhone; let go early and it springs back. Tapping the chevron slides it away too. */
window.Nav = (function(){
  const chev = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19 8 12l7-7"/></svg>';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* o: { el, trail: [{ label, href }], back: { label, href } | { label, run } , beforeLeave } — the last trail item is this page */
  function mount(o){
    const el = o.el; let back = o.back, busy = false;
    el.classList.add('navpill', 'glass'); el.setAttribute('aria-label', 'Breadcrumb');
    el.innerHTML = `<button type="button" class="np-back">${chev}</button><ol class="np-trail"></ol>`;
    const btn = el.querySelector('.np-back'), ol = el.querySelector('.np-trail');
    function set(trail, b){
      back = b;
      ol.innerHTML = trail.map((t, i) => i === trail.length - 1
        ? `<li aria-current="page"><span>${esc(t.label)}</span></li>`
        : `<li><a href="${esc(t.href)}">${esc(t.label)}</a></li>`).join('');
      btn.setAttribute('aria-label', 'Back to ' + b.label); btn.title = 'Back to ' + b.label + ' (or drag to the right)';
    }
    set(o.trail, back);

    /* what shows beneath the page as it slides: the place you're going back to */
    const under = document.createElement('div'); under.className = 'np-under'; under.setAttribute('aria-hidden', 'true');
    const edge = document.createElement('div'); edge.className = 'np-edge';
    document.body.append(edge); document.documentElement.append(under);
    const W = () => innerWidth, body = document.body;
    function show(dx){
      const k = Math.min(1, dx / W());
      body.style.transform = `translate3d(${dx}px,0,0)`;
      under.style.opacity = .35 + k * .65;
      under.firstChild.style.transform = `translate3d(${(k - 1) * 60}px,0,0) scale(${.94 + k * .06})`;
    }
    function begin(){
      under.innerHTML = `<div><span>${chev}</span>${esc(back.label)}</div>`;
      document.documentElement.classList.add('np-sliding'); body.style.transition = 'none';
    }
    function end(){
      document.documentElement.classList.remove('np-sliding'); body.style.transition = body.style.transform = ''; busy = false;
    }
    function settle(to, ms){
      return new Promise(res => {
        body.style.transition = `transform ${ms}ms cubic-bezier(.32,.72,0,1)`; under.style.transition = under.firstChild.style.transition = `all ${ms}ms cubic-bezier(.32,.72,0,1)`;
        requestAnimationFrame(() => { show(to); setTimeout(res, ms); });
      });
    }
    async function go(fromDx){
      if (busy) return; busy = true;
      if (back.run) {                       // going back within this page: spring back, then change view
        if (fromDx) await settle(0, 260); end(); back.run(); return;
      }
      if (o.beforeLeave) o.beforeLeave();
      if (reduced) { location.href = back.href; return; }
      if (!fromDx) { begin(); show(0); }
      await settle(W(), 360); location.href = back.href;
    }
    async function cancel(){ await settle(0, 300); end(); }
    // returning to this page from the browser's back/forward cache: put it back in place
    addEventListener('pageshow', e => { if (e.persisted) { end(); under.style.cssText = ''; } });

    btn.addEventListener('click', () => go(0));

    /* dragging: the capsule (any pointer) or the left edge strip (touch) */
    let drag = null, swallow = false;
    function down(e){
      if (busy || (e.pointerType === 'mouse' && e.button !== 0)) return;
      drag = { x0: e.clientX, y0: e.clientY, id: e.pointerId, t0: performance.now(), dx: 0, live: false, src: e.currentTarget };
    }
    function move(e){
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
      if (!drag.live) {
        if (dx > 8 && dx > Math.abs(dy) * 1.2) { drag.live = true; drag.x0 = e.clientX - 1; begin(); try { drag.src.setPointerCapture(drag.id); } catch (_) {} }
        else if (Math.abs(dy) > 10 || dx < -8) drag = null;
        return;
      }
      drag.dx = Math.max(0, e.clientX - drag.x0);
      drag.v = drag.dx / Math.max(1, performance.now() - drag.t0);
      show(back.run ? drag.dx * .4 : drag.dx);
    }
    function up(e){
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag; drag = null; if (!d.live) return;
      swallow = true; setTimeout(() => swallow = false, 50);       // the drag shouldn't also click the link under it
      const far = back.run ? d.dx > 90 : d.dx > W() * .3, flick = d.dx > 40 && d.v > .45;
      (far || flick) ? go(back.run ? d.dx * .4 : d.dx) : cancel();
    }
    [el, edge].forEach(t => {
      t.addEventListener('pointerdown', down); t.addEventListener('pointermove', move);
      t.addEventListener('pointerup', up); t.addEventListener('pointercancel', up);
    });
    el.addEventListener('click', e => { if (swallow) { e.preventDefault(); e.stopPropagation(); } }, true);
    el.addEventListener('dragstart', e => e.preventDefault());

    return { set, back: () => go(0) };
  }
  return { mount };
})();
