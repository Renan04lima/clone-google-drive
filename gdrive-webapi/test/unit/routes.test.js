import { describe, test, expect, jest } from '@jest/globals'
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

  const makeSut = () => {
    const sut = new Routes()
    const params = {
      ...defaultParams
    }
    const ioObj = {
      to: (id) => ioObj,
      emit: (event, message) => { }
    }

    return { sut, params, ioObj }
  }


  describe('#setSocketInstance', () => {
    test('setSocket should store io instance', () => {
      const { sut, ioObj } = makeSut()

      sut.setSocketInstance(ioObj)
      expect(sut.io).toStrictEqual(ioObj)
    })
  })

  describe('#handler', () => {
    test('given an inexistent route it should choose default route', async () => {
      const { sut, params } = makeSut()

      params.request.method = 'inexistent'
      await sut.handler(...params.values())
      expect(params.response.end).toHaveBeenCalledWith('hello world')
    })

    test('it should set any request with CORS enabled', async () => {
      const { sut, params } = makeSut()

      params.request.method = 'inexistent'
      await sut.handler(...params.values())
      expect(params.response.setHeader)
        .toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
    })

    test('given method OPTIONS it should choose options route', async () => {
      const { sut, params } = makeSut()

      params.request.method = 'OPTIONS'
      await sut.handler(...params.values())
      expect(params.response.writeHead).toHaveBeenCalledWith(204)
      expect(params.response.end).toHaveBeenCalled()
    })

    test('given method POST it should choose post route', async () => {
      const { sut, params } = makeSut()

      params.request.method = 'POST'
      jest.spyOn(sut, sut.post.name).mockResolvedValue()

      await sut.handler(...params.values())
      expect(sut.post).toHaveBeenCalled()
    })

    test('given method GET it should choose get route', async () => {
      const { sut, params } = makeSut()
      jest.spyOn(sut, sut.get.name).mockResolvedValue()

      params.request.method = 'GET'
      await sut.handler(...params.values())
      expect(sut.get).toHaveBeenCalled()
    })
  })

  describe('#get', () => {
    test('given method GET it should list all files downloaded', async () => {
      const { sut, params } = makeSut()

      const filesStatusesMock = [
        {
          size: "188 kB",
          lastModified: '2021-09-03T20:56:28.443Z',
          owner: 'erickwendel',
          file: 'file.txt'
        }
      ]
      jest.spyOn(sut.fileHelper, sut.fileHelper.getFilesStatus.name)
        .mockResolvedValue(filesStatusesMock)

      params.request.method = 'GET'
      await sut.handler(...params.values())


      expect(params.response.writeHead).toHaveBeenCalledWith(200)
      expect(params.response.end).toHaveBeenCalledWith(JSON.stringify(filesStatusesMock))

    })
  })

});