(() => {
  const DEFAULTS = {
    enabled:true,preset:"optical",blur:18,opacity:22,saturation:155,radius:18,
    edge:65,refraction:45,caustics:28,bloom:25,lighting:true,surfaces:true,
    controls:true,images:false,pageGlow:true,exclude:""
  };
  const STYLE_ID="liquid-glass-style";
  const yt=/^(www\.)?(youtube\.com|youtube-nocookie\.com)$/i.test(location.hostname);

  function excluded(list){
    const host=location.hostname.toLowerCase();
    return String(list||"").split(/[\n,;]/).map(v=>v.trim().toLowerCase()
      .replace(/^https?:\/\//,"").replace(/\/$/,"")).filter(Boolean)
      .some(d=>host===d||host.endsWith("."+d));
  }

  function build(s){
    const n=(v,a,b)=>Math.max(a,Math.min(b,Number(v)||0));
    const blur=n(s.blur,0,28), opacity=n(s.opacity,0,60)/100;
    const sat=n(s.saturation,80,220)/100, r=n(s.radius,0,32);
    const edge=n(s.edge,0,100)/100, refr=n(s.refraction,0,100)/100;
    const caust=n(s.caustics,0,100)/100, bloom=n(s.bloom,0,100)/100;

    // Expensive blur is deliberately restricted to actual overlays.
    const overlay=`
      backdrop-filter:blur(${blur}px) saturate(${sat}) !important;
      -webkit-backdrop-filter:blur(${blur}px) saturate(${sat}) !important;
      background-color:rgba(226,238,255,${(.025+opacity*.24).toFixed(3)}) !important;
      border:1px solid rgba(255,255,255,${(.06+edge*.28).toFixed(3)}) !important;
      border-radius:var(--lg-radius) !important;
      box-shadow:0 14px 42px rgba(10,22,42,${(.02+bloom*.08).toFixed(3)}),
        inset 0 1px rgba(255,255,255,${(.07+edge*.25).toFixed(3)}),
        inset 0 -1px rgba(95,150,210,${(.01+caust*.08).toFixed(3)}) !important;
    `;

    return `
      :root{--lg-radius:${r}px}
      html.lg-on{color-scheme:light dark}
      ${s.pageGlow?`html.lg-on body{background-image:
        radial-gradient(ellipse at 12% 0%,rgba(100,170,255,${(.008+bloom*.035).toFixed(3)}),transparent 38%),
        radial-gradient(ellipse at 92% 12%,rgba(190,140,255,${(.006+caust*.025).toFixed(3)}),transparent 34%) !important;
        background-attachment:fixed !important}`:''}
      ${s.surfaces?`html.lg-on :is([role="dialog"],[role="alertdialog"],[role="menu"],[role="listbox"],
        [aria-modal="true"],.modal,.dialog,.popover,.dropdown-menu,.context-menu,
        .command-palette,[data-radix-popper-content-wrapper]){${overlay}}`:''}
      ${s.controls?`html.lg-on :is(button,[role="button"],[role="tab"],[role="switch"],summary){
        border-radius:max(7px,calc(var(--lg-radius)*.52)) !important;
        transition:filter .15s ease,box-shadow .15s ease !important;
      }
      html.lg-on :is(button,[role="button"],[role="tab"]):not(:disabled):hover{
        filter:brightness(1.04) saturate(1.06) !important;
        box-shadow:0 3px 14px rgba(75,125,200,${(.008+bloom*.045).toFixed(3)}),
          inset 0 1px rgba(255,255,255,${(.04+edge*.18).toFixed(3)}) !important;
      }`:''}
      ${s.lighting?`html.lg-on :is([role="dialog"],[role="menu"],.modal,.popover,.dropdown-menu,.command-palette)::before{
        content:"";pointer-events:none;position:absolute;inset:0;border-radius:inherit;
        background:linear-gradient(118deg,rgba(255,255,255,${(.02+edge*.15).toFixed(3)}),transparent 44%),
          radial-gradient(100% 35% at 50% 0%,rgba(255,255,255,${(.015+edge*.15).toFixed(3)}),transparent 75%);
      }
      html.lg-on :is([role="dialog"],[role="menu"],.modal,.popover,.dropdown-menu,.command-palette)::after{
        content:"";pointer-events:none;position:absolute;inset:0;border-radius:inherit;padding:1px;
        background:linear-gradient(130deg,rgba(255,255,255,${(.07+edge*.5).toFixed(3)}),
          rgba(255,255,255,.012) 35%,rgba(125,190,255,${(.01+caust*.2).toFixed(3)}),rgba(255,255,255,.035));
        -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
        -webkit-mask-composite:xor;mask-composite:exclude;
      }`:''}
      ${s.images?'html.lg-on :is(img,video,canvas,iframe){border-radius:min(12px,var(--lg-radius)) !important}':''}
      html.lg-on [data-liquid-glass="off"],html.lg-on [data-liquid-glass="off"] *{
        backdrop-filter:none !important;-webkit-backdrop-filter:none !important;box-shadow:initial !important}
      html.lg-on :focus-visible{outline:2px solid Highlight !important;outline-offset:2px !important}
      ${yt?`
      /* YouTube navigation is structural: never blur, clip, transform or paint over it. */
      html.lg-on #guide,html.lg-on #guide *,
      html.lg-on ytd-guide-renderer,html.lg-on ytd-guide-renderer *,
      html.lg-on ytd-mini-guide-renderer,html.lg-on tp-yt-app-drawer,
      html.lg-on ytd-masthead,html.lg-on ytd-masthead *{
        backdrop-filter:none !important;-webkit-backdrop-filter:none !important;
      }
      html.lg-on #guide::before,html.lg-on #guide::after,
      html.lg-on ytd-guide-renderer::before,html.lg-on ytd-guide-renderer::after,
      html.lg-on ytd-mini-guide-renderer::before,html.lg-on ytd-mini-guide-renderer::after{
        content:none !important;display:none !important;
      }`:''}
      @media(prefers-reduced-motion:reduce){html.lg-on *{transition-duration:.01ms !important}}
    `;
  }

  function apply(s){
    const enabled=s.enabled&&!excluded(s.exclude);
    document.documentElement.classList.toggle("lg-on",enabled);
    let el=document.getElementById(STYLE_ID);
    if(!el){el=document.createElement("style");el.id=STYLE_ID;(document.head||document.documentElement).appendChild(el)}
    el.textContent=build(s);
  }
  chrome.storage.sync.get(DEFAULTS,apply);
  chrome.storage.onChanged.addListener((_,area)=>{if(area==="sync")chrome.storage.sync.get(DEFAULTS,apply)});
})();