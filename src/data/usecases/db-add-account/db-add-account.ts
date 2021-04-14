import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
  Encrypter
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(addAccountModel.password)
    const accountData = { ...addAccountModel, password: hashedPassword }
    return await this.addAccountRepository.add(accountData)
  }
}
