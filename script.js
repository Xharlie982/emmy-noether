
document.addEventListener("DOMContentLoaded", () => {
    const elementos = document.querySelectorAll(
        ".cabecera, .lectura section, blockquote, footer"
    );

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elementos.forEach((elemento) => {
        elemento.classList.add("animable");
        observador.observe(elemento);
    });
});
