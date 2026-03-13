  /** @type {import('next').MetadataRoute.Sitemap} */
  export default function sitemap() {
    const baseUrl = 'https://decmatrix.com'

    return [
      // --- HOME ---
      { url: `${baseUrl}/pt`, lastModified: new Date() },
      { url: `${baseUrl}/en`, lastModified: new Date() },

      // --- CALCULADORA JUROS SIMPLES ---
      { url: `${baseUrl}/pt/simple-interest-calculator`, lastModified: new Date() },
      { url: `${baseUrl}/en/simple-interest-calculator`, lastModified: new Date() },

      // --- CALCULADORA JUROS COMPOSTOS ---
      { url: `${baseUrl}/pt/compound-interest-calculator`, lastModified: new Date() },
      { url: `${baseUrl}/en/compound-interest-calculator`, lastModified: new Date() },

      // --- ÁRVORE AVL ---
      { url: `${baseUrl}/pt/avl-tree-builder`, lastModified: new Date() },
      { url: `${baseUrl}/en/avl-tree-builder`, lastModified: new Date() },

      // --- ÁRVORE BST ---
      { url: `${baseUrl}/pt/bst-tree-builder`, lastModified: new Date() },
      { url: `${baseUrl}/en/bst-tree-builder`, lastModified: new Date() },

      // --- EQUAÇÃO DE SEGUNDO GRAU ---
      { url: `${baseUrl}/pt/quadratic-equation-calculator`, lastModified: new Date() },
      { url: `${baseUrl}/en/quadratic-equation-calculator`, lastModified: new Date() },
      
      // --- SOMA E SUBTRAÇÃO DE MATRIZES ---
      { url: `${baseUrl}/pt/matrix-basic-operations`, lastModified: new Date() },
      { url: `${baseUrl}/en/matrix-basic-operations`, lastModified: new Date() },

      // --- MULTIPLICAÇÃO DE MATRIZES ---
      { url: `${baseUrl}/pt/matrix-multiplication`, lastModified: new Date() },
      { url: `${baseUrl}/en/matrix-multiplication`, lastModified: new Date() },

      // --- BUBBLE SORT ---
      { url: `${baseUrl}/pt/bubble-sort`, lastModified: new Date() },
      { url: `${baseUrl}/en/bubble-sort`, lastModified: new Date() },

      // --- INSERTION SORT ---
      { url: `${baseUrl}/pt/insertion-sort`, lastModified: new Date() },
      { url: `${baseUrl}/en/insertion-sort`, lastModified: new Date() },

      // --- SELECTION SORT ---
      { url: `${baseUrl}/pt/selection-sort`, lastModified: new Date() },
      { url: `${baseUrl}/en/selection-sort`, lastModified: new Date() },

      // --- MULTIPLICAÇÃO DE MATRIZES ---
      { url: `${baseUrl}/pt/matrix-multiplication`, lastModified: new Date() },
      { url: `${baseUrl}/en/matrix-multiplication`, lastModified: new Date() },

      // --- POLÍTICA DE PRIVACIDADE ---
      { url: `${baseUrl}/pt/privacy-policy`, lastModified: new Date() },
      { url: `${baseUrl}/en/privacy-policy`, lastModified: new Date() },

      // --- TERMOS DE SERVIÇO ---
      { url: `${baseUrl}/pt/terms-of-service`, lastModified: new Date() },
      { url: `${baseUrl}/en/terms-of-service`, lastModified: new Date() },
      
    ]
  }