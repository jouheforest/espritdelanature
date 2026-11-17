/* Esprit de la Nature — maquette. Tout tourne sans dépendance sauf GSAP (fumée + scrub). */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- menu mobile --- */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  if (burger && menu) {
    const toggle = (open) => {
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle(!menu.classList.contains('is-open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
    document.addEventListener('click', e => { if (menu.classList.contains('is-open') && !menu.contains(e.target) && !burger.contains(e.target)) toggle(false); });
  }

  /* --- nav : change de ton selon la section --- */
  const nav = document.getElementById('nav');
  const papers = [...document.querySelectorAll('.on-paper, .hero__card, .prod__buy, .hist-hero__txt')];
  if (nav) {
    const tone = () => {
      const onPaper = papers.some(p => { const r = p.getBoundingClientRect(); return r.top <= 48 && r.bottom >= 48; });
      nav.classList.toggle('is-paper', onPaper);
      nav.classList.toggle('is-dark', !onPaper && scrollY > 40);
    };
    addEventListener('scroll', tone, { passive: true });
    addEventListener('resize', tone);
    tone();
  }

  /* --- entrées en cascade --- */
  const rv = document.querySelectorAll('.rv');
  if (reduced || !('IntersectionObserver' in window)) rv.forEach(el => el.classList.add('is-in'));
  else {
    const io2 = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const sibs = [...en.target.parentElement.querySelectorAll(':scope > .rv')];
        const i = Math.max(0, sibs.indexOf(en.target));
        en.target.style.transitionDelay = (Math.min(i, 6) * 75) + 'ms';
        en.target.classList.add('is-in');
        io2.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    rv.forEach(el => io2.observe(el));
  }

  /* --- hero : la lumière change dans la pièce (fondu lent) --- */
  const room = document.getElementById('room');
  if (room && !reduced) {
    const imgs = [...room.querySelectorAll('img')];
    const cap = document.getElementById('roomcap');
    const caps = [
      'Lac-Noir, encens chauffé, sur la mousse derrière la cabane',
      'Bonnie, le nez dans les narcisses du jardin',
      'Le seau de récolte, un matin de juin',
      'La cabane, construite à la main, et les calendulas'
    ];
    let i = 0, t;
    const next = () => {
      imgs[i].classList.remove('is-on');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('is-on');
      if (cap) cap.textContent = caps[i];
    };
    const start = () => { clearInterval(t); t = setInterval(next, 5600); };
    start();
    document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(t) : start());
  }

  if (window.gsap && !reduced) {
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      /* le mot « quarante-cinq » du titre Huile de lys compte au défilement */
      const lys = document.querySelector('#h-lys');
      if (lys && /quarante-cinq/.test(lys.textContent)) {
        const o = { n: 0 };
        const words = ['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf','vingt','vingt et un','vingt-deux','vingt-trois','vingt-quatre','vingt-cinq','vingt-six','vingt-sept','vingt-huit','vingt-neuf','trente','trente et un','trente-deux','trente-trois','trente-quatre','trente-cinq','trente-six','trente-sept','trente-huit','trente-neuf','quarante','quarante et un','quarante-deux','quarante-trois','quarante-quatre','quarante-cinq'];
        gsap.to(o, { n: 45, ease: 'none', scrollTrigger: { trigger: lys, start: 'top 90%', end: 'top 40%', scrub: 0.4 },
          onUpdate: () => { lys.textContent = 'Huile de lys, ' + words[Math.round(o.n)] + (Math.round(o.n) === 45 ? ' jours' : ' jours…'); } });
      }
    }
  }

  /* --- la chose vivante : trouve ton encens --- */
  const out = document.getElementById('finder-out');
  if (out) {
    const O = 'https://mlw9xtittklw.i.optimole.com/cb:22iB.ef9/w:200/h:200/q:mauto/f:best/https://espritdelanature.ca/wp-content/uploads/';
    const cat = [
      { n: 'Lueur d\'hiver', p: 24, img: '2025/11/Lueur-dHiver-SQUARE-WEB-copy.jpg', mode: 'chauffe', fam: ['resine'], mom: ['matin', 'rituel'], d: 'Résines et aiguilles des conifères d\'ici, lumineux et clair.' },
      { n: 'Lac-Noir', p: 25, img: '2025/11/Lac-Noir-Photo-SQUARE-WEB-copy.jpg', mode: 'chauffe', fam: ['terre', 'resine'], mom: ['soir'], d: 'Mousse, eau noire et résines : la forêt après l\'orage.', url: 'produit.html' },
      { n: 'Forêt noire', p: 20, img: '2022/11/Website-Photo-copy.jpg', mode: 'chauffe', fam: ['terre'], mom: ['soir', 'rituel'], d: 'Les plantes cueillies la nuit, sombre et enveloppant.' },
      { n: 'Shamanes de la forêt', p: 22, img: '2021/02/Chaman-de-la-Foret-Incense-Updated-SQUARE-WEB-copy-1.jpg', mode: 'chauffe', fam: ['resine', 'terre'], mom: ['rituel', 'matin'], d: 'Un bain de forêt, de la racine à la cime.' },
      { n: 'Cercle de lune', p: 25, img: '2026/05/Cercle-de-Lune-Photo-SQUARE-WEB-2-copy.jpg', mode: 'chauffe', fam: ['fleur'], mom: ['soir', 'rituel'], d: 'Les fleurs du jardin lunaire, celles qui s\'ouvrent la nuit.' },
      { n: 'Sérénité', p: 25, img: '2020/03/serenite-incense-square-web-copy.jpg', mode: 'chauffe', fam: ['fleur'], mom: ['soir', 'matin'], d: 'Lavande et mélilot du matin, pour calmer le corps.' },
      { n: 'Perles de lune kyphi', p: 25, img: '2020/03/kyphi-perles-square-web-copy.jpg', mode: 'chauffe', fam: ['epice'], mom: ['rituel', 'soir'], d: 'La recette des temples d\'Égypte, seize ingrédients.' },
      { n: 'Bakhoor à la myrrhe', p: 25, img: '2026/08/Myrrhophore-SQUARE-Product-photo-WEB-copy.jpg', mode: 'chauffe', fam: ['epice', 'resine'], mom: ['rituel'], d: 'La myrrhe en perles à chauffer, chaude et ancienne.' },
      { n: 'Renne des bois', p: 25, img: '2026/11/Rennes-des-Bois-SQUARE-copy.jpg', mode: 'chauffe', fam: ['epice', 'terre'], mom: ['soir', 'rituel'], d: 'Les feux parfumés de la dernière glaciation.' },
      { n: 'Mémoires des Laurentides', p: 22, img: '2026/08/Memoires-Laurentides-SQUARE-Product-photo-WEB-copy.jpg', mode: 'chauffe', fam: ['resine', 'terre'], mom: ['matin'], d: 'Un mélange biorégional, le sol de la réserve faunique.' },
      { n: 'Quatre plantes sacrées', p: 20, img: '2024/11/Four-Sacred-Plants-Stick-Image.jpg', mode: 'baton', fam: ['resine', 'epice'], mom: ['rituel', 'matin'], d: 'Les plantes de purification d\'ici, en bâton.' },
      { n: 'Mousse et musc', p: 20, img: '2024/11/Mousse-et-Musc-product-photo.jpg', mode: 'baton', fam: ['terre'], mom: ['soir', 'rituel'], d: 'Le sous-bois, chaud et profond.' },
      { n: 'Fleurs violettes', p: 22, img: '2025/05/Purple-Flowers-Product-Photo-copy.jpg', mode: 'baton', fam: ['fleur'], mom: ['matin', 'soir'], d: 'Un bâton de printemps, floral et doux.' },
      { n: 'Calme', p: 20, img: '2024/11/Calme-Product-Photo.jpg', mode: 'baton', fam: ['fleur', 'terre'], mom: ['soir'], d: 'Pour la fin de journée, rond et sans sucre.' },
      { n: 'Sérénité enracinée', p: 20, img: '2025/05/Rooted-Serenity-Product-Photo.jpg', mode: 'baton', fam: ['terre', 'epice'], mom: ['rituel', 'soir'], d: 'Racines et terre, le bâton qui ramène au sol.' }
    ];
    const pick = { moment: null, famille: null, mode: null };
    document.querySelectorAll('.chips').forEach(group => {
      group.addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return;
        group.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        pick[group.dataset.q] = b.dataset.v;
        render();
      });
    });
    function render() {
      const missing = Object.entries(pick).filter(([, v]) => !v).length;
      if (missing) {
        const left = Object.entries(pick).filter(([, v]) => !v).map(([k]) => ({ moment: 'le moment', famille: 'la famille', mode: 'la manière' }[k]));
        out.innerHTML = '<p>Encore ' + left.join(' et ') + '.</p>';
        return;
      }
      let hits = cat.filter(c => c.mode === pick.mode && c.fam.includes(pick.famille) && c.mom.includes(pick.moment));
      if (hits.length < 2) hits = hits.concat(cat.filter(c => c.mode === pick.mode && c.fam.includes(pick.famille) && !hits.includes(c)));
      if (hits.length < 2) hits = hits.concat(cat.filter(c => c.mode === pick.mode && c.mom.includes(pick.moment) && !hits.includes(c)));
      hits = hits.slice(0, 3);
      out.innerHTML = '<p>' + (hits.length > 1 ? 'Voici ce que Bonnie te mettrait dans les mains.' : 'Un seul vrai candidat, et c\'est un bon.') + '</p>' +
        hits.map(h => '<a class="hit" href="' + (h.url || '#') + '"><span class="ring"><img src="' + O + h.img + '" width="96" height="96" alt="" loading="lazy"></span><span><b>' + h.n + '</b><p>' + h.d + '</p></span><span class="price">' + h.p + ' $</span></a>').join('');
      requestAnimationFrame(() => out.querySelectorAll('.hit').forEach((h, i) => setTimeout(() => h.classList.add('is-in'), 80 * i)));
    }
  }

  /* --- onglets de la plaque --- */
  document.querySelectorAll('.tabs').forEach(tabs => {
    const btns = tabs.querySelectorAll('[role=tab]');
    const show = id => {
      btns.forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === id)));
      document.querySelectorAll('[data-pane]').forEach(p => p.hidden = p.dataset.pane !== id);
    };
    btns.forEach(b => b.addEventListener('click', () => show(b.dataset.tab)));
    tabs.addEventListener('keydown', e => {
      const arr = [...btns]; const i = arr.indexOf(document.activeElement); if (i < 0) return;
      if (e.key === 'ArrowRight') { arr[(i + 1) % arr.length].focus(); show(arr[(i + 1) % arr.length].dataset.tab); }
      if (e.key === 'ArrowLeft') { arr[(i - 1 + arr.length) % arr.length].focus(); show(arr[(i - 1 + arr.length) % arr.length].dataset.tab); }
    });
  });

  /* --- formulaires : réponse près du champ, confirmation --- */
  document.querySelectorAll('form').forEach(f => {
    f.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      f.querySelectorAll('[required]').forEach(inp => {
        const bad = !inp.value.trim() || (inp.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value));
        inp.setAttribute('aria-invalid', String(bad));
        inp.style.outline = bad ? '3px solid #0b1310' : '';
        if (bad) ok = false;
      });
      if (!ok) return;
      const btn = f.querySelector('button[type=submit]');
      btn.textContent = 'Envoyé. Bonnie te répond sous peu.';
      btn.disabled = true;
    });
  });

  /* --- quantité (page produit) --- */
  document.querySelectorAll('.qty').forEach(q => {
    const o = q.querySelector('output');
    q.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      o.value = Math.max(1, (+o.value || 1) + (+b.dataset.d));
    }));
  });

  /* --- bouton panier : un petit retour, pas de vrai panier dans la maquette --- */
  document.querySelectorAll('a[href="#panier"]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const c = document.querySelector('.nav__cart'); if (!c) return;
    const n = (+c.textContent.replace(/\D/g, '') || 0) + 1;
    c.innerHTML = 'Panier <span class="dot" style="margin:0"></span> ' + n;
    if (window.gsap) gsap.fromTo(c, { scale: 1.12 }, { scale: 1, duration: 0.35, ease: 'power3.out' });
  }));
})();
