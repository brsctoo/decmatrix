{/* JSON-LD é basicamente como o bot vai interpretar os dados estruturados para SEO e indexação de páginas web, ou seja, é onde nos passamos as informações para melhorar como o bot enxerga as páginas, melhorando o SEO. */}


export const schemas = {
    matrixBasicOperations: {
        pt: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/pt/matrix-basic-operations#software",
                    "name": "Decimatrix",
                    "applicationCategory": "EducationalApplication",
                    "operatingSystem": "Web",
                    "description": "Ferramenta para soma e subtração de matrizes com suporte a frações e passo a passo explicativo.",
                    "url": "https://decmatrix.com/pt/matrix-basic-operations"
                },
                {
                    "@type": "HowTo",
                    "name": "Como somar e subtrair matrizes",
                    "description": "Aprenda a realizar operações básicas entre matrizes elemento a elemento.",
                    "step": [
                        { "@type": "HowToStep", "name": "Dimensões", "text": "As matrizes devem ter o mesmo número de linhas e colunas." },
                        { "@type": "HowToStep", "name": "Cálculo", "text": "Some ou subtraia os elementos que ocupam a mesma posição." }
                    ]
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/pt"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Operações Básicas de Matrizes",
                            "item": "https://decmatrix.com/pt/matrix-basic-operations"
                        }
                    ]
                }
            ]
        },
        en: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/en/matrix-basic-operations#software",
                    "name": "Decimatrix",
                    "applicationCategory": "EducationalApplication",
                    "description": "Online tool for matrix addition and subtraction with fractions support and step-by-step solutions.",
                    "url": "https://decmatrix.com/en/matrix-basic-operations"
                },
                {
                    "@type": "HowTo",
                    "name": "How to Add and Subtract Matrices",
                    "description": "Learn how to perform basic matrix operations step-by-step.",
                    "step": [
                        { "@type": "HowToStep", "name": "Set Dimensions", "text": "Matrix A and B must have the same number of rows and columns." },
                        { "@type": "HowToStep", "name": "Enter Values", "text": "Fill the inputs with integers, decimals, or fractions (e.g., 3/4)." },
                        { "@type": "HowToStep", "name": "Get Results", "text": "Add or subtract the corresponding elements in each position (i, j)." }
                    ],
                    "totalTime": "PT1M"
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/en"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Matrix Basic Operations",
                            "item": "https://decmatrix.com/en/matrix-basic-operations"
                        }
                    ]
                }
            ]
        }
    },

    matrixMultiplication: {
        pt: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/pt/matrix-multiplication#software",
                    "name": "Decimatrix",
                    "applicationCategory": "EducationalApplication",
                    "operatingSystem": "Web",
                    "description": "Ferramenta para multiplicação de matrizes com suporte a frações e explicação passo a passo.",
                    "url": "https://decmatrix.com/pt/matrix-multiplication"
                },
                {
                    "@type": "HowTo",
                    "name": "Como multiplicar matrizes",
                    "description": "Aprenda a multiplicar matrizes usando a regra do produto linha-coluna.",
                    "step": [
                        { "@type": "HowToStep", "name": "Dimensões", "text": "A matriz A deve ter o mesmo número de colunas que a matriz B tem de linhas." },
                        { "@type": "HowToStep", "name": "Cálculo", "text": "Multiplique cada linha de A por cada coluna de B e some os produtos." }
                    ]
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/pt"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Multiplicação de Matrizes",
                            "item": "https://decmatrix.com/pt/matrix-multiplication"
                        }
                    ]
                }
            ]
        },
        en: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/en/matrix-multiplication#software",
                    "name": "Decimatrix",
                    "applicationCategory": "EducationalApplication",
                    "description": "Online tool for matrix multiplication with fractions support and step-by-step explanations.",
                    "url": "https://decmatrix.com/en/matrix-multiplication"
                },
                {
                    "@type": "HowTo",
                    "name": "How to Multiply Matrices",
                    "description": "Learn how to multiply matrices using the row-column product rule.",
                    "step": [
                        { "@type": "HowToStep", "name": "Set Dimensions", "text": "Matrix A must have the same number of columns as Matrix B has rows." },
                        { "@type": "HowToStep", "name": "Calculate", "text": "Multiply each row of A by each column of B and sum the products." }
                    ],
                    "totalTime": "PT1M"
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/en"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Matrix Multiplication",
                            "item": "https://decmatrix.com/en/matrix-multiplication"
                        }
                    ]
                }
            ]
        }
    },

    simpleInterestCalculator: {
        pt: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/pt/simple-interest-calculator#software",
                    "name": "Decimatrix",
                    "applicationCategory": "EducationalApplication",
                    "operatingSystem": "Web",
                    "description": "Calculadora de juros simples online com gráficos e explicações passo a passo.",
                    "url": "https://decmatrix.com/pt/simple-interest-calculator"
                },
                {
                    "@type": "HowTo",
                    "name": "Como calcular juros simples",
                    "description": "Aprenda a calcular juros simples com capital, taxa e período.",
                    "step": [
                        { "@type": "HowToStep", "name": "Preencha os campos", "text": "Informe o capital, taxa de juros e período." },
                        { "@type": "HowToStep", "name": "Calcule", "text": "Clique em calcular para ver o resultado e o gráfico." }
                    ]
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/pt"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Calculadora de Juros Simples",
                            "item": "https://decmatrix.com/pt/simple-interest-calculator"
                        }
                    ]
                }
            ]
        },
        en: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/en/simple-interest-calculator#software",
                    "name": "Decimatrix",
                    "applicationCategory": "EducationalApplication",
                    "description": "Online simple interest calculator with charts and step-by-step explanations.",
                    "url": "https://decmatrix.com/en/simple-interest-calculator"
                },
                {
                    "@type": "HowTo",
                    "name": "How to Calculate Simple Interest",
                    "description": "Learn to calculate simple interest using capital, rate, and period.",
                    "step": [
                        { "@type": "HowToStep", "name": "Fill the fields", "text": "Enter capital, interest rate, and period." },
                        { "@type": "HowToStep", "name": "Calculate", "text": "Click calculate to see the result and chart." }
                    ],
                    "totalTime": "PT1M"
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/en"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Simple Interest Calculator",
                            "item": "https://decmatrix.com/en/simple-interest-calculator"
                        }
                    ]
                }
            ]
        }
    },

    compoundInterestCalculator: {
        pt: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/pt/compound-interest-calculator#software",
                    "name": "Decimatrix",
                    "applicationCategory": "EducationalApplication",
                    "operatingSystem": "Web",
                    "description": "Calculadora de juros compostos online com contribuições periódicas, gráficos e explicações.",
                    "url": "https://decmatrix.com/pt/compound-interest-calculator"
                },
                {
                    "@type": "HowTo",
                    "name": "Como calcular juros compostos",
                    "description": "Aprenda a calcular juros compostos com capital, taxa, período e contribuições.",
                    "step": [
                        { "@type": "HowToStep", "name": "Preencha os campos", "text": "Informe o capital, taxa de juros, período e contribuição periódica." },
                        { "@type": "HowToStep", "name": "Calcule", "text": "Clique em calcular para ver o resultado e os gráficos." }
                    ]
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/pt"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Calculadora de Juros Compostos",
                            "item": "https://decmatrix.com/pt/compound-interest-calculator"
                        }
                    ]
                }
            ]
        },
        en: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/en/compound-interest-calculator#software",
                    "name": "Decimatrix",
                    "applicationCategory": "EducationalApplication",
                    "description": "Online compound interest calculator with periodic contributions, charts, and explanations.",
                    "url": "https://decmatrix.com/en/compound-interest-calculator"
                },
                {
                    "@type": "HowTo",
                    "name": "How to Calculate Compound Interest",
                    "description": "Learn to calculate compound interest with capital, rate, period, and contributions.",
                    "step": [
                        { "@type": "HowToStep", "name": "Fill the fields", "text": "Enter capital, interest rate, period, and periodic contribution." },
                        { "@type": "HowToStep", "name": "Calculate", "text": "Click calculate to see the result and charts." }
                    ],
                    "totalTime": "PT1M"
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/en"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Compound Interest Calculator",
                            "item": "https://decmatrix.com/en/compound-interest-calculator"
                        }
                    ]
                }
            ]
        }
    },

    quadraticEquationCalculator: {
        pt: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/pt/quadratic-equation-calculator#software",
                    "name": "Decimatrix",
                    "applicationCategory": "EducationalApplication",
                    "operatingSystem": "Web",
                    "description": "Calculadora de equações do 2º grau online com gráficos e explicações passo a passo.",
                    "url": "https://decmatrix.com/pt/quadratic-equation-calculator"
                },
                {
                    "@type": "HowTo",
                    "name": "Como resolver equações do 2º grau",
                    "description": "Aprenda a calcular raízes de equações quadráticas e visualizar o gráfico.",
                    "step": [
                        { "@type": "HowToStep", "name": "Preencha os coeficientes", "text": "Informe os valores de a, b e c." },
                        { "@type": "HowToStep", "name": "Calcule", "text": "Clique em calcular para ver as raízes e o gráfico." }
                    ]
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/pt"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Equação do 2º Grau",
                            "item": "https://decmatrix.com/pt/quadratic-equation-calculator"
                        }
                    ]
                }
            ]
        },
        en: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/en/quadratic-equation-calculator#software",
                    "name": "Decimatrix",
                    "applicationCategory": "EducationalApplication",
                    "description": "Online quadratic equation calculator with charts and step-by-step explanations.",
                    "url": "https://decmatrix.com/en/quadratic-equation-calculator"
                },
                {
                    "@type": "HowTo",
                    "name": "How to Solve Quadratic Equations",
                    "description": "Learn to calculate roots of quadratic equations and visualize the graph.",
                    "step": [
                        { "@type": "HowToStep", "name": "Fill the coefficients", "text": "Enter values for a, b, and c." },
                        { "@type": "HowToStep", "name": "Calculate", "text": "Click calculate to see the roots and chart." }
                    ],
                    "totalTime": "PT1M"
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/en"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Quadratic Equation Calculator",
                            "item": "https://decmatrix.com/en/quadratic-equation-calculator"
                        }
                    ]
                }
            ]
        }
    },

    bstTreeBuilder: {
        pt: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/pt/bst-tree-builder#software",
                    "name": "Decimatrix",
                    "applicationCategory": "EducationalApplication",
                    "operatingSystem": "Web",
                    "description": "Construa e visualize árvores binárias de busca (BST) com inserção, remoção e passo a passo.",
                    "url": "https://decmatrix.com/pt/bst-tree-builder"
                },
                {
                    "@type": "HowTo",
                    "name": "Como construir uma BST",
                    "description": "Aprenda a inserir, remover e visualizar nós em uma árvore binária de busca.",
                    "step": [
                        { "@type": "HowToStep", "name": "Insira valores", "text": "Digite os valores e clique para inserir na árvore." },
                        { "@type": "HowToStep", "name": "Visualize", "text": "Veja a árvore sendo construída passo a passo." }
                    ]
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/pt"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "BST Tree Builder",
                            "item": "https://decmatrix.com/pt/bst-tree-builder"
                        }
                    ]
                }
            ]
        },
        en: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/en/bst-tree-builder#software",
                    "name": "Decimatrix",
                    "applicationCategory": "EducationalApplication",
                    "description": "Build and visualize binary search trees (BST) with insertion, removal, and step-by-step visualization.",
                    "url": "https://decmatrix.com/en/bst-tree-builder"
                },
                {
                    "@type": "HowTo",
                    "name": "How to Build a BST",
                    "description": "Learn to insert, remove, and visualize nodes in a binary search tree.",
                    "step": [
                        { "@type": "HowToStep", "name": "Insert values", "text": "Type values and click to insert into the tree." },
                        { "@type": "HowToStep", "name": "Visualize", "text": "See the tree being built step by step." }
                    ],
                    "totalTime": "PT1M"
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/en"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "BST Tree Builder",
                            "item": "https://decmatrix.com/en/bst-tree-builder"
                        }
                    ]
                }
            ]
        }
    },

    avlTreeBuilder: {
        pt: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/pt/avl-tree-builder#software",
                    "name": "Decimatrix",
                    "applicationCategory": "EducationalApplication",
                    "operatingSystem": "Web",
                    "description": "Construa e visualize árvores AVL com balanceamento automático e passo a passo.",
                    "url": "https://decmatrix.com/pt/avl-tree-builder"
                },
                {
                    "@type": "HowTo",
                    "name": "Como construir uma AVL",
                    "description": "Aprenda a inserir, remover e visualizar nós em uma árvore AVL.",
                    "step": [
                        { "@type": "HowToStep", "name": "Insira valores", "text": "Digite os valores e clique para inserir na árvore AVL." },
                        { "@type": "HowToStep", "name": "Visualize", "text": "Veja o balanceamento automático e a árvore sendo construída." }
                    ]
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/pt"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "AVL Tree Builder",
                            "item": "https://decmatrix.com/pt/avl-tree-builder"
                        }
                    ]
                }
            ]
        },
        en: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/en/avl-tree-builder#software",
                    "name": "Decimatrix",
                    "applicationCategory": "EducationalApplication",
                    "description": "Build and visualize AVL trees with automatic balancing and step-by-step visualization.",
                    "url": "https://decmatrix.com/en/avl-tree-builder"
                },
                {
                    "@type": "HowTo",
                    "name": "How to Build an AVL Tree",
                    "description": "Learn to insert, remove, and visualize nodes in an AVL tree.",
                    "step": [
                        { "@type": "HowToStep", "name": "Insert values", "text": "Type values and click to insert into the AVL tree." },
                        { "@type": "HowToStep", "name": "Visualize", "text": "See automatic balancing and the tree being built." }
                    ],
                    "totalTime": "PT1M"
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/en"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "AVL Tree Builder",
                            "item": "https://decmatrix.com/en/avl-tree-builder"
                        }
                    ]
                }
            ]
        }
    },
    bubbleSort: {
        pt: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/pt/bubble-sort#software",
                    "name": "Decimatrix - Bubble Sort Visualizer",
                    "applicationCategory": "EducationalApplication",
                    "operatingSystem": "Web",
                    "description": "Visualize e entenda o algoritmo de ordenação Bubble Sort com animações passo a passo.",
                    "url": "https://decmatrix.com/pt/bubble-sort"
                },
                {
                    "@type": "HowTo",
                    "name": "Como visualizar o Bubble Sort",
                    "description": "Aprenda a inserir valores e visualizar o algoritmo de ordenação em tempo real.",
                    "step": [
                        { "@type": "HowToStep", "name": "Insira valores", "text": "Digite uma lista de números inteiros separados por vírgula e insira no array." },
                        { "@type": "HowToStep", "name": "Visualize a ordenação", "text": "Dê o play para ver os maiores números flutuando para o final enquanto as barras trocam de posição." }
                    ]
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/pt"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Bubble Sort",
                            "item": "https://decmatrix.com/pt/bubble-sort"
                        }
                    ]
                }
            ]
        },
        en: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/en/bubble-sort#software",
                    "name": "Decimatrix - Bubble Sort Visualizer",
                    "applicationCategory": "EducationalApplication",
                    "operatingSystem": "Web",
                    "description": "Visualize and understand the Bubble Sort algorithm with step-by-step animations.",
                    "url": "https://decmatrix.com/en/bubble-sort"
                },
                {
                    "@type": "HowTo",
                    "name": "How to visualize Bubble Sort",
                    "description": "Learn to insert values and watch the sorting process in real-time.",
                    "step": [
                        { "@type": "HowToStep", "name": "Insert values", "text": "Type a list of comma-separated integer numbers and insert them into the array." },
                        { "@type": "HowToStep", "name": "Visualize sorting", "text": "Hit play to see the largest numbers float to the end as the bars swap positions." }
                    ],
                    "totalTime": "PT1M"
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/en"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Bubble Sort",
                            "item": "https://decmatrix.com/en/bubble-sort"
                        }
                    ]
                }
            ]
        }
    },
    insertionSort: {
        pt: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/pt/insertion-sort#software",
                    "name": "Decimatrix - Insertion Sort Visualizer",
                    "applicationCategory": "EducationalApplication",
                    "operatingSystem": "Web",
                    "description": "Visualize e entenda o algoritmo de ordenação Insertion Sort com animações passo a passo.",
                    "url": "https://decmatrix.com/pt/insertion-sort"
                },
                {
                    "@type": "HowTo",
                    "name": "Como visualizar o Insertion Sort",
                    "description": "Aprenda a inserir valores e visualizar o algoritmo de ordenação em tempo real.",
                    "step": [
                        { "@type": "HowToStep", "name": "Insira valores", "text": "Digite uma lista de números inteiros separados por vírgula e insira no array." },
                        { "@type": "HowToStep", "name": "Visualize a ordenação", "text": "Dê o play para ver cada elemento sendo selecionado, deslizado para a esquerda e inserido na posição correta da sublista já ordenada." }
                    ]
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/pt"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Insertion Sort",
                            "item": "https://decmatrix.com/pt/insertion-sort"
                        }
                    ]
                }
            ]
        },
        en: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/en/insertion-sort#software",
                    "name": "Decimatrix - Insertion Sort Visualizer",
                    "applicationCategory": "EducationalApplication",
                    "operatingSystem": "Web",
                    "description": "Visualize and understand the Insertion Sort algorithm with step-by-step animations.",
                    "url": "https://decmatrix.com/en/insertion-sort"
                },
                {
                    "@type": "HowTo",
                    "name": "How to visualize Insertion Sort",
                    "description": "Learn to insert values and watch the sorting process in real-time.",
                    "step": [
                        { "@type": "HowToStep", "name": "Insert values", "text": "Type a list of comma-separated integer numbers and insert them into the array." },
                        { "@type": "HowToStep", "name": "Visualize sorting", "text": "Hit play to see each element being selected, shifted to the left, and inserted into its correct position within the sorted sublist." }
                    ],
                    "totalTime": "PT1M"
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/en"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Insertion Sort",
                            "item": "https://decmatrix.com/en/insertion-sort"
                        }
                    ]
                }
            ]
        }
    },
    selectionSort: {
        pt: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/pt/selection-sort#software",
                    "name": "Decimatrix - Selection Sort Visualizer",
                    "applicationCategory": "EducationalApplication",
                    "operatingSystem": "Web",
                    "description": "Visualize e entenda o algoritmo de ordenação Selection Sort com animações passo a passo.",
                    "url": "https://decmatrix.com/pt/selection-sort"
                },
                {
                    "@type": "HowTo",
                    "name": "Como visualizar o Selection Sort",
                    "description": "Aprenda a inserir valores e visualizar o algoritmo de ordenação por seleção em tempo real.",
                    "step": [
                        { "@type": "HowToStep", "name": "Insira valores", "text": "Digite uma lista de números inteiros separados por vírgula e insira no array." },
                        { "@type": "HowToStep", "name": "Visualize a ordenação", "text": "Dê o play para ver cada passagem do algoritmo encontrando o menor elemento da sublista não ordenada e trocando-o para a posição correta." }
                    ]
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/pt"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Selection Sort",
                            "item": "https://decmatrix.com/pt/selection-sort"
                        }
                    ]
                }
            ]
        },
        en: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": "https://decmatrix.com/en/selection-sort#software",
                    "name": "Decimatrix - Selection Sort Visualizer",
                    "applicationCategory": "EducationalApplication",
                    "operatingSystem": "Web",
                    "description": "Visualize and understand the Selection Sort algorithm with step-by-step animations.",
                    "url": "https://decmatrix.com/en/selection-sort"
                },
                {
                    "@type": "HowTo",
                    "name": "How to visualize Selection Sort",
                    "description": "Learn to insert values and watch the selection sorting process in real-time.",
                    "step": [
                        { "@type": "HowToStep", "name": "Insert values", "text": "Type a list of comma-separated integer numbers and insert them into the array." },
                        { "@type": "HowToStep", "name": "Visualize sorting", "text": "Hit play to see each pass of the algorithm scanning the unsorted sublist, finding the minimum element, and swapping it into its correct position." }
                    ],
                    "totalTime": "PT1M"
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://decmatrix.com/en"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Selection Sort",
                            "item": "https://decmatrix.com/en/selection-sort"
                        }
                    ]
                }
            ]
        }
    }
};