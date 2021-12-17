'use strict'

import { Bot } from 'grammy'
import { apiThrottler } from '@grammyjs/transformer-throttler'

import commands from './commands/index.js'

const throttler = apiThrottler()

const bot = new Bot(process.env.BOT_TOKEN)

bot.api.config.use(throttler)
bot.use(async (ctx, next) => {
  const id = ctx.from?.id
  // eslint-disable-next-line no-eval
  if (eval(process.env.ADMIN_IDS).includes(id)) {
    await next()
    return
  }

  await ctx.reply('Вы не админ')
})

bot.use(...commands)
bot.catch((err) => {
  const ctx = err.ctx
  console.error(`Error while handling update ${ctx.update.update_id}:`)
})

// async function filter(ctx) {
//   const id = ctx.from?.id
//   // eslint-disable-next-line no-eval
//   if (eval(process.env.ADMIN_IDS).includes(id)) {
//     return true
//   }

//   await ctx.reply('Вы не админ')
//   return false
// }

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot
