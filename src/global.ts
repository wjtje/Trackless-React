// Copyright (c) 2020 Wouter van der Wal

export const serverUrl = 'http://localhost:55565'
export const authHeader = {
  Authorization: `Bearer ${localStorage.getItem('apiKey')}`
}
export const version = '0.3-beta.0'
