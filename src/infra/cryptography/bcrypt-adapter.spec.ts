import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

interface SubTypes {
  sut: BcryptAdapter
  salt: number
}

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  }
}))

const makeSut = (): SubTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  return {
    sut,
    salt
  }
}

describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct value', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return a hash on success', async () => {
    const { sut } = makeSut()
    const response = await sut.encrypt('any_value')
    expect(response).toBe('hash')
  })
})
