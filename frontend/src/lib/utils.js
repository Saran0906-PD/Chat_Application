export function formateMessageTime(time){
    return new Date(time).toLocaleTimeString("en-US",{
        hour:"2-digit",
        minute:"2-digit",
        hour12:false,
    })
}