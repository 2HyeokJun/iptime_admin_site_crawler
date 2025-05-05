import axios from 'redaxios';

export const alert = async (type, target) => {
    let emoji = getTags(type, target);
    let status = type === "arrived" ? "HOME" : "OUT"

    await axios.post(
        process.env.ALERT_SITE,
        `${target} ${status}`,
        {
            headers: {
            Tags: emoji,
            'Content-Type': 'text/plain'
            }
        }
    );

}

const getTags = (type, target) => {
    if (target === "누나") {
        return "heavy_check_mark"
    }
    // target = "아빠"
    if (type === "arrived" || target === "HJ's_S22U") {
        return "skull"
    }
    if (type === "out") {
        return "tada"
    }
    
}
