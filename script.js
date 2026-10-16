'use strict';
// Emmy Noether: Luz simétrica, sombra social
// Todo funciona sin librerías ni conexión a internet.
document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector) => document.querySelector(selector);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Revelar las secciones al entrar en pantalla.
  if ('IntersectionObserver' in window && !reduced) {
    document.body.classList.add('js-ready');
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('visible'); observer.unobserve(entry.target);
      }
    }, {threshold: 0.06});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
  // Barra de progreso.
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    const bar = $('#progreso'); if (bar) bar.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };
  window.addEventListener('scroll', updateProgress, {passive:true}); updateProgress();

  // Portada generativa: anillos de líneas inspirados en los trazos del póster.
  const canvas = $('#heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, time = 0, frame = 0;
    const colors = ['#f4d68a','#c96a4b','#527d99','#efbc72','#b65446','#f3d29b'];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      draw();
    };
    function draw() {
      ctx.clearRect(0,0,w,h);
      const cx = w * (w < 850 ? .68 : .72), cy = h*.48;
      const unit = Math.min(w,h);
      for(let ring=0;ring<57;ring++) {
        const radius = unit*(.07 + ring*.0115);
        ctx.beginPath();
        const count = 240;
        for(let n=0;n<=count;n++) {
          const a = n/count*Math.PI*2;
          const wave = Math.sin(a*6+ring*.26+time)*(.7+ring*.025) + Math.cos(a*13-ring*.39)*.75;
          const r = radius + wave;
          const x = cx + Math.cos(a)*r, y = cy + Math.sin(a)*r;
          if(n===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.strokeStyle = colors[ring%colors.length];
        ctx.globalAlpha = ring%5===0?.7:.37;
        ctx.lineWidth = ring%7===0?1.8:.9;
        ctx.stroke();
      }
      ctx.globalAlpha=1;
    }
    const tick = () => {time+=.0035; draw(); frame=requestAnimationFrame(tick);};
    window.addEventListener('resize',resize,{passive:true});resize();
    if(!reduced) frame=requestAnimationFrame(tick);
    document.addEventListener('visibilitychange',()=>{
      cancelAnimationFrame(frame);
      if(!document.hidden&&!reduced) frame=requestAnimationFrame(tick);
    });
  }

  // Historia: eventos verificables, en orden cronológico.
  const history = {
    '1882':['El comienzo','Nació en Erlangen, Alemania.'],
    '1907':['Doctorado en matemáticas','Se doctoró en la Universidad de Erlangen; su carrera académica se desarrollaría en un ambiente con fuertes barreras para las mujeres.'],
    '1915':['Llegada a Göttingen','David Hilbert y Felix Klein la invitaron a trabajar en Göttingen, donde contribuyó también a cuestiones relacionadas con la relatividad.'],
    '1918':['Una conexión fundamental','Publicó su trabajo sobre problemas variacionales invariantes, del que surge una profunda relación entre simetrías continuas y leyes de conservación.'],
    '1919':['Reconocimiento institucional','Finalmente pudo habilitarse en Göttingen, después de restricciones iniciales que habían impedido su acceso a esa posición.'],
    '1933':['Exilio en Estados Unidos','Perdió su puesto bajo el régimen nazi y pasó a enseñar en Bryn Mawr College, en Estados Unidos.']
  };
  document.querySelectorAll('[data-year]').forEach(button => button.addEventListener('click',()=>{
    const [title,text] = history[button.dataset.year];
    $('#yearBig').textContent=button.dataset.year; $('#yearTitle').textContent=title; $('#yearText').textContent=text;
    document.querySelectorAll('[data-year]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  }));

  // Laboratorio: pétalos idénticos cada 45°; un punto azul señala la orientación.
  const petals=$('#petals');
  if(petals) for(let i=0;i<8;i++){
    const ellipse=document.createElementNS('http://www.w3.org/2000/svg','ellipse');
    ellipse.setAttribute('cx','150');ellipse.setAttribute('cy','92');ellipse.setAttribute('rx','22');ellipse.setAttribute('ry','62');
    ellipse.setAttribute('transform',`rotate(${i*45} 150 150)`);
    ellipse.setAttribute('fill','#eac27b12');ellipse.setAttribute('stroke',i%2?'#c76b53':'#f0c279');ellipse.setAttribute('stroke-width','2.2');
    petals.appendChild(ellipse);
  }
  const angle=$('#angle'), angleOut=$('#angleOut'), rotating=$('#rotatingPetals');
  const rotate = () => {
    if(!angle||!angleOut||!rotating)return;
    const deg=Number(angle.value);
    angleOut.textContent=`${deg}°`;
    rotating.style.transform=`rotate(${deg}deg)`;
    const matches=Math.abs(deg/45-Math.round(deg/45))<0.001;
    $('#rotationResult').textContent=matches?'La forma coincide consigo misma':'La forma está en transición';
    $('#rotationText').textContent=matches?`A ${deg}°, los ocho pétalos vuelven a ocupar el mismo conjunto de posiciones. El punto azul muestra cuánto giró la figura.`:'Continúa moviendo el control. La figura completa vuelve a coincidir con la inicial en múltiplos de 45°.';
  };
  if(angle){angle.addEventListener('input',rotate);rotate();}
  $('#resetAngle')?.addEventListener('click',()=>{angle.value='0';rotate();});

  // Tres simetrías continuas de la acción y las magnitudes conservadas asociadas.
  const concepts={
    tiempo:['◷','Traslación en el tiempo → Energía','Si la acción es invariante al desplazar el tiempo, se conserva la energía.'],
    espacio:['⇄','Traslación en el espacio → Momento lineal','Si la acción es invariante ante desplazamientos espaciales, se conserva la componente correspondiente del momento lineal.'],
    giro:['◎','Rotación → Momento angular','Si la acción es invariante ante rotaciones continuas alrededor de un eje, se conserva la componente del momento angular asociada a ese eje.']
  };
  document.querySelectorAll('[data-sym]').forEach(button=>button.addEventListener('click',()=>{
    const [icon,name,text]=concepts[button.dataset.sym];
    $('#symIcon').textContent=icon;$('#symName').textContent=name;$('#symText').textContent=text;
    document.querySelectorAll('[data-sym]').forEach(b=>{let active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  }));

  // Puntos del póster: solo superpuestos; nunca se modifica la imagen.
  const hotspots={
    nucleo:['01 / 04','El núcleo','Las curvas concéntricas evocan una estructura que conserva su organización al girar. La relación con el teorema de Noether es interpretativa, no una simulación física.'],
    anillos:['02 / 04','Los anillos','Los recorridos rodean el núcleo y se deforman cerca de la frontera. Evocan expansión, presión y, como juego de sentidos, los anillos del álgebra de Noether.'],
    frontera:['03 / 04','La frontera diagonal','Aquí se encuentran la claridad matemática y la tensión social: los trazos se comprimen y se deforman al entrar en contacto ambos ambientes.'],
    miradas:['04 / 04','Las miradas','Algunos remolinos de la zona inferior recuerdan a ojos. Sugieren escrutinio y juicio social sin dibujar rostros ni figuras humanas.']
  };
  document.querySelectorAll('[data-hotspot]').forEach(button=>button.addEventListener('click',()=>{
    const [num,title,text]=hotspots[button.dataset.hotspot];
    $('#detailNum').textContent=num;$('#detailTitle').textContent=title;$('#detailText').textContent=text;
    document.querySelectorAll('[data-hotspot]').forEach(b=>{let active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  }));
  const first=$('[data-hotspot="nucleo"]');if(first){first.classList.add('active');first.setAttribute('aria-pressed','true');}
});

// Cursor: posición exacta y puntero nativo sobre controles interactivos.
(() => {
  const cursor = document.getElementById('cursorSimetrico');
  const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (!cursor || !media.matches) return;
  document.body.classList.add('cursor-habilitado');
  const interactive = 'a,button,input,select,textarea,label,[role="button"],[role="slider"],summary';
  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.add('activo');
    cursor.classList.toggle('sobre-enlace', Boolean(event.target.closest(interactive)));
  }, {passive:true});
  document.addEventListener('pointerdown', () => cursor.classList.add('pulsado'));
  document.addEventListener('pointerup', () => cursor.classList.remove('pulsado'));
  window.addEventListener('blur', () => cursor.classList.remove('activo'));
  document.addEventListener('pointerleave', () => cursor.classList.remove('activo'));
})();
