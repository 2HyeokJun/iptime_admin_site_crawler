import { checkPresence } from './check_presence.js'
import { getPresenceDeviceLists } from './crawling.js'

const crawlingLists = await getPresenceDeviceLists()
console.log("기기 리스트:", crawlingLists)
await checkPresence(crawlingLists)