export default function fuzzysearch(s1: string, s2: string): boolean {
    return shareCharacters(s1, s2) && levenshtein(s1, s2) < s2.length;
}

function shareCharacters(s1: string, s2: string): boolean {
    let superSetStr = s1;
    let subSetStr = s2;
    
    if (s1.length < s2.length) {
        superSetStr = s2;
        subSetStr = s1;
    }

    let superSet = new Set(superSetStr)
    
    let shareAll = true;

    for (let i = 0; i < subSetStr.length; i++) shareAll = shareAll && superSet.has(subSetStr.charAt(i));
    return shareAll;
}


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
                matrix[i][j] = Math.min(remove, replace, insert) + 1
            }
        }
    }

    return matrix[lengthS1][lengthS2]
}