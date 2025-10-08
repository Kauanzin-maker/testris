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
    let timerId;
    let isGameOver = false;

    // --- Criação do Tabuleiro (Grid) ---
    for (let i = 0; i < WIDTH * HEIGHT; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
    }
    const cells = Array.from(grid.querySelectorAll('.cell'));

    // --- Definição das Peças (Tetrominós) ---
    const T = [
        [1, WIDTH, WIDTH + 1, WIDTH + 2],
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH + 2],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
        [1, WIDTH, WIDTH * 2, WIDTH + 1]
    ];
    const L = [
        [1, WIDTH + 1, WIDTH * 2 + 1, 2],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 2],
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2],
        [WIDTH, WIDTH * 2, WIDTH * 2 + 1, WIDTH * 2 + 2]
    ];
    // ... adicione as outras peças I, J, O, S, Z aqui ...
    const I = [
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3]
    ];
    const J = [
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2],
        [WIDTH, WIDTH + 1, WIDTH + 2, 2],
        [1, WIDTH + 1, WIDTH * 2 + 1, 2],
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
    const Z = [
        [WIDTH, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2],
        [2, WIDTH + 2, WIDTH + 1, WIDTH * 2 + 1],
        [WIDTH, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2],
        [2, WIDTH + 2, WIDTH + 1, WIDTH * 2 + 1]
    ];

    const theTetrominoes = [I, J, L, O, S, T, Z];
    const colors = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']; // Classes CSS

    let random = Math.floor(Math.random() * theTetrominoes.length);
    let nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][rotation];
    let currentColor = colors[random];
    let nextColor = colors[nextRandom];

    // --- Funções de Desenho e Apagamento ---

    function draw() {
        current.forEach(index => {
            cells[currentPosition + index].classList.add('block');
            cells[currentPosition + index].classList.add(currentColor);
        });
    }

    function undraw() {
        current.forEach(index => {
            cells[currentPosition + index].classList.remove('block');
            cells[currentPosition + index].classList.remove(currentColor);
        });
    }

    // --- Movimentação ---

    function moveDown() {
        if (!isGameOver) {
            undraw();
            currentPosition += WIDTH;
            if (checkCollision()) {
                currentPosition -= WIDTH;
                freeze();
            }
            draw();
        }
    }

    function checkCollision() {
        return current.some(index => {
            const nextCell = cells[currentPosition + index];
            const isBottom = (currentPosition + index) >= (WIDTH * HEIGHT);
            const isSettled = nextCell && nextCell.classList.contains('block') && nextCell.classList.contains('settled');
            return isBottom || isSettled;
        });
    }

    function freeze() {
        current.forEach(index => cells[currentPosition + index].classList.add('settled'));
        checkLineClears();
        
        // Inicia a próxima peça
        random = nextRandom;
        currentColor = nextColor;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        nextColor = colors[nextRandom];
        current = theTetrominoes[random][rotation];
        currentPosition = 4;

        drawNextPiece();
        draw();
        
        if (checkCollision()) {
            gameOver();
        }
    }

    // --- Controles de Teclado ---

    function control(e) {
        if (isGameOver) return;

        if (e.keyCode === 37) { // Seta Esquerda
            moveLeft();
        } else if (e.keyCode === 38) { // Seta Cima (Rotacionar)
            rotate();
        } else if (e.keyCode === 39) { // Seta Direita
            moveRight();
        } else if (e.keyCode === 40) { // Seta Baixo (Soft Drop)
            moveDown();
        }
    }
    document.addEventListener('keydown', control);

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % WIDTH === 0);

        if (!isAtLeftEdge) currentPosition -= 1;

        if (checkCollision()) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % WIDTH === WIDTH - 1);

        if (!isAtRightEdge) currentPosition += 1;

        if (checkCollision()) {
            currentPosition -= 1;
        }
        draw();
    }

    function rotate() {
        undraw();
        rotation++;
        if (rotation === current.length) {
            rotation = 0;
        }
        current = theTetrominoes[random][rotation];
        // Evita rotação para fora das bordas (simplificado)
        if (checkCollision()) {
            rotation--;
            if (rotation < 0) {
                rotation = current.length - 1;
            }
            current = theTetrominoes[random][rotation];
        }
        draw();
    }

    // --- Limpeza de Linhas ---

    function checkLineClears() {
        for (let i = 0; i < 200; i += WIDTH) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

            if (row.every(index => cells[index].classList.contains('settled'))) {
                score += 10;
                scoreDisplay.innerHTML = score;

                // Remove a linha
                row.forEach(index => {
                    cells[index].classList.remove('settled', 'block', ...colors);
                });
                
                // Move todas as linhas acima para baixo
                const cellsRemoved = cells.splice(i, WIDTH);
                cells.unshift(...cellsRemoved);
                
                // Reinsere as células no grid na ordem correta
                cells.forEach(cell => grid.appendChild(cell));
            }
        }
    }
    
    // --- Próxima Peça ---
    
    function drawNextPiece() {
        nextPieceDisplay.innerHTML = '';
        const miniGridSize = 4 * 4;
        const nextTetromino = theTetrominoes[nextRandom][0];
        
        for (let i = 0; i < miniGridSize; i++) {
            const miniCell = document.createElement('div');
            miniCell.classList.add('mini-cell');
            nextPieceDisplay.appendChild(miniCell);
        }
        const miniCells = Array.from(nextPieceDisplay.querySelectorAll('.mini-cell'));

        // Offset para centralizar
        const displayWidth = 4;
        const startPos = displayWidth + 1;

        nextTetromino.forEach(index => {
            // Desenha a peça no mini-grid (com offset)
            miniCells[startPos + index].classList.add('mini-block', nextColor);
        });
    }
    
    // --- Fim de Jogo ---

    function gameOver() {
        clearInterval(timerId);
        isGameOver = true;
        scoreDisplay.innerHTML = 'FIM DE JOGO! Score: ' + score;
        document.removeEventListener('keydown', control);
    }

    // --- Início do Jogo ---

    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            startButton.innerHTML = 'Continuar';
        } else if (isGameOver) {
            // Recarrega a página para um novo jogo simples
            window.location.reload();
        }
         else {
            draw();
            drawNextPiece();
            timerId = setInterval(moveDown, 1000); // Peça cai a cada 1 segundo
            startButton.innerHTML = 'Pausar';
        }
    });

    // Inicia a exibição da próxima peça (antes de começar)
    drawNextPiece();
});
