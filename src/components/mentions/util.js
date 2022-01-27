export const keyMap = {
  BACKSPACE: 'Backspace',
  ESCAPE: 'Escape',
  ARROWDOWN: 'ArrowDown',
  ARROWUP: 'ArrowUp',
  ENTER: 'Enter',
};

export const defaultTextarea = ['input', 'textarea'];

export const setSelectionRange = (element, startPostion, endPostion) => {
  if (element) {
    element.focus();
    element.setSelectionRange(startPostion, endPostion);
  }
};

export const scrollIntoView = (element) => {
  if (element) {
    element.scrollIntoView(false);
  }
}