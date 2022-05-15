import _ from 'lodash';

function truth (value: any): boolean {
  const truthList = [ true, 'true', 'enable', 'yes', '1', 1 ];
  const normalisedString = String(value).trim().toLowerCase();

  return _.includes(truthList, normalisedString);
}

export default truth;
