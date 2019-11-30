export const getBoxColor = type => {
  switch (type) {
    default:
      return '#ffffff';
  }
};

export const drawImg = (ctx, i, j, imgName) => {
  // To draw a road behind the player and the walls
  if(imgName !== 'road') drawImg(ctx, i, j, 'road');

  const img = document.createElement('img');
  img.src = `../ressources/images/${imgName}.png`;
  ctx.drawImage(img, 0, 0, 30, 30, i * 30, j * 30, 30, 30);
};