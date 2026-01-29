class Node {
    constructor(value, id) {
        this.value = value;
        this.id = id;
        this.left = null;  
        this.right = null;
        this.parent = null;

        this.height = 0;
        this.leftHeight = 0;
        this.rightHeight = 0;
        this.balanceFactor = 0;

        this.x = 0;
        this.y = 0;
        this.mod = 0;
        this.prelim = 0;
    }
}

class AvlTree {
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

        this._findNodePlace(newNode, this.root, 0);

        // Atualiza alturas depois que a inserção terminou
        this.updateHeight(this.root);
        this.verifyBalance(newNode);
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

            // Atualiza alturas depois que a inserção terminou
            this.updateHeight(this.root);
            this.verifyBalance(nodeToRemove);

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

            // Atualiza alturas depois que a inserção terminou
            this.updateHeight(this.root);
            this.verifyBalance(nodeToRemove);

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

            // Atualiza alturas depois que a inserção terminou
            this.updateHeight(this.root);

            // Remove o sucessor (que será um dos casos 01 ou 02) -> Atualiza depois 
            this.remove(successor.value, nodeToRemove.right);
            return;
        }
    }

    _findNodePlace(node, currentRoot, currentDepth = 0) {

        node.depth = currentDepth;
        this.depth = Math.max(this.depth, node.depth);

        if (this.root == null) {
            this.root = node;
            return;
        }

        const nodeValue = node.value;

        if (nodeValue < currentRoot.value) {    
            if (currentRoot.left == null) {
                currentRoot.left = node;
                node.parent = currentRoot;
            } else {
                this._findNodePlace(node, currentRoot.left, currentDepth + 1);
            }

        } else {
            if (currentRoot.right == null) {
                currentRoot.right = node;
                node.parent = currentRoot;
            } else {
                this._findNodePlace(node, currentRoot.right, currentDepth + 1);
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

    updateHeight(node) {
        if (!node) return -1;

        const leftH  = this.updateHeight(node.left);
        const rightH = this.updateHeight(node.right);

        node.leftHeight = leftH + 1;
        node.rightHeight = rightH + 1;

        node.height = 1 + Math.max(leftH, rightH);
        node.balanceFactor = leftH - rightH;

        return node.height;
    }

    verifyBalance(newNode) {
        // Sobe a partir do novo nó inserido, verificando o fator de balanceamento
        let current = newNode;

        while (current) {

            if (current.balanceFactor > 1 || current.balanceFactor < -1) {
                this.rebalance(current);
                break;
            }

            current = current.parent;
        }
    }

    rebalance(node) {
        const balance = node.balanceFactor;

        if (balance > 1) {
            // Rotação simples à direita
            if (node.left.balanceFactor >= 0) {
                this.rotateRight(node);
            } else {
                // Rotação dupla à direita
                this.rotateLeft(node.left);
                this.rotateRight(node);
            }
        } else if (balance < -1) {
            // Rotação simples à esquerda
            if (node.right.balanceFactor <= 0) {
                this.rotateLeft(node);
            } else {
                // Rotação dupla à esquerda
                this.rotateRight(node.right);
                this.rotateLeft(node);
            }
        }
    }

    rotateRight(node) {
        const leftChild = node.left;
    
        // 01. Salve o neto direito como T2 -> Para não perdemos na proxima etapa
        const T2 = leftChild.right; 

        // 02. O Nó vira filho direito do seu filho esquerdo
        leftChild.right = node; 

        // 03. O neto direito T2 vira filho esquerdo do nó
        node.left = T2;         

        // 3. Atualiza o Pai do leftChild (que agora é a nova raiz dessa subárvore)
        leftChild.parent = node.parent;
        
        // Se tiver pai, atualiza o pai para apontar para o leftChild
        if (node.parent) {
            if (node.parent.left === node) {
                node.parent.left = leftChild;
            } else {
                node.parent.right = leftChild;
            }
        } else {
            this.root = leftChild; // Se não tiver pai, o leftChild vira a nova raiz da árvore
        }

        // 4. Atualiza o pai do nó antigo (que agora é filho de leftChild)
        node.parent = leftChild;

        // 5. Atualiza o pai do T2, se T2 existir
        if (T2) {
            T2.parent = node;
        }
    }

    rotateLeft(node) {
        const rightChild = node.right;
    
        // 01. Salve o neto direito como T2 -> Para não perdemos na proxima etapa
        const T2 = rightChild.left; 

        // 02. O Nó vira filho direito do seu filho esquerdo
        rightChild.left = node; 

        // 03. O neto direito T2 vira filho esquerdo do nó
        node.right = T2;         

        // 3. Atualiza o Pai do rightChild (que agora é a nova raiz dessa subárvore)
        rightChild.parent = node.parent;
        
        // Se tiver pai, atualiza o pai para apontar para o rightChild
        if (node.parent) {
            if (node.parent.left === node) {
                node.parent.left = rightChild;
            } else {
                node.parent.right = rightChild;
            }
        } else {
            this.root = rightChild; // Se não tiver pai, o rightChild vira a nova raiz da árvore
        }

        // 4. Atualiza o pai do nó antigo (que agora é filho de rightChild)
        node.parent = rightChild;
        
        // 5. Atualiza o pai do T2, se T2 existir
        if (T2) {
            T2.parent = node;
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

// Helper: Pega a borda ESQUERDA (Left Edge)
// Armazena: Onde o nó começa no eixo X
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
    // 1. Folha
    if (!node.left && !node.right) {
        node.prelim = 0;
        node.mod = 0;
        return; 
    }

    // 2. Só esquerda (Pai vai para a direita)
    if (node.left && !node.right) {
        // Distância = Metade do filho + metade do padding
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
            // A colisão acontece se: BordaDir da Esq > BordaEsq da Dir
            // gap = (Onde a esq termina) - (Onde a dir começa) + Padding
            const separation = leftSubtreeRightEdge[i] - rightSubtreeLeftEdge[i];
            
            if (separation + MIN_PADDING > shift) {
                shift = separation + MIN_PADDING;
            }
        }

        // Aplica o shift no filho da direita
        node.right.mod += shift;
        node.right.prelim += shift; 

        // Centraliza o pai entre os filhos
        node.prelim = (node.left.prelim + node.right.prelim) / 2;
        node.mod = node.prelim - (node.left.prelim + node.right.prelim) / 2; 
    }
}

function secondWalk (node, modSum = 0, level = 0, startX = 0, startY = 0) {
    if (!node) return;

    // startX é o offset para centralizar a árvore na tela
    const finalX = startX + (node.prelim + modSum); 

    // Espaçamento vertical fixo -> 80 pixels por nível
    const finalY = startY + (level * 50);             

    node.x = finalX;
    node.y = finalY;

    const nextModSum = modSum + node.mod;

    // Repassa os offsets para os filhos
    secondWalk(node.left, nextModSum, level + 1, startX, startY);
    secondWalk(node.right, nextModSum, level + 1, startX, startY);
}

export default AvlTree;