export type PossibleEvaluations = "yes" | "no" | undefined
export function evaluateTextMessage(text: string): PossibleEvaluations {

    if(yesCriteria(text) && noCriteria(text)) {
        return undefined;
    }
    if(yesCriteria(text)) {
        return "yes";
    }
    if(noCriteria(text)) {
        return "no";
    }

    if(yesCriteria(text, false) && noCriteria(text, false)) {
        return undefined;
    }
    if(yesCriteria(text, false)) {
        return "yes";
    }
    if(noCriteria(text, false)) {
        return "no";
    }

    return undefined;
}
function yesCriteria(text: string, strict = true): boolean {
    if(strict) {
        if(text.startsWith("1") || text.match(/sim/gi)) {
            return true;
        }
    } else {
        if(text.includes("1")) {
            return true;
        }
    }
    return false;
}

function noCriteria(text: string, strict = true): boolean {
    if(strict) {
        if(text.startsWith("2") || text.match(/nao|não/gi)) {
            return true;
        }
    } else {
        if(text.includes("2")) {
            return true;
        }
    }
    return false;
}