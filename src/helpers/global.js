export const downloadFileFromString = ({ data, fileName }) => {
  var downloadLink = document.createElement('a');
  var blob = new Blob(['\ufeff', data]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = fileName;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

export function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

export const sortByDate = (a, b) => {
  if (!a || !isValidDate(a)) return 1;
  if (!b || !isValidDate(b)) return -1;
  return Number(b) - Number(a);
};
