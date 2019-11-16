export default function judgeScrollToBottom(surplus=0){
    return document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight - surplus ? true : false
}

