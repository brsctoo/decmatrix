export function convertBase(number, fromBase, toBase) {
    const decimalNumber = parseInt(number, fromBase); // transforma o número da base original para decimal
    return decimalNumber.toString(toBase); // transforma o número decimal para a base desejada
}

export function validateInput(number, base) {
    const cleanNumber = number.trim(); // Remove espaços em branco
    if (!cleanNumber) return true; // Permitir input vazio

    const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, base); // Base n usa do 0 até o n-1
    const regex = new RegExp(`^-?[${validChars}]+(\\.[${validChars}]+)?$`, 'i'); // Verifica se o número contém apenas validChars
    return regex.test(cleanNumber);
}