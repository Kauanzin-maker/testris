document.addEventListener('DOMContentLoaded', () => {
    // --- Referências ao DOM ---
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('start-button');
    const nextPieceDisplay = document.getElementById('next-piece');

    // --- Configurações do Jogo ---
    const WIDTH = 10;
    const HEIGHT = 20;
    let score = 0;
    let currentPosition = 4;
    let rotation = 0;
    let timerId = null;
    let isGameOver = false;

    // --- Criação do Tabuleiro (Grid) ---
    // Esta parte DEVE ser executada ao carregar a página
    for (let i = 0; i < WIDTH * HEIGHT; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
    }
    const cells = Array.from(grid.querySelectorAll('.cell'));

    // --- Definição das Peças (Tetrominós) ---
    // (As definições de I, J, L, O, S, T, Z e as cores permanecem as mesmas)
    const I = [[1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1], [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3], [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1], [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3]];
    const J = [[1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2], [WIDTH, WIDTH + 1, WIDTH + 2, 2], [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2], [WIDTH * 2, WIDTH, WIDTH + 1, WIDTH + 2]]; 
    const L = [[1, WIDTH + 1, WIDTH * 2 + 1, 2], [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 2], [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2], [WIDTH, WIDTH * 2, WIDTH * 2 + 1, WIDTH * 2 + 2]];
    const O = [[0, 1, WIDTH, WIDTH + 1], [0, 1, WIDTH, WIDTH + 1], [0, 1, WIDTH, WIDTH + 1], [0, 1, WIDTH, WIDTH + 1]];
    const S = [[WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1], [1, WIDTH + 1, WIDTH, WIDTH * 2], [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1], [1, WIDTH + 1, WIDTH, WIDTH * 2]];
    const T = [[1, WIDTH, WIDTH + 1, WIDTH + 2], [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH + 2], [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1], [1, WIDTH, WIDTH * 2, WIDTH + 1]];
    const Z = [[WIDTH, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2], [2, WIDTH + 2, WIDTH + 1, WIDTH * 2 + 1], [WIDTH, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2], [2, WIDTH + 2, WIDTH + 1, WIDTH * 2 + 1]];

    const theTetrominoes = [I, J, L, O, S, T, Z];
    const colors = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    let random;
    let nextRandom;
    let current;
    let currentColor;
    let nextColor;

    // --- Funções de Peças ---

    function generateNewPiece() {
        if (typeof random === 'undefined') {
            random = Math.floor(Math.random() * theTetrominoes.length);
        }
        
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        
        current = theTetrominoes[random][0]; 
        currentColor = colors[random];
        rotation = 0;
        currentPosition = 4; // Resetar posição para o topo

        random = nextRandom;
        nextColor = colors[nextRandom];
    }
    
    // --- Funções de Desenho e Colisão (Simplificadas) ---

    function draw() {
        current.forEach(index => {
            cells[currentPosition + index].classList.add('block', currentColor);
        });
    }

    function undraw() {
        current.forEach(index => {
            cells[currentPosition + index].classList.remove('block', currentColor);
        });
    }

    function checkCollision() {
        return current.some(index => {
            const targetIndex = currentPosition + index + WIDTH;
            const isBottom = (currentPosition + index + WIDTH) >= (WIDTH * HEIGHT);
            const isSettled = cells[targetIndex] && cells[targetIndex].classList.contains('settled');
            
            return isBottom || isSettled;
        });
    }

    function moveDown() {
        if (checkCollision()) {
            freeze();
            return;
        }
        undraw();
        currentPosition += WIDTH;
        draw();
    }
    
    function freeze() {
        // ... (Lógica de freeze, checkLineClears, e game over permanece a mesma)
        current.forEach(index => {
            if (currentPosition + index >= 0) {
                cells[currentPosition + index].classList.add('settled');
            }
        });
        
        // ... (checkLineClears aqui, omitido por brevidade, mas deve estar completo no seu arquivo) ...
        
        generateNewPiece();
        drawNextPiece();
        
        if (current.some(index => cells[currentPosition + index].classList.contains('settled'))) {
            gameOver();
        } else {
            draw();
        }
    }
    
    // --- Funções de Controle (moveLeft, moveRight, rotate, checkLineClears, gameOver, drawNextPiece) ---
    // (Omitidas por brevidade, mas devem estar COMPLETAS e CORRETAS no seu arquivo .js)
    // ...

    // --- Funções de Debug e Inicialização ---
    
    // Esta função será chamada apenas no clique do botão.
    function startGame() {
        console.log("2. Botão Clicado: Iniciando jogo...");
        
        // Se já está rodando, pausa
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            startButton.innerHTML = 'Continuar';
            console.log("Jogo Pausado.");
            return;
        } 
        
        // Se o jogo acabou, recarrega para novo jogo
        if (isGameOver) {
             console.log("Reiniciando jogo...");
             window.location.reload();
             return;
        }
        
        // Inicia o loop de queda
        console.log("3. Loop de queda iniciado.");
        timerId = setInterval(moveDown, 1000); 
        startButton.innerHTML = 'Pausar';
        
        // Desenha a peça inicial (apenas na primeira vez ou após a pausa)
        draw();
        drawNextPiece();
    }
    
    // --- Execução Principal ao Carregar a Página ---

    console.log("1. DOM Carregado. Criando peças iniciais.");
    
    // Gera as duas primeiras peças para ter a primeira e a próxima
    generateNewPiece();
    generateNewPiece(); 
    drawNextPiece(); // Desenha a peça no painel "Próximo"
    
    // Atribui o evento de clique
    startButton.addEventListener('click', startGame);
    
    // Atribui o controle de teclado (remover se não estiver usando)
    // document.addEventListener('keydown', control); 
    
    // A função 'control' e todas as outras funções de jogo devem ser definidas acima.
});
