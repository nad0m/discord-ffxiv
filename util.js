const schedule = require('node-schedule')
const fs = require('fs')

let rawJobsData = fs.readFileSync('jobs.json')
let jobs = JSON.parse(rawJobsData)

const compareJobLevel = (prev = null, current = null) => {
  if (!prev || current.Level - prev.Level === 0 || !prev.Level) {
    return null
  }

  const diff = current.Level - prev.Level

  return `${current.Name}: ${prettyNum(prev.Level)} -> ${prettyNum(current.Level)} (+${prettyNum(diff)})`
}

function prettyNum(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const compareCharacter = (prev = null, current = null) => {
  if (JSON.stringify(prev) === JSON.stringify(current) || !prev) {
    return null
  }
  const { ClassJobs: prevClassJobs = {} } = prev
  const { Name, ClassJobs: currClassJobs } = current

  const field = {
    name: `>>> ${Name}`
  }

  const stringBuilder = []

  Object.keys(currClassJobs).forEach(name => {
    const currLevel = currClassJobs[name]
    const current = {
      Name: name,
      Level: currLevel
    }

    if (prevClassJobs) {
      let key = name
      if (typeof prevClassJobs[key] === 'undefined') {
        key = jobs[name]
      }
      const prevLevel = prevClassJobs[key]
      const prev = {
        Name: key,
        Level: prevLevel
      }
      const jobLevel = compareJobLevel(prev, current)
      if (jobLevel) {
        stringBuilder.push(compareJobLevel(prev, current))
      }
    }
  })

  field.value = colorYellow(stringBuilder.join('\n'))

  return field
}

const compareList = (prev, current) => {
  let memberList = []

  Object.keys(current).forEach(id => {
    const prevChar = prev[id]
    const currChar = current[id]
    const charResult = compareCharacter(prevChar, currChar)

    if (charResult !== null) {
      memberList.push(charResult)
    }
  })

  return memberList
}

const runSchedule = (onSchedule) => {
  schedule.scheduleJob({hour: 5, minute: 0}, function(){
    onSchedule()
  })
}

// Utils
function md(text) {
  const startTilde = "```\n";
  const endTilde = "\n```";

  return `${startTilde}${text}${endTilde}`;
}

function colorBlue(text) {
  const startTilde = "```ini\n[";
  const endTilde = "]\n```";

  return `${startTilde}${text}${endTilde}`;
}

function colorYellow(text) {
  const startTilde = "```fix\n";
  const endTilde = "\n```";

  return `${startTilde}${text}${endTilde}`;
}

function colorGreen(text) {
  const startTilde = "```diff\n+ ";
  const endTilde = " +\n```";

  return `${startTilde}${text}${endTilde}`;
}

function colorRed(text) {
  const startTilde = "```diff\n- ";
  const endTilde = " -\n```";

  return `${startTilde}${text}${endTilde}`;
}

module.exports = {
  compareJobLevel,
  compareCharacter,
  compareList,
  runSchedule
}