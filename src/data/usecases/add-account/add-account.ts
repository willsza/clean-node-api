import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { Encrypter } from '../../protocols/encypter'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(addAccountModel.password)
    return new Promise(resolve => resolve(null))
  }
}
