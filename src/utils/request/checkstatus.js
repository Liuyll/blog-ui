export default function checkstatus(response) {
    if (response.status >= 200 && response.status < 400) {
        return true
    } else {
        console.error(`error status:${response.status}`)
    }
}