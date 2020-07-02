const schedule = require('node-schedule')

const compareJobLevel = (prev = null, current = null) => {
  if (!prev || current.Level - prev.Level === 0) {
    return null
  }

  const diff = current.Level - prev.Level

  return `${current.Name}: ${prev.Level} -> ${current.Level} (+${diff})`
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
      const prevLevel = prevClassJobs[name]
      const prev = {
        Name: name,
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
  schedule.scheduleJob({second: 0}, function(){
    onSchedule()
    console.log("schedule fired")
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