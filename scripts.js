const jogador = document.querySelector(".jogador");
const jogadorInt = document.querySelector(".jogadorInt");
const paredes = document.querySelectorAll(".parede");
const chegada = document.querySelector(".chegada");
const load = document.querySelector(".loadBox");
const pensar = document.querySelector(".pensarBox");
const crash = document.querySelector(".crashBox");
const finish = document.querySelector(".finishBox");
const h2 = document.querySelector("h2");
const novamente = document.querySelector(".novamente");
let passos = [];
let memoria = [];
let jogadorX;
let jogadorY;
let destinoX;
let destinoY;
let destinoAnteriorX;
let destinoAnteriorY;
let colisãoMapa;
let colisãoParede;
let iniciar;
let i = 0;
const velocidade = 1;
const passo = 23;
let animando = false;

function posiçãoInicial() {
    jogadorX = 1;
    jogadorY = 140;
    destinoX = 1;
    destinoY = 140;
    destinoAnteriorX = destinoX;
    destinoAnteriorY = destinoY;

    jogador.style.transform = `translate(${jogadorX}px, ${jogadorY}px) `;
}
posiçãoInicial();

function animar() {
    if (!animando) {
        return;
    }
    let movendo = false;
    destinoX = Math.max(0, Math.min(285, destinoX));
    destinoY = Math.max(0, Math.min(280, destinoY));

    if (jogadorX < destinoX) {
        movendo = true;
        jogadorX += velocidade;
    } else if (jogadorX > destinoX) {
        movendo = true;
        jogadorX -= velocidade;
    }

    if (jogadorY < destinoY) {
        movendo = true;
        jogadorY += velocidade;
    } else if (jogadorY > destinoY) {
        movendo = true;
        jogadorY -= velocidade;
    }

    jogador.style.transform = `translate(${jogadorX}px, ${jogadorY}px) `;

    if (
        jogadorX === 0 ||
        jogadorX === 285 ||
        jogadorY === 0 ||
        jogadorY === 280
    ) {
        bateu();
        return;
    }

    const jogadorRect = jogador.getBoundingClientRect();
    for (let parede of paredes) {
        const paredeRect = parede.getBoundingClientRect();

        if (
            jogadorRect.left < paredeRect.right &&
            jogadorRect.right > paredeRect.left &&
            jogadorRect.top < paredeRect.bottom &&
            jogadorRect.bottom > paredeRect.top
        ) {
            bateu();
            return;
            break;
        }
    }

    const chegadaRect = chegada.getBoundingClientRect();
    if (
        jogadorRect.left < chegadaRect.right &&
        jogadorRect.right > chegadaRect.left &&
        jogadorRect.top < chegadaRect.bottom &&
        jogadorRect.bottom > chegadaRect.top
    ) {
        animando = false;
        chegou();
        return;
    }

    if (movendo) {
        requestAnimationFrame(animar);
    } else {
        animando = false;
        i++;
        destinoAnteriorX = destinoX;
        destinoAnteriorY = destinoY;
        passagem();
    }
}

function andar(caso) {
    switch (caso) {
        case 1:
            destinoX -= passo;
            break;
        case 2:
            destinoX += passo;
            break;
        case 3:
            destinoY -= passo;
            break;
        case 4:
            destinoY += passo;
            break;
    }

    if (!animando) {
        animando = true;
        requestAnimationFrame(animar);
    }
}

function existeAgora() {
    let posiçãoAtual = [jogadorX, jogadorY, passos[i]];
    return memoria.some(
        (lapsos) => JSON.stringify(lapsos) === JSON.stringify(posiçãoAtual)
    );
}

function fragmentos() {
    return [destinoAnteriorX, destinoAnteriorY, passos[i]];
}

function existe() {
    return memoria.some(
        (lapsos) => JSON.stringify(lapsos) === JSON.stringify(fragmentos())
    );
}

function numero() {
    let geradorNum = Math.ceil(Math.random() * 4);
    return geradorNum;
}

function passagem() {
    load.style.zIndex = "-1";
    pensar.style.zIndex = "-1";
    crash.style.zIndex = "-1";
    if (i == passos.length) {
        passos.push(numero());
    }

    if (existeAgora()) {
        load.style.zIndex = "1";
        pensar.style.zIndex = "1";
        passos.pop();
        setTimeout(passagem, 500);
        return;
    }
    andar(passos[i]);
}

function bateu() {
    animando = false;
    animação();
    load.style.zIndex = "1";
    crash.style.zIndex = "1";
    if (!existe()) {
        memoria.push(fragmentos());
    }
    console.log(JSON.stringify(memoria));
    passos.pop();
    i = 0;
    setTimeout(posiçãoInicial, 2000);
    setTimeout(passagem, 4000);
}

function animação() {
    let ultimoPasso = passos[passos.length - 1];

    if (ultimoPasso === 1) {
        jogadorInt.style.animation = "batidaEsquerda 1s ease";
    }
    if (ultimoPasso === 2) {
        jogadorInt.style.animation = "batidaDireita 1s ease";
    }
    if (ultimoPasso === 3) {
        jogadorInt.style.animation = "batidaCima 1s ease";
    }
    if (ultimoPasso === 4) {
        jogadorInt.style.animation = "batidaBaixo 1s ease";
    }

    function desbater() {
        jogadorInt.style.animation = "none";
    }
    setTimeout(desbater, 1000);
}

function chegou() {
    h2.style.fontSize = "50px";
    finish.style.zIndex = "2";
    finish.style.backdropFilter = "blur(10px)";
    finish.style.transition = "backdrop-filter 1s ease-in-out";
    novamente.style.position = "static";
    novamente.style.left = "none";
    zerar();
}

function denovo() {
    h2.style.fontSize = "0px";
    finish.style.zIndex = "-1";
    finish.style.backdropFilter = "blur(0px)";
    finish.style.transition = "backdrop-filter 1s ease-in-out";
    novamente.style.position = "fixed";
    novamente.style.left = "-300";
}

function play() {
    passagem();
}

function parar() {
    animando = false;
    cancelAnimationFrame(animar);
}

function zerar() {
    animando = false;
    cancelAnimationFrame(animar);
    i = 0;
    passos = [];
    memoria = [];
    posiçãoInicial();
}