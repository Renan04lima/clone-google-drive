import {describe, test, expect, jest} from '@jest/globals'
import Routes from '../../src/routes';

describe('#Routes test suite', () => {
  const defaultParams = {
    request: {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method: '',
        body: {}
    },
    response: {
        setHeader: jest.fn(),
        writeHead: jest.fn(),
        end: jest.fn()
    },
    values: () => Object.values(defaultParams)
  }

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
  
  describe('#handler', () => {
    test('given an inexistent route it should choose default route', async () => {
        const routes = new Routes()
        const params = {
            ...defaultParams
        }

        params.request.method = 'inexistent'
        await routes.handler(...params.values())
        expect(params.response.end).toHaveBeenCalledWith('hello world')
    })
  })

  test('it should set any request with CORS enabled', async () => {
    const routes = new Routes()
    const params = {
        ...defaultParams
    }

    params.request.method = 'inexistent'
    await routes.handler(...params.values())
    expect(params.response.setHeader)
        .toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
  })

  test('given method OPTIONS it should choose options route', async () => {
    const routes = new Routes()
    const params = {
        ...defaultParams
    }

    params.request.method = 'OPTIONS'
    await routes.handler(...params.values())
    expect(params.response.writeHead).toHaveBeenCalledWith(204)
    expect(params.response.end).toHaveBeenCalled()
  })

});