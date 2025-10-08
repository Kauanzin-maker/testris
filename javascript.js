document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('start-button');
    const nextPieceDisplay = document.getElementById('next-piece');

    const WIDTH = 10;
    const HEIGHT = 20;
    let score = 0;
    let currentPosition = 4; // Posição inicial no topo e centro
    let rotation = 0;
    let timerId = null;
    let isGameOver = false;

    // --- Criação do Tabuleiro (Grid) ---
    // A grade tem 200 células (10x20)
    for (let i = 0; i < WIDTH * HEIGHT; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
    }
    const cells = Array.from(grid.querySelectorAll('.cell'));

    // --- Definição das Peças (Tetrominós) ---
    // As coordenadas são relativas à 'currentPosition'
    const I = [
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3]
    ];
    const J = [
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2],
        [WIDTH, WIDTH + 1, WIDTH + 2, 2],
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2],
        [WIDTH * 2, WIDTH, WIDTH + 1, WIDTH + 2] // Corrigido a rotação 3 de J
    ];
    const L = [
        [1, WIDTH + 1, WIDTH * 2 + 1, 2],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 2],
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2],
        [WIDTH, WIDTH * 2, WIDTH * 2 + 1, WIDTH * 2 + 2]
    ];
    const O = [
        [0, 1, WIDTH, WIDTH + 1],
        [0, 1, WIDTH, WIDTH + 1],
        [0, 1, WIDTH, WIDTH + 1],
        [0, 1, WIDTH, WIDTH + 1]
    ];
    const S = [
        [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
        [1, WIDTH + 1, WIDTH, WIDTH * 2],
        [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
        [1, WIDTH + 1, WIDTH, WIDTH * 2]
    ];
    const T = [
        [1, WIDTH, WIDTH + 1, WIDTH + 2],
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH + 2],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
        [1, WIDTH, WIDTH * 2, WIDTH + 1]
    ];
    const Z = [
        [WIDTH, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2],
        [2, WIDTH + 2, WIDTH + 1, WIDTH * 2 + 1],
        [WIDTH, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2],
        [2, WIDTH + 2, WIDTH + 1, WIDTH * 2 + 1]
    ];

    const theTetrominoes = [I, J, L, O, S, T, Z];
    const colors = ['I', 'J', 'L', 'O', 'S',
