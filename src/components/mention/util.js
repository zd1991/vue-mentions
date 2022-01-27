export const keyMap = {
  BACKSPACE: 'Backspace',
  ESCAPE: 'Escape',
  ARROWDOWN: 'ArrowDown',
  ARROWUP: 'ArrowUp',
  ENTER: 'Enter',
};

export const setSelectionRange = (element, startPostion, endPostion) => {
  element.focus();
  element.setSelectionRange(startPostion, endPostion);
};