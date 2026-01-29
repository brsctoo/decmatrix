class Node {
    constructor(value, id) {
        this.value = value;
        this.id = id;
        this.left = null;  
        this.right = null;
        this.parent = null;

        this.x = 0;
        this.y = 0;
        this.mod = 0;
        this.prelim = 0;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
        this.nodeCount = 0;
        this.nodes = [];
        this.depth = 0;
    }

    insert (value) {
        this.nodeCount++;
        const newNode = new Node(value, this.nodeCount);
        this.nodes.push(newNode);

        this._findNodePlace(newNode, this.root);
        return newNode;
    }

    remove (value, currentNode = this.root) {
        {/* Remoção de um valor da árvore. Temos 3 casos: 
            01. Nó folha -> Remove diretamente
            02. Nó com 1 filho -> Substitui o nó pelo filho
            03. Nó com 2 filhos -> Encontra o sucessor (menor valor dos maiores valores), 
            copia o valor do sucessor para o nó a ser removido e remove o sucessor 
            (que será um dos casos 01 ou 02).
        */}

        const nodeToRemove = this._searchNodeByValue(value, currentNode);
        console.log("Node to remove: ", nodeToRemove);

        if (!nodeToRemove) {
            // Valor não encontrado na árvore; nada para remover
            return;
        }

        // Caso 01: Nó folha
        if (nodeToRemove.left == null && nodeToRemove.right == null) {
            if (nodeToRemove == this.root) {
                this.root = null;
            } else {
                // Tira o filho correspondente do pai
                if (nodeToRemove.parent.left == nodeToRemove) {
                    nodeToRemove.parent.left = null;
                } else {
                    nodeToRemove.parent.right = null;
                }
            }

            // Filtra a lista de nós para remover o nó deletado
            this.nodes = this.nodes.filter(node => node != nodeToRemove);
            return;
        }

        // Caso 02: Nó com 1 filho
        if (nodeToRemove.left == null || nodeToRemove.right == null) {
            const childNode = nodeToRemove.left ? nodeToRemove.left : nodeToRemove.right;
            if (nodeToRemove == this.root) {
                this.root = childNode;
                childNode.parent = null;
            } else {
                // Pega o pai do nó a ser removido e atualiza o filho correspondente, e coloca ele como pai do novo filho
                if (nodeToRemove.parent.left == nodeToRemove) {
                    nodeToRemove.parent.left = childNode;
                } else {
                    nodeToRemove.parent.right = childNode;
                }
                childNode.parent = nodeToRemove.parent;
            }

            // Filtra a lista de nós para remover o nó deletado
            this.nodes = this.nodes.filter(node => node != nodeToRemove);
            return;
        }

        // Caso 03: Nó com 2 filhos
        if (nodeToRemove.left != null && nodeToRemove.right != null) {
            // Sucessor é o menor valor da subárvore direita (pega o filho mais à esquerda da direita)
            let successor = nodeToRemove.right; 

            while (successor.left != null) {
                successor = successor.left;
            }

            // Troca as informações do nó a ser removido com o sucessor
            nodeToRemove.value = successor.value;

            // Remove o sucessor (que será um dos casos 01 ou 02)
            this.remove(successor.value, nodeToRemove.right);
            return;
        }
    }

    _findNodePlace (node, currentRoot, currentDepth = 0) {
        
        currentDepth++;
        node.depth = currentDepth;
        if (node.depth > this.depth) {
            this.depth = node.depth;
        }

        if (this.root == null) {
            this.root = node;
            return;
        }

        const currentRootValue = currentRoot.value;
        const nodeValue = node.value;

        if (nodeValue < currentRootValue) {
            if (currentRoot.left == null) {
                currentRoot.left = node;
                node.parent = currentRoot;
                return;
            } else {
                this._findNodePlace(node, currentRoot.left, currentDepth);
            }
        } else {
            if (currentRoot.right == null) {
                currentRoot.right = node;
                node.parent = currentRoot;
                return;
            } else {
                this._findNodePlace(node, currentRoot.right, currentDepth);
            }
        }
    }

    _searchNodeByValue (value, currentNode) {
        {/* Acha o nó com o valor especificado na árvore.
            - Usa recursão para navegar pela árvore.
            - Como chamamos primeiro para esqurda, é uma busca em pré-ordem.
        */}
        
        console.log("Searching for value: " + value + " at node: " + (currentNode ? currentNode.value : "null"));
        if (currentNode == null) {
            return null;
        }

        if (value == currentNode.value) {
            return currentNode;
        } else if (value < currentNode.value) {
            return this._searchNodeByValue(value, currentNode.left);
        } else {
            return this._searchNodeByValue(value, currentNode.right);
        }
    }
} 

