export const keyMap = {
    BACKSPACE: 'Backspace',
    ESCAPE: 'Escape',
}

export const setSelectionRange = (element, startPostion, endPostion) => {
    element.setSelectionRange(startPostion, endPostion);
}