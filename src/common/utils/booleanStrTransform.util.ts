export function booleanStrTransform(value: 'true' | 'false') {
  if (value === 'true') return true;
  else if (value === 'false') return false;
  else return '';
}
