export const getBoxColor = type => {
  switch (type) {
    default:
      return 'transparent';
  }
};

export const drawImg = (ctx, i, j, imgName, coinNumber) => {
  // To draw a road behind the player and the walls
  //if(imgName !== 'road') drawImg(ctx, i, j, 'road');

  const img = document.createElement('img');
  img.src = `../ressources/images/${imgName === 'coin' ? `coin${coinNumber}.png` : imgName + '.png'}`;
  ctx.drawImage(img, 0, 0, 30, 30, i * 30 + 1, j * 30 + 1, 30, 30);
};