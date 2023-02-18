import client from './api-client'

function createRoom(body) {
  return client('room/create', { body })
}

function joinRoom(body) {
  return client('room/join', { body })
}

export { createRoom, joinRoom }
