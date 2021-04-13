import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface SubTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
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

const makeAddAccountRespository = (): AddAccountRepository => {
  class AddAccountRepositoryStub {
    async add (addAccount: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }

      return new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeSut = (): SubTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRespository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
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

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(makeAddAccount())

    const params = { ...makeAddAccount(), password: 'hashed_password' }
    expect(addSpy).toHaveBeenCalledWith(params)
  })

  test('should AddAccountRepository give it back the throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const error: Promise<AccountModel> = new Promise((resolve, reject) => reject(new Error('')))

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(error)

    const promise = sut.add(makeAddAccount())
    await expect(promise).rejects.toThrow()
  })
})
