// discussions-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'discussions'
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const ObjectId = Schema.ObjectId
  const schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    pics: [
      {
        url: { type: String },
        credit: { type: String }
      }
    ],
    categories: [
      {
        type: ObjectId,
        ref: 'categories'
      }
    ],
    tags: [
      {
        type: ObjectId,
        ref: 'tags'
      }
    ],
    group: {
      type: ObjectId,
      ref: 'groups'
    },
    accepted: {
      isAccepted: { type: Boolean, default: false },
      dt: { type: Date },
      user: {
        type: ObjectId,
        ref: 'users'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }, {
    timestamps: true
  })

  schema.virtual('author', {
    ref: 'statusContainers', // Collection
    localField: '_id', // Here
    foreignField: 'reference', // There
    justOne: true,
    options: {
      query: { type: 'discussions', relation: 'owner' },
      select: { user: 1 },
      populate: { path: 'user', select: { userName: 1, _id: 1 } }
    }
  })

  schema.virtual('latestMessage', {
    ref: 'discussionMessages', // Collection
    localField: '_id', // Here
    foreignField: 'discussion', // There
    justOne: true,
    options: {
      sort: { updatedAt: -1 },
      select: { updatedAt: 1 }
    }
  })

  schema.virtual('messagesCount', {
    ref: 'discussionMessages', // Collection
    localField: '_id', // Here
    foreignField: 'discussion', // There
    count: true
  })

  // Ensure virtual fields are serialised.
  schema.set('toJSON', { virtuals: true })
  schema.set('toObject', { virtuals: true })

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, schema)
}
