// Copyright (c) 2020 Wouter van der Wal

import { nl } from 'date-fns/locale'
import 'moment/locale/nl'

export const serverUrl = localStorage.getItem('serverUrl')
export const authHeader = {
  Authorization: `Bearer ${localStorage.getItem('apiKey')}`
}
export const version = '0.3-beta.4'
export const systemEmail = 'trackless@outlook.com'
export const momentLocale = 'nl'
export const pickersLocale = nl
