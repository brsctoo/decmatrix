  import { SITE_URL } from '../../constants/site';

  /** @type {import('next').MetadataRoute.Sitemap} */
  export default function sitemap() {
    const baseUrl = SITE_URL

    return [
      // --- HOME ---
      { url: `${baseUrl}/pt` },
      { url: `${baseUrl}/en` },

      // --- CALCULADORA JUROS SIMPLES ---
      { url: `${baseUrl}/pt/simple-interest-calculator` },
      { url: `${baseUrl}/en/simple-interest-calculator` },

      // --- CALCULADORA JUROS COMPOSTOS ---
      { url: `${baseUrl}/pt/compound-interest-calculator` },
      { url: `${baseUrl}/en/compound-interest-calculator` },

      { url: `${baseUrl}/pt/linear-function-calculator` },
      { url: `${baseUrl}/en/linear-function-calculator` },
      { url: `${baseUrl}/pt/linear-system-calculator` },
      { url: `${baseUrl}/en/linear-system-calculator` },
      // --- ÁRVORE AVL ---
      { url: `${baseUrl}/pt/avl-tree-builder` },
      { url: `${baseUrl}/en/avl-tree-builder` },

      // --- ÁRVORE BST ---
      { url: `${baseUrl}/pt/bst-tree-builder` },
      { url: `${baseUrl}/en/bst-tree-builder` },

      // --- EQUAÇÃO DE SEGUNDO GRAU ---
      { url: `${baseUrl}/pt/quadratic-equation-calculator` },
      { url: `${baseUrl}/en/quadratic-equation-calculator` },

      // --- SOMA E SUBTRAÇÃO DE MATRIZES ---
      { url: `${baseUrl}/pt/matrix-basic-operations` },
      { url: `${baseUrl}/en/matrix-basic-operations` },

      // --- MULTIPLICAÇÃO DE MATRIZES ---
      { url: `${baseUrl}/pt/matrix-multiplication` },
      { url: `${baseUrl}/en/matrix-multiplication` },

      // --- DETERMINANTE E MATRIZ INVERSA ---
      { url: `${baseUrl}/pt/matrix-determinant` },
      { url: `${baseUrl}/en/matrix-determinant` },
      { url: `${baseUrl}/pt/matrix-inverse` },
      { url: `${baseUrl}/en/matrix-inverse` },

      // --- BUBBLE SORT ---
      { url: `${baseUrl}/pt/bubble-sort` },
      { url: `${baseUrl}/en/bubble-sort` },

      // --- INSERTION SORT ---
      { url: `${baseUrl}/pt/insertion-sort` },
      { url: `${baseUrl}/en/insertion-sort` },

      // --- SELECTION SORT ---
      { url: `${baseUrl}/pt/selection-sort` },
      { url: `${baseUrl}/en/selection-sort` },

      // --- CONVERSOR DE BASE  ---
      { url: `${baseUrl}/pt/base-converter` },
      { url: `${baseUrl}/en/base-converter` },

      // --- GERADOR DE TABELA VERDADE ---
      { url: `${baseUrl}/pt/truth-table-generator` },
      { url: `${baseUrl}/en/truth-table-generator` },

      // --- POLÍTICA DE PRIVACIDADE ---
      { url: `${baseUrl}/pt/privacy-policy` },
      { url: `${baseUrl}/en/privacy-policy` },

      // --- TERMOS DE SERVIÇO ---
      { url: `${baseUrl}/pt/terms-of-use` },
      { url: `${baseUrl}/en/terms-of-use` },

    ]
  }
