import * as db from './db.js';
import { alert } from './alert.js'

export const checkPresence = async (productNames) => {
    const arrivedDevices = await db.getArrivingDevices(productNames)
    for (const device of arrivedDevices) {
        const isSisterHome = device.includes("누나")
        const isFatherHome = device.includes("아빠")
        if (isSisterHome) {
            await alert("arrived", "누나")
        }
        if (isFatherHome) {
            await alert("arrived", "아빠")
        }
    }
    
    await db.upsertHomeDevices(productNames);
    const leavingDevices = await db.getLeavingDevices(productNames);
    for (const device of leavingDevices) {
        const isSisterHome = device.includes("누나")
        const isFatherHome = device.includes("아빠")
        if (isSisterHome) {
            await alert("arrived", "누나")
        }
        if (isFatherHome) {
            await alert("arrived", "아빠")
        }
    }
    await db.markDevicesAway(leavingDevices)
}
