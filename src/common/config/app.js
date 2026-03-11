"use strict";

const path = require("path");

const app = {
  notificaciones: {
    BASE_URL : 'https://localhost:4000',
    TOKEN    : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5ZmY3NmEwLWFmNGMtNDBmYS1iMDM4LWY2ZGI3NTA4NzAyYSIsIm5vbWJyZSI6IlpFUk8iLCJpZEVudGlkYWQiOiI3NDUwMzRkYS0wNmNiLTRkOTgtOGZlZS00Yzk4MmFkZmJiMjIiLCJpYXQiOjE2NDg2NjE2OTN9.atbZ5-fjpDXEIo32lCjbx_6eWezpEppK-qpWr39sJvg'
  },
  appPort         : 3001,
  fileStoragePath : 'files',
  pdfReciclados     : '/var/www/PDF_RECICLADOS',
  cookieDori: 'oc7gagq9n50pivk3nt1n3e2qp7',
  doriUrlSuperBuscador: '',
  BACKEND_URL_LOCAL : 'http:/127.0.0.1:3001',
  backendUrl      : 'https://correspondencia.sepdavi.gob.bo/backend/',
  FRONTEND_VERIFICAR : '',
  sipfaUrl : '',
  logsConfig      : {
    path       : 'logs/logs.log',
    level      : 'debug',
    maxLogSize : 10485760,
    backups    : 8
  },
  rootPath                    : path.resolve(__dirname),
  aprobacionCiudadaniaDigital : true,
  obtenerRegistrosSRH: false,
  verificarConexionIOP: false,
  incluirOsTickets: true,
  limiteFirmasPendientes: 500,
  webpush                     : {
    PUBLIC_KEY  : 'BMOfX236PiL1l4hYQnHv5vEZGWbxbLDXPyOc8fcGu-uhk6vkryhTTYMk9BI03AGN7vtYGyEzDEz2j9utIZy2SOs',
    PRIVATE_KEY : 'lvDV-X9fqrrt7wxfghyT4pZxMmE4gd6UUMlMc15Et9Y'
  },
  deletePath                  : '/var/www/PDF_RECICLADOS',
  ARCHIVOS_PUBLICOS : path.join(__dirname, '../../../public'),
  bandejaExterna    : false,
  servicios         : {
    dori: {
      url   : '',
      token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAiOiJTSUlBUkJFIiwic2VydmljaW8iOiJET1JJIiwiaWF0IjoxNjM4ODE0ODA3fQ.M0TSifP4SrShTyE72CrTDeo5jGlFgS-QJAx-eFYi1SA'
    },
    srh: {
      url   : '',
      iopToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBkYWNiODYwLTQ1OWYtNDM3MS1iMzFiLWI4NWEzZmExYWY5ZSIsIm5vbWJyZSI6Inplcm8iLCJpZFVzdWFyaW8iOm51bGwsImlhdCI6MTcwNjg4OTQ0OH0.tR04PxHJVSHMZZtuSnxIfhKVkTCvA6EAsmWh9BvAR4o'
    },
    osTicket: {
      url   : '',
      token : '297441FEDA3979E9D592FB14B9B6187D',
      secret: 'c7%~3xZ"2Wk4CpXsS4|eC|:Q(OVg0uNt'
    }

  }
};

module.exports = app;
