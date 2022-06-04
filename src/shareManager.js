const {JsonDB} = require('node-json-db')
const {Config} = require('node-json-db/dist/lib/JsonDBConfig')
const { v4: uuidv4 } = require('uuid');

const db = new JsonDB(new Config('shares'))

module.exports.createUser = (username) => {
    const id = uuidv4()
    const newUser = {
        id,
        username
    }
    db.push(`/users/${id}`, newUser)
    return newUser
}
