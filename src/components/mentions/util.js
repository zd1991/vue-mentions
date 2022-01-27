export const keyMap = {
  BACKSPACE: 'Backspace',
  ESCAPE: 'Escape',
  ARROWDOWN: 'ArrowDown',
  ARROWUP: 'ArrowUp',
  ENTER: 'Enter',
};

export const defaultTextarea = ['input', 'textarea'];

export const setSelectionRange = (element, startPostion, endPostion) => {
  element.focus();
  element.setSelectionRange(startPostion, endPostion);
};