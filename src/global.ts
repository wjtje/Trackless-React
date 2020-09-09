// Copyright (c) 2020 Wouter van der Wal

import { nl } from 'date-fns/locale'
import 'moment/locale/nl'

export const serverUrl = 'http://localhost:55565'
export const authHeader = {
  Authorization: `Bearer ${localStorage.getItem('apiKey')}`
}
export const version = '0.3-beta.1'
export const systemEmail = 'info@company.com'
export const momentLocale = 'nl'
export const pickersLocale = nl
