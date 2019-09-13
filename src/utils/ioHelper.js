export function parseMsg(action, payload = {}, metadata = {}, addition) {
    const meta = {
        date: Date.now(),
        ...metadata
    }

    return {
        action,
        payload,
        meta,
        addition
    }
}

export function handleTimeout(socket, event, payload,callback, timeout, handleErrorFn){
    let clearFlag = setTimeout(handleErrorFn, timeout)
    let _callback = function (err, data) {
        clearTimeout(clearFlag)
        callback(err, data)
    }
    socket.emit(event,payload, _callback)
}

