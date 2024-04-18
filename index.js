const { Client } = require('discord.js-selfbot-v13')
const express = require('express')
const app = express()
const client = new Client()
let bumpCount = 0
let errorMessage = null

app.get('/', (req, res) => {
  if (errorMessage) {
    res.send(`Error: ${errorMessage}`)
  } else {
    res.send(`Bump Count: ${bumpCount}`)
  }
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`)

  const channel = await client.channels.fetch(process.env.BUMP_CHANNEL)

  async function bump() {
    try {
      await channel.sendSlash('302050872383242240', 'bump')
      bumpCount++
      console.count('Bumped!')
    } catch (error) {
      errorMessage = `Error bumping: ${error.message}`
    }
  }

  function loop() {
    // send bump message every 2-3 hours, to prevent detection.
    var randomNum = Math.round(Math.random() * (9000000 - 7200000 + 1)) + 7200000
    setTimeout(function () {
      bump()
      loop()
    }, randomNum)
  }

  bump()
  loop()
})

client.login(process.env.TOKEN)
