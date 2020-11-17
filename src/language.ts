// Copyright (c) 2020 Wouter van der Wal

import { systemEmail } from './global'

export default {
  global: {
    btnRemove: 'Verwijderen',
    btnSave: 'Opslaan',
    btnClose: 'Sluiten',
    btnHide: 'Verbergen',
    btnShow: 'Weergeven',
    search: 'Zoeken',
    yes: 'Ja',
    no: 'Nee',
    removed: 'Verwijdert',
    saved: 'Opgeslagen',
    appName: 'Trackless'
  },

  locationDialog: {
    titleAdd: 'Nieuwe project toevoegen',
    titleEdit: 'Project aanpassen',
    contentAdd: 'Vul hieronder de gegevens in van de project die u wilt toevoegen',
    contentEdit: 'Pas hieronder de gegevens van de project aan. Of verberg het voor u medewerkers. U kan alleen een project verwijderen als het niet in gebruik is.',
    place: 'Plaats',
    name: 'Naam klant / project',
    id: 'Administratie nummer'
  },

  locationPage: {
    title: 'Projecten'
  },

  accountPage: {
    welcome: 'Welkom',
    yourDetails: 'Jouw gegevens',
    firstname: 'Voornaam',
    lastname: 'Achternaam',
    username: 'Gebruikersnaam',
    group: 'Group',
    options: 'Opties voor jouw account',
    changePassword: 'Wachtwoord aanpassen',
    activeDevices: 'Gekoppelde apparaten',
    downloadDetails: 'Gegevens downloaden',
    editUser: 'Gebruiker aanpassen'
  },

  activeDevicesDialog: {
    title: 'Gekoppelde apparaten',
    content: 'Je kan hieronder zien welke apparaten toegang hebben tot u account. Als u een apparaat wilt verwijderen kan u er op klikken.',
    lastUsed: 'Laatst gebruikt:',
    askRemoveTitle: 'Permanent verwijderen',
    askRemoveContent: (name: string) => (`Weet u zeker dat u '${name}' wilt verwijderen?`)
  },

  changePasswordDialog: {
    title: 'Wachtwoord aanpassen',
    content: 'Als u uw wachtwoord aanpast wordt u niet uitgelogt op u apparaten',
    password: 'Wachtwoord',
    rePassword: 'Wachtwoord herhalen'
  },

  downloadDetailsDialog: {
    title: 'Gegevens aanvragen',
    content: `Als u alle gegevens wilt inzien die wij over u hebben, dan kunt u een mail sturen naar ${systemEmail} met uw voledige naam en vermeld daarbij dat u, uw gegevens wilt inzien.`
  },

  editUserDialog: {
    title: 'Gebruiker aanpassen',
    firstname: 'Voornaam',
    lastname: 'Achternaam'
  },

  exportPage: {
    title: 'Exporteren naar PDF',
    exportDate: 'Export datum',
    exportUser: 'Medewerker',
    exportWeek: 'Week nummer',
    date: 'Datum',
    location: 'Project',
    comment: 'Beschrijving',
    duration: 'Duur',
    worktype: 'Werk type',
    total: 'Totaal'
  },

  historyPage: {
    title: 'Voorgaande weken'
  },

  loginPage: {
    title: 'Inloggen',
    serverUrl: 'Server',
    username: 'Gebruikersnaam',
    password: 'Wachtwoord',
    deviceName: 'Apparaat naam',
    btn: 'Inloggen',
    error: 'Gebruikersnaam of wachtwoord incorrect'
  },

  settingsPage: {
    title: 'Instellingen',
    about: 'Over',
    clientVersion: 'App versie',
    serverVersion: 'Server versie'
  },

  thisWeekPage: {
    title: 'Deze week'
  },

  todayPage: {
    title: 'Vandaag',
    suggestions: 'Suggesties'
  },

  userPage: {
    title: 'Gebruikers'
  },

  drawer: {
    subTitle: 'Test versie',
    home: 'Vandaag',
    thisWeek: 'Deze week',
    history: 'Geschidenis',
    export: 'Exporteren naar pdf',
    account: 'Account',
    location: 'Projecten',
    users: 'Gebruikers',
    settings: 'Instellingen'
  },

  exportDialog: {
    title: 'Exporteren naar PDF',
    content: 'Kies de begin en einddatum wat u wilt exporteren.',
    download: 'Downloaden',
    startedDownloading: 'Downloaden gestart',
    startDate: 'Start datum',
    endDate: 'Eind datum'
  },

  listWork: {
    location: 'Project',
    duration: 'Duur',
    comment: 'Beschrijving'
  },

  removeDialog: {
    title: 'Permanent verwijderen',
    content: 'Weet je het zeken?'
  },

  root: {
    canNotRemove: 'Kan het niet verwijderen',
    connectionError: 'Probleem met de server',
    errorUndef: 'Bent u wel verbonden met het internet?'
  },

  searchDialog: {
    title: 'Welke data wilt u zien?',
    startDate: 'Start datum',
    endDate: 'Einddatum',
    search: 'Zoeken'
  },

  workDialog: {
    titleAdd: 'Werkzaamheden',
    titleEdit: 'Werkzaamheden aanpassen',
    content: 'Vul hieronder de gegevens in van wat je hebt gedaan',
    selectLocation: 'Selecteer een locatie',
    selectWorktype: 'Selecteer een werktype',
    duration: 'Duur',
    date: 'Datum',
    comment: 'Beschrijving',
    errInput: 'De gegevens die u heeft ingevult is niet correct'
  },

  userDialog: {
    title: 'Nieuwe medewerker toevoegen',
    editTitle: 'Medewerker aanpassen',
    content: 'Geef hieronder de gegevens van de nieuwe medewerker op. Die persoon kan inloggen met zijn gebruikersnaam en wachtwoord.',
    editContent: 'Pas hier onder alle gegevens aan van een medewerker. Als het wachtwoord leeg is wordt hij niet aangepast. Waarschuwing als u een medewerker verwijderd wordt ook al zijn ingevulde werk verwijdert. Houdt daar rekening mee!',
    firstname: 'Voornaam',
    lastname: 'Achternaam',
    username: 'Gebruikersnaam',
    selectGroup: 'Selecteer een group',
    errInput: 'De gegevens die u heeft ingevult is niet correct',
    password: 'Wachtwoord',
    passwordRE: 'Wachtwoord herhalen'
  }
}
