import { AddAccountModel } from '../../../domain/usecases/add-account'
import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encypter'

interface SubTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeAddAccount = (): AddAccountModel => {
  const addAccount: AddAccountModel = {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  }

  return addAccount
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SubTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('DBAddAccount Usecase', () => {
  test('should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(makeAddAccount())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('should DbAddAccount give it back the throws', async () => {
    const { sut, encrypterStub } = makeSut()
    const error: Promise<string> = new Promise((resolve, reject) => reject(new Error('')))

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(error)

    const promise = sut.add(makeAddAccount())
    await expect(promise).rejects.toThrow()
  })
})
