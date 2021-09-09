import {describe, test, expect} from '@jest/globals'
import Routes from '../../src/routes';

describe('#Routes test suite', () => {
  describe('#setSocketInstance', () => {
    test('setSocket should store io instance', () => {
        const routes = new Routes()
        const ioObj = {
            to: (id) => ioObj,
            emit: (event, message) => { }
        }

        routes.setSocketInstance(ioObj)
        expect(routes.io).toStrictEqual(ioObj)
    })
  })
  
});