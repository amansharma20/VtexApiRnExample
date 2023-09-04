export const calculatePrice = val => {
  if (val == undefined || val == 'null' || val == 'NAN' || val == '') {
    return 0;
  }
  return val / 100;
};
