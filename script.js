
document.addEventListener("DOMContentLoaded", () => {

    // ANIMACIONES AL DESPLAZARSE

    const elementos = document.querySelectorAll(".revelable");

    const menosMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!menosMovimiento && "IntersectionObserver" in window) {
        document.body.classList.add("js-activo");

        const observador = new IntersectionObserver(
            (entradas) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add("visible");
                        observador.unobserve(entrada.target);
                    }
                });
            },
            {
                threshold: 0.08
            }
        );

        elementos.forEach((elemento) => {
            observador.observe(elemento);
        });
    }

    // LABORATORIO DE ROTACIÓN

    const control = document.getElementById("controlRotacion");
    const figura = document.getElementById("figuraRotacion");
    const valor = document.getElementById("valorRotacion");
    const reiniciar = document.getElementById("reiniciarRotacion");

    function actualizarRotacion() {
        if (!control || !figura || !valor) return;

        const angulo = Number(control.value);

        figura.style.transform = `rotate(${angulo}deg)`;
        valor.textContent = `${angulo}°`;
    }

    if (control) {
        control.addEventListener("input", actualizarRotacion);
        actualizarRotacion();
    }

    if (reiniciar && control) {
        reiniciar.addEventListener("click", () => {
            control.value = 0;
            actualizarRotacion();
        });
    }

    // EXPLORADOR INTERACTIVO DEL PÓSTER

    const explicaciones = {
        nucleo: {
            titulo: "El núcleo: simetría de rotación",
            texto:
                "El núcleo está construido con curvas concéntricas. " +
                "Su geometría evoca la simetría de rotación y " +
                "una estructura que conserva su organización. " +
                "Es una interpretación visual, no una simulación física."
        },

        anillos: {
            titulo: "Los anillos y la persistencia",
            texto:
                "Los anillos expanden la organización circular. " +
                "Sus deformaciones cerca de la frontera expresan " +
                "presión y contacto entre los dos ambientes. " +
                "También evocan metafóricamente los anillos de Noether."
        },

        frontera: {
            titulo: "La frontera entre dos mundos",
            texto:
                "La frontera diagonal conecta el ambiente luminoso " +
                "con la región oscura. Los recorridos se comprimen " +
                "y se deforman, expresando la tensión entre " +
                "la coherencia matemática y las presiones sociales."
        },

        miradas: {
            titulo: "Las miradas: juicio y vigilancia",
            texto:
                "Algunos remolinos de la zona inferior recuerdan " +
                "a ojos. Esta semejanza sugiere escrutinio, juicio " +
                "y vigilancia social, sin representar directamente " +
                "rostros ni figuras humanas."
        }
    };

    const puntos = document.querySelectorAll(".punto");
    const tituloDetalle = document.getElementById("tituloDetalle");
    const textoDetalle = document.getElementById("textoDetalle");

    puntos.forEach((punto) => {

        punto.setAttribute("aria-pressed", "false");

        punto.addEventListener("click", () => {

            const tema = punto.dataset.tema;
            const explicacion = explicaciones[tema];

            if (!explicacion) return;

            tituloDetalle.textContent = explicacion.titulo;
            textoDetalle.textContent = explicacion.texto;

            puntos.forEach((otroPunto) => {
                otroPunto.classList.remove("activo");
                otroPunto.setAttribute("aria-pressed", "false");
            });

            punto.classList.add("activo");
            punto.setAttribute("aria-pressed", "true");
        });
    });

});
