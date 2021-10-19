import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'
import Store from '../'

class statistics extends BaseModel {
  /*
  constructor (data, options) {
    super(data, options)
  }
  */

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'statistics'
  // Define default properties here
  static instanceDefaults () {
    return {
    }
  }
}
const servicePath = 'statistics'
const servicePlugin = makeServicePlugin({
  Model: statistics,
  service: feathersClient.service(servicePath),
  servicePath,
  handleEvents: {
    updated: (item) => {
      Store.commit('SET_USER_COUNT', item)
      return item
    }
  }
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
})

export default servicePlugin
