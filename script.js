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


  // Historia: hitos verificables, en orden cronológico.
  const history = {
    '1882':['1882','Una familia de matemáticos','Nace el 23 de marzo en Erlangen, Alemania, en una familia judía de matemáticos. Su padre, Max Noether, era profesor en la universidad.'],
    '1900':['1900–1903','La decisión de estudiar matemáticas','En 1900 se certifica para enseñar inglés y francés en colegios de niñas, pero decide estudiar matemáticas. En Erlangen las mujeres solo podían entrar como oyentes, con permiso expreso del profesor. Aun así, en 1903 aprueba el examen de graduación.'],
    '1903':['1903–1904','Oyente en Göttingen','Estudia como oyente en Göttingen con Hilbert, Klein y Minkowski. En 1904 vuelve a Erlangen, donde ya se permitía a las mujeres ser estudiantes plenas.'],
    '1907':['1907–1915','Doctorado y años sin sueldo','En 1907 obtiene el doctorado en Erlangen, con una tesis sobre invariantes algebraicos. Durante los años siguientes enseña y hace investigación sin sueldo, a veces reemplazando a su padre.'],
    '1915':['1915','Llega a Göttingen','Hilbert y Klein la invitan a Göttingen, pero parte de la facultad se opone por ser mujer. Hilbert responde, según se cuenta, que el sexo de la candidata no es un argumento en contra de su admisión, y que «somos una universidad, no una casa de baños». Durante años da clases bajo el nombre de Hilbert, sin paga, y ayuda a entender la relatividad general de Einstein.'],
    '1918':['1918','El teorema de Noether','Publica el teorema que relaciona las simetrías de un sistema físico con las cantidades que se conservan, y que ella había demostrado en 1915. Por ejemplo, si las leyes de la física no cambian con el paso del tiempo, la energía se conserva.'],
    '1919':['1919','Docente, pero sin cátedra','La admiten formalmente como docente. Recibe un pequeño salario en 1923, pero nunca llega a ser profesora titular.'],
    '1920':['1920–1933','El álgebra moderna','Desarrolla la teoría de ideales y luego el álgebra no conmutativa, con colaboradores como Hasse y Brauer. Reúne a su alrededor a un grupo de estudiantes y jóvenes matemáticos, conocidos como «los chicos de Noether».'],
    '1933':['1933','Despido y exilio','Los nazis la despiden por ser judía. En octubre emigra a Estados Unidos, donde enseña en Bryn Mawr College y, desde 1934, da conferencias semanales en el Instituto de Estudios Avanzados de Princeton.'],
    '1935':['1935','Su muerte y el homenaje de Einstein','Le detectan un tumor, la operan y muere por complicaciones el 14 de abril, a los 53 años. El 1 de mayo, Einstein escribe una carta en su honor que publica The New York Times.']
  };
  document.querySelectorAll('[data-year]').forEach(button => button.addEventListener('click',()=>{
    const [label,title,text] = history[button.dataset.year];
    $('#yearBig').textContent=label; $('#yearTitle').textContent=title; $('#yearText').textContent=text;
    document.querySelectorAll('[data-year]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  }));

  // Laboratorio: pétalos idénticos cada 45°; un punto azul señala la orientación.
  const petals=$('#petals');
  if(petals) for(let i=0;i<8;i++){
    const ellipse=document.createElementNS('http://www.w3.org/2000/svg','ellipse');
    ellipse.setAttribute('cx','150');ellipse.setAttribute('cy','90');ellipse.setAttribute('rx','18');ellipse.setAttribute('ry','46');
    ellipse.setAttribute('transform',`rotate(${i*45} 150 150)`);
    ellipse.setAttribute('fill','#e3b96e1f');ellipse.setAttribute('stroke','#e3b96e');ellipse.setAttribute('stroke-width','2.5');
    petals.appendChild(ellipse);
  }
  const angle=$('#angle'), angleOut=$('#angleOut'), rotating=$('#rotatingPetals');
  const rotate = () => {
    if(!angle||!angleOut||!rotating)return;
    const deg=Number(angle.value);
    angleOut.textContent=`${deg}°`;
    rotating.style.transform=`rotate(${deg}deg)`;
    const matches=Math.abs(deg/45-Math.round(deg/45))<0.001;
    $('#rotationResult').textContent=matches?'Los pétalos coinciden consigo mismos':'Los pétalos están en transición';
    $('#rotationText').textContent=matches?`A ${deg}°, los ocho pétalos vuelven a ocupar el mismo conjunto de posiciones. El punto azul muestra cuánto giró la figura.`:'Continúa moviendo el control. Los pétalos vuelven a coincidir con su posición inicial en múltiplos de 45°.';
  };
  if(angle){angle.addEventListener('input',rotate);rotate();}
  $('#resetAngle')?.addEventListener('click',()=>{angle.value='0';rotate();});

  // Tres simetrías continuas de la acción y las magnitudes conservadas asociadas.
  const concepts={
    tiempo:['◷','Traslación en el tiempo → Energía','Si las leyes del sistema son las mismas en cualquier instante, se conserva la energía.'],
    espacio:['⇄','Traslación en el espacio → Momento lineal','Si las leyes son las mismas en cualquier lugar, se conserva el momento lineal.'],
    giro:['◎','Rotación → Momento angular','Si las leyes son las mismas en cualquier dirección, se conserva el momento angular.']
  };
  document.querySelectorAll('[data-sym]').forEach(button=>button.addEventListener('click',()=>{
    const [icon,name,text]=concepts[button.dataset.sym];
    $('#symIcon').textContent=icon;$('#symName').textContent=name;$('#symText').textContent=text;
    document.querySelectorAll('[data-sym]').forEach(b=>{let active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  }));

  // Puntos del póster: solo superpuestos; nunca se modifica la imagen.
    const hotspots={
    nucleo:['01 / 04','El núcleo','Los anillos se organizan alrededor de un mismo punto, como una figura que puede girar sin cambiar. Es la simetría de rotación, que según el teorema de Noether conserva el momento angular.'],
    anillos:['02 / 04','Los círculos que lo rodean','Como planetas alrededor de una estrella, los círculos más pequeños orbitan el centro y repiten su forma. Evocan el orden de una galaxia, que se mantiene mientras gira.'],    
    frontera:['03 / 04','Donde chocan dos mundos','Aquí chocan el orden y el caos: las líneas ordenadas se doblan, se parten y se dispersan en fragmentos al encontrarse con los remolinos oscuros. Es el choque entre la claridad de su pensamiento y los obstáculos de su época.'],
    miradas:['04 / 04','Los remolinos oscuros','En la parte oscura, las líneas se cierran en remolinos y varios óvalos parecen ojos que observan. Es la presión de una sociedad que no la dejó enseñar con su nombre ni cobrar por hacerlo, y que en 1933 la despidió por ser judía.']
  };
  document.querySelectorAll('[data-hotspot]').forEach(button=>button.addEventListener('click',()=>{
    const [num,title,text]=hotspots[button.dataset.hotspot];
    $('#detailNum').textContent=num;$('#detailTitle').textContent=title;$('#detailText').textContent=text;
    document.querySelectorAll('[data-hotspot]').forEach(b=>{let active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  }));
  const first=$('[data-hotspot="nucleo"]');if(first){first.classList.add('active');first.setAttribute('aria-pressed','true');}
});