const NODE_WIDTH = 40;  // Largura do nó em pixels
const MIN_PADDING = 15; // Espaço mínimo entre nós (pixels)

export function setNodesCoordinates (root, center_x = 0) {
    if (!root) return;

    // 1. Calcula a estrutura relativa
    firstWalk(root);

    // 2. Anula o deslocamento natural da raiz e força ela para o centro
    const realStartX = center_x - root.prelim;
    
    // 2. Aplica coordenadas finais
    secondWalk(root, 0, 0, realStartX, 50); 
}

function getLeftEdgeArray (node, modSum = 0, level = 0, contour = []) {
    if (!node) return contour;

    // X real + Mod acumulado - Metade da largura (Borda Esquerda)
    const leftEdge = (node.prelim + modSum) - (NODE_WIDTH / 2);

    if (contour[level] === undefined) {
        contour[level] = leftEdge;
    }

    getLeftEdgeArray(node.left,  modSum + node.mod, level + 1, contour);
    getLeftEdgeArray(node.right, modSum + node.mod, level + 1, contour);
    return contour;
}

function getRightEdgeArray(node, modSum = 0, level = 0, contour = []) {
    if (!node) return contour;
    
    // X real + Mod acumulado + Metade da largura (Borda Direita)
    const rightEdge = (node.prelim + modSum) + (NODE_WIDTH / 2);
    
    if (contour[level] === undefined) {
        contour[level] = rightEdge;
    }
    
    getRightEdgeArray(node.right, modSum + node.mod, level + 1, contour);
    getRightEdgeArray(node.left,  modSum + node.mod, level + 1, contour);
    return contour;
}

function firstWalk (node, level = 0) {
    {/*
        Primeiro passeio pela árvore para calcular posições preliminares (prelim) e modificadores (mod).
        Usa recursão pós-ordem para garantir que os filhos sejam processados antes do pai.
    */}

    // 1. Folha
    if (!node.left && !node.right) {
        node.prelim = 0;
        node.mod = 0;
        return; 
    }

    // 2. Só esquerda (Pai vai para a direita)
    if (node.left && !node.right) {
        {/* Distância = Metade do filho + metade do padding */}
        const dist = (NODE_WIDTH + MIN_PADDING) / 2;

        firstWalk(node.left, level + 1);
        node.prelim = node.left.prelim + dist; 
        node.mod = 0;
    }

    // 3. Só direita (Pai vai para a esquerda)
    if (!node.left && node.right) {
        firstWalk(node.right, level + 1);
        const dist = (NODE_WIDTH + MIN_PADDING) / 2;
        node.prelim = node.right.prelim - dist;
        node.mod = 0;
    }

    // 4. Dois filhos
    if (node.left && node.right) {
        firstWalk(node.left, level + 1);
        firstWalk(node.right, level + 1);
        
        // Bordas dos subárvores
        const leftSubtreeRightEdge = getRightEdgeArray(node.left);
        const rightSubtreeLeftEdge = getLeftEdgeArray(node.right);

        let shift = 0;

        // Pega a altura mínima entre as duas subárvores
        const minHeight = Math.min(leftSubtreeRightEdge.length, rightSubtreeLeftEdge.length);
        
        for (let i = 0; i < minHeight; i++) {
            {/* A colisão acontece se: BordaDir da Esq > BordaEsq da Dir */}
            {/* gap = (Onde a esq termina) - (Onde a dir começa) + Padding */}
            const separation = leftSubtreeRightEdge[i] - rightSubtreeLeftEdge[i];
            
            if (separation + MIN_PADDING > shift) {
                shift = separation + MIN_PADDING;
            }
        }

        {/* Aplica o shift no filho da direita */}
        node.right.mod += shift;
        node.right.prelim += shift; 

        {/* Centraliza o pai entre os filhos */}
        node.prelim = (node.left.prelim + node.right.prelim) / 2;
        node.mod = node.prelim - (node.left.prelim + node.right.prelim) / 2; 
    }
}

function secondWalk (node, modSum = 0, level = 0, startX = 0, startY = 0) {
    {/*
        Segundo passeio pela árvore para calcular as coordenadas finais (x, y) de cada nó.
        Usa recursão pré-ordem para aplicar os modificadores acumulados.
    */}

    if (!node) return;

    {/* startX é o offset para centralizar a árvore na tela */}
    const finalX = startX + (node.prelim + modSum); 

    {/* Espaçamento vertical fixo -> 80 pixels por nível */}
    const finalY = startY + (level * 50);             

    node.x = finalX;
    node.y = finalY;

    const nextModSum = modSum + node.mod;

    {/* Repassa os offsets para os filhos */}
    secondWalk(node.left, nextModSum, level + 1, startX, startY);
    secondWalk(node.right, nextModSum, level + 1, startX, startY);
}

export default BinarySearchTree;