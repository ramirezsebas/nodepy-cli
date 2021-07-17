export const isValidCommand = (command) => {
    switch (command) {
        case "new":
            return true;
        default:
            return false;
    }
}