const compareJobLevel = (prev = null, current = null) => {
  if (!prev || current.Level - prev.Level === 0) {
    return null
  }

  const diff = current.Level - prev.Level

  return {
    name: current.Name,
    value: `${current.Level} (+${diff})`,
    inline: true
  }
}

const compareCharacter = (prev = null, current = null) => {
  if (JSON.stringify(prev) === JSON.stringify(current) || !prev) {
    return null
  }
  const { ClassJobs: prevClassJobs = {} } = prev
  const { Name, ClassJobs: currClassJobs } = current

  const stringBuilder = [{ name: `-----------------------\n>>> ${Name}`, value: '\u200b' }]

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

  stringBuilder.push({
    name: '-----------------------',
    value: '\u200b',
  })

  return stringBuilder
}

const compareList = (prev, current) => {
  let memberList = []

  Object.keys(current).forEach(id => {
    const prevChar = prev[id]
    const currChar = current[id]
    const charResult = compareCharacter(prevChar, currChar)

    if (charResult !== null) {
      memberList = [...memberList, ...charResult]
    }
  })

  return memberList
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
  compareList
}