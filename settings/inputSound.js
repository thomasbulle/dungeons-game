const selector = document.getElementById('selector');
const selectorWrappet = selector.getBoundingClientRect().height;
const wrapper = document.getElementById('wrapper');
const heightWrappet = wrapper.getBoundingClientRect().height;

window.onload = () => selector.style.top = `${heightWrappet - selector.getBoundingClientRect().height}px`;

let isDraggable = false;
selector.onmousedown = () => isDraggable = true;

selector.onmousemove = e => {
  if (isDraggable === true) {
    const newValue = parseInt(selector.style.top.replace(/(?!\d+).*/g)) + e.movementY;
    selector.style.top = `${newValue < 0 ? 0 : (newValue > heightWrappet) ? (heightWrappet - selectorWrappet) : newValue}px`;
  }
};

selector.onmouseup = () => isDraggable = false;
wrapper.onmouseup = () => isDraggable = false;
wrapper.onmouseleave = () => isDraggable = false;
