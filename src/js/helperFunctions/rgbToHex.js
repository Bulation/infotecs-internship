export default function rgbToHex(rgbString) {
  console.log(rgbString);
  const regExp = /\(([^)]+)\)/;
  const rgbArray = regExp.exec(rgbString)[1].split(',');
  return `#${rgbArray.map((rgb) => toHex(rgb)).join('')}`;
}

function toHex(rgb) {
  if (rgb <= 0) {
    return '00';
  }
  if (rgb >= 255) {
    return 'FF';
  }
  rgb = Number(rgb).toString(16);
  if (rgb.length != 2) {
    return '0' + rgb;
  }
  return rgb;
}