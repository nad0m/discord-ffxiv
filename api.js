require("dotenv").config()
const XIVAPI = require('xivapi-js')
const xiv = new XIVAPI()
const server = "Midgardsormr"
const fetch = require('node-fetch')
const { compareList } = require('./util')

const getFCMemberIds = async () => {
    //find the FC with its name and server
    let res = await xiv.freecompany.search('Crystal Thorn', { server })

    //get the FC ID
    let id = res.Results[0].ID
  
    //get and return fc members
    let fc = await xiv.freecompany.get(id, {data: 'FCM'})
    const promises = fc.FreeCompanyMembers.map(member => getMemberClassJobs(member))
    return promises
}

const getMemberClassJobs = async ({ ID }) => {
  const res = await xiv.character.get(ID, { data: 'CJ' })
  //channel.send(res.Results[0].ID)
  return res
}

const processClassJobs = ClassJobs => {
  return ClassJobs.reduce((acc, { UnlockedState: { Name } = {}, Level }) => {
    return { 
      ...acc,
      [Name]: Level
    }
  }, {})
}

const getDataFromXIV = async () => {
  const promises = await getFCMemberIds()
  const members = await Promise.all(promises)
  const processedMembers = members.reduce((acc, { Character: { ID, Name, ClassJobs = [] } = {} }) => {
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
    headers: {'secret-key': process.env.API_KEY}
  });
  const json = await response.json();

  return json
}

const putDataToDB = async body => {
	const response = await fetch(process.env.DB, {
		method: 'put',
		body: JSON.stringify(body),
		headers: {
      'Content-Type':	'application/json',
      'secret-key': process.env.API_KEY,
      'versioning': 'false'
    }
	});
  const json = await response.json();
  console.log(json)
}

const getStatus = async cb => {
  const prev = await getDataFromDB()
  const curr = await getDataFromXIV()
  const result = compareList(prev, curr)

  cb(result)
  //putDataToDB(curr)
}

module.exports = {
  getFCMemberIds,
  getDataFromXIV,
  getDataFromDB,
  putDataToDB,
  getStatus
}