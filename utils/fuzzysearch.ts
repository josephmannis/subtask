function levenshtein(s1: string, s2: string): number {
    let lengthS1 = s1 ? s1.length : 0;
    let lengthS2 = s2 ? s2.length : 0;

    if (lengthS1 === 0) return lengthS2;
    if (lengthS2 === 0) return lengthS1;

    let matrix: Array<number[]> = new Array(lengthS1 + 1)

    for (let i = 0; i < lengthS1 + 1; i++) {
        matrix[i] = new Array(5);
        matrix[i][0] = i;
    }

    for (let j = 1; j < lengthS2 + 1; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i < lengthS1 + 1; i++) {
        for (let j = 1; j < lengthS2 + 1; j++) {
            let char1 = s1.charAt(i - 1);
            let char2 = s2.charAt(j - 1);

            if (char1 === char2) {
                matrix[i][j] = matrix[i - 1][j - 1]
            } else {
                let remove = matrix[i - 1][j]
                let replace = matrix[i - 1][j - 1]
                let insert = matrix[i][j - 1]

                let value = remove

                if (replace <= value) value = replace
                if (insert <= value) value = insert

                matrix[i][j] = value + 1
            }
        }
    }

    return matrix[lengthS1][lengthS2]

    // Go over the matrix
    // if chars at string[i] and string[j] don't match:
        // Check three functions:
        // matrix[i- 1][j] (delete)
        // matrix[i- 1][ j - 1] (replace)
        // matrix[i][j - 1] (insert)
        // Fill in matrix[i][j] with the minimun of these three + 1
    // if they do match:
        // use matrix[i - 1][j - 1]
    // 

}