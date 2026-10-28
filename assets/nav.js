/* The top bar: the trail (Sites · Site · Zone · Grave) as an Apple segmented control on glass, with a thumb on the page
   you're on. Tap an earlier segment, or drag the thumb back onto it, and the page slides away to it, as on iPhone.
   On a touch screen a swipe in from the left edge goes back one level. */
window.Nav = (function(){
  const chev = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19 8 12l7-7"/></svg>';
  const home = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5Z"/><path d="M9 4v13.5M15 6.5V20"/></svg>';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubic-bezier(.32,.72,0,1)';

  /* o: { el, trail: [{ label, href } | { label, run }], beforeLeave(item) } — the last item is this page */
  function mount(o){
    const el = o.el; let trail = [], segs = [], busy = false;
    el.classList.add('segnav', 'glass'); el.setAttribute('aria-label', 'Breadcrumb');
    el.innerHTML = '<span class="sn-thumb" aria-hidden="true"></span><ol class="sn-segs"></ol>';
    const thumb = el.querySelector('.sn-thumb'), ol = el.querySelector('.sn-segs');

    function place(i, animate){
      const s = segs[i]; if (!s) return;
      thumb.style.transition = animate ? `transform .45s ${EASE},width .45s ${EASE}` : 'none';
      thumb.style.width = s.offsetWidth + 'px'; thumb.style.transform = `translateX(${s.offsetLeft}px)`;
    }
    function set(t){
      trail = t;
      ol.innerHTML = t.map((x, i) => {
        const cur = i === t.length - 1, inner = i === 0 ? `${home}<span>${esc(x.label)}</span>` : `<span>${esc(x.label)}</span>`;
        return `<li>${cur ? `<span class="sn-seg on" aria-current="page">${inner}</span>`
          : `<a class="sn-seg" href="${esc(x.href || '#')}" data-i="${i}" title="Back to ${esc(x.label)}" draggable="false">${inner}</a>`}</li>`;
      }).join('');
      segs = [...ol.querySelectorAll('.sn-seg')];
      requestAnimationFrame(() => place(segs.length - 1, false));
    }
    set(o.trail);
    addEventListener('resize', () => place(segs.length - 1, false));
    if (document.fonts) document.fonts.ready.then(() => place(segs.length - 1, false));

    /* beneath the page as it slides away: the place you're going to */
    const under = document.createElement('div'); under.className = 'np-under'; under.setAttribute('aria-hidden', 'true');
    const edge = document.createElement('div'); edge.className = 'np-edge';
    document.body.append(edge); document.documentElement.append(under);
    const W = () => innerWidth, body = document.body;
    function slide(dx){
      const k = Math.min(1, dx / W());
      body.style.transform = `translate3d(${dx}px,0,0)`;
      under.style.opacity = .35 + k * .65;
      if (under.firstChild) under.firstChild.style.transform = `translate3d(${(k - 1) * 60}px,0,0) scale(${.94 + k * .06})`;
    }
    function begin(item){
      under.innerHTML = `<div><span>${chev}</span>${esc(item.label)}</div>`;
      document.documentElement.classList.add('np-sliding'); body.style.transition = 'none';
    }
    function end(){ document.documentElement.classList.remove('np-sliding'); body.style.transition = body.style.transform = ''; busy = false; }
    function settle(to, ms){
      return new Promise(res => {
        body.style.transition = `transform ${ms}ms ${EASE}`; under.style.transition = `opacity ${ms}ms ${EASE}`;
        if (under.firstChild) under.firstChild.style.transition = `transform ${ms}ms ${EASE}`;
        requestAnimationFrame(() => { slide(to); setTimeout(res, ms); });
      });
    }
    async function go(i, fromDx){
      const item = trail[i]; if (busy || !item || i === trail.length - 1) return; busy = true;
      place(i, true);
      if (item.run) { if (fromDx) await settle(0, 260); await wait(fromDx ? 0 : 220); end(); item.run(); return; }
      if (o.beforeLeave) o.beforeLeave(item);
      if (reduced) { location.href = item.href; return; }
      if (!fromDx) { await wait(180); begin(item); slide(0); }
      await settle(W(), 380); location.href = item.href;
    }
    const wait = ms => new Promise(r => setTimeout(r, ms));
    // back here from the browser's back/forward cache: everything in place again
    addEventListener('pageshow', e => { if (e.persisted) { end(); under.style.cssText = ''; place(segs.length - 1, false); } });

    /* tap a segment */
    let swallow = false;
    ol.addEventListener('click', e => {
      const a = e.target.closest('a.sn-seg'); if (!a) return;
      if (swallow || !(e.metaKey || e.ctrlKey || e.shiftKey)) e.preventDefault();
      if (!swallow && !(e.metaKey || e.ctrlKey || e.shiftKey)) go(+a.dataset.i, 0);
    });

    /* drag the thumb back along the track; let go over a segment to go there */
    let drag = null;
    el.addEventListener('pointerdown', e => {
      if (busy || (e.pointerType === 'mouse' && e.button !== 0)) return;
      const cur = segs[segs.length - 1], r = el.getBoundingClientRect(), x = e.clientX - r.left;
      if (x < cur.offsetLeft - 4) return;            // grabbing starts on the thumb; elsewhere is a tap
      drag = { x0: e.clientX, id: e.pointerId, left0: cur.offsetLeft, live: false };
    });
    el.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x0;
      if (!drag.live) { if (Math.abs(dx) < 6) return; drag.live = true; el.classList.add('dragging'); try { el.setPointerCapture(drag.id); } catch (_) {} }
      const cur = segs[segs.length - 1], left = Math.min(drag.left0, Math.max(segs[0].offsetLeft, drag.left0 + dx));
      thumb.style.transition = 'none'; thumb.style.transform = `translateX(${left}px)`;
      const mid = left + cur.offsetWidth / 2, near = nearest(mid);
      segs.forEach((s, k) => s.classList.toggle('near', k === near && k !== segs.length - 1));
    });
    const nearest = x => segs.reduce((b, s, k) => Math.abs(s.offsetLeft + s.offsetWidth / 2 - x) < Math.abs(segs[b].offsetLeft + segs[b].offsetWidth / 2 - x) ? k : b, 0);
    function drop(e){
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag; drag = null; el.classList.remove('dragging'); segs.forEach(s => s.classList.remove('near'));
      if (!d.live) return;
      swallow = true; setTimeout(() => swallow = false, 60);
      const m = new DOMMatrixReadOnly(getComputedStyle(thumb).transform), i = nearest(m.m41 + segs[segs.length - 1].offsetWidth / 2);
      i < segs.length - 1 ? go(i, 0) : place(segs.length - 1, true);
    }
    el.addEventListener('pointerup', drop); el.addEventListener('pointercancel', drop);
    el.addEventListener('dragstart', e => e.preventDefault());

    /* touch: swipe in from the left edge to go back one level, the page following the finger */
    let sw = null;
    edge.addEventListener('pointerdown', e => { if (!busy && trail.length > 1) sw = { x0: e.clientX, t0: performance.now(), id: e.pointerId, dx: 0, live: false }; });
    edge.addEventListener('pointermove', e => {
      if (!sw || e.pointerId !== sw.id) return;
      const dx = e.clientX - sw.x0, item = trail[trail.length - 2];
      if (!sw.live) { if (dx < 8) return; sw.live = true; begin(item); try { edge.setPointerCapture(sw.id); } catch (_) {} }
      sw.dx = Math.max(0, dx); sw.v = sw.dx / Math.max(1, performance.now() - sw.t0);
      slide(item.run ? sw.dx * .4 : sw.dx);
    });
    function swUp(e){
      if (!sw || e.pointerId !== sw.id) return;
      const s = sw; sw = null; if (!s.live) return;
      const item = trail[trail.length - 2], far = item.run ? s.dx > 90 : s.dx > W() * .3;
      if (far || (s.dx > 40 && s.v > .45)) go(trail.length - 2, item.run ? s.dx * .4 : s.dx);
      else settle(0, 300).then(end);
    }
    edge.addEventListener('pointerup', swUp); edge.addEventListener('pointercancel', swUp);

    return { set, back: () => go(trail.length - 2, 0) };
  }
  return { mount };
})();
