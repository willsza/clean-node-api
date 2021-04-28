import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('should mongodb client exists', async () => {
    sut.client = null
    const accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })

  test('should reconnect if mongodb is down', async () => {
    await sut.disconnect()
    const accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
