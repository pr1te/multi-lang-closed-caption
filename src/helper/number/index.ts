import _ from 'lodash';

/**
 * Convert string to number
 *
 * @description
 * Convert numeric string to a number otherwise return 0
 */
function number (value: string): number {
  return _.toNumber(value) || 0;
}

export default number;
