require("dotenv").config()
const XIVAPI = require('xivapi-js')
var Bottleneck = require("bottleneck");
const xiv = new XIVAPI({
  private_key: process.env.XIV_KEY,
})
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 2000
});
const id = "9232519973597993951"
const fetch = require('node-fetch')
const { compareList } = require('./util')

const getFCMemberIds = async () => {
  //find the FC with its name and server
  try {
    let fc = await xiv.freecompany.get(id, { data: 'FCM', columns: 'FreeCompanyMembers' })
    const promises = fc.FreeCompanyMembers.map(async member => {
      return getMemberClassJobs(member)
    })
    return promises
  } catch (e) {
    return false
  }
}

const getMemberClassJobs = async ({ ID }) => {
  const res = await limiter.schedule(() => xiv.character.get(ID, { data: 'CJ' }))
  
  return res
}

const processClassJobs = ClassJobs => {
  return ClassJobs.reduce((acc, { UnlockedState: { Name } = {}, Level, ExpLevel }) => {
    const { Total_XP } = acc
    return {
      ...acc,
      [Name]: Level,
      Total_XP: parseInt(ExpLevel) + Total_XP
    }
  }, { Total_XP: 0 })
}

const getDataFromXIV = async () => {
  let promises = await getFCMemberIds()

  while (!promises) {
    promises = await getFCMemberIds()
  }

  const members = await Promise.all(promises)
  const processedMembers = members.reduce((acc, { Character = {} }) => {
    const { ID, Name, ClassJobs } = Character
    return {
      ...acc,
      [ID]: {
        Name,
        ClassJobs: processClassJobs(ClassJobs)
      }
    }
  }, {})

  return processedMembers
}

const getDataFromDB = async () => {
  const response = await fetch(process.env.DB, {
    method: 'get',
    headers: { 'secret-key': process.env.API_KEY }
  });
  const json = await response.json();

  return json
}

const putDataToDB = async body => {
  const response = await fetch(process.env.DB, {
    method: 'put',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'secret-key': process.env.API_KEY,
      'versioning': 'false'
    }
  });
  const json = await response.json();
}

const getStatus = async (cb, updateDB = false) => {
  const prev = await getDataFromDB()
  const curr = await getDataFromXIV()
  const result = compareList(prev, curr)

  cb(result)

  if (updateDB && result) {
    putDataToDB(curr)
  }
}

module.exports = {
  getFCMemberIds,
  getDataFromXIV,
  getDataFromDB,
  putDataToDB,
  getStatus
}