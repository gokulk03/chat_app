const APP_ID='4f1f98d5c4684a1faab60461ba31798a'
const CHANNEL = 'main'
const TOKEN = '007eJxTYLjaqvqRi8nRZ4cNh688c9GswDWL5vyaceDT7seZ0tMDWbwUGEzSDNMsLVJMk03MLEwSDdMSE5PMDEzMDJMSjQ3NLS0SGcrepzQEMjK8usfCysgAgSA+C0NuYmYeAwMA2/seRA=='
console.log('streams.js connected')
let UID;

const client= AgoraRTC.createClient({mode:'rtc',codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async()=>{

    client.on('user-published',handleUserJoined)
    client.on('user-left',handlUserLeft)
    UID = await client.join(APP_ID,CHANNEL,TOKEN,null)
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()
    let player = '<div class="video-container" id="user-container-${UID}"><div class="username-wrapper"><span class="user-name">My Name</span></div><div class ="video-player" id="user-${UID}"></div></div>'
    document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)

    localTracks[1].play('user-${UID}')
    await client.publish([localTracks[0],localTracks[1]])

}

let handleUserJoined = async(user,mediatype)=>{
    remoteUsers[user.uid]=user
    await client.subscribe(user,mediatype)

    if(mediatype =='video'){
        let player = document.getElementById('user-container-${user.uid}')
        if(player!=null){
            player.remove()
        }

    
        player = '<div class="video-container" id="user-container-${user.uid}"><div class="username-wrapper"><span class="user-name">My Name</span></div><div class ="video-player" id="user-${user.uid}"></div></div>'
        document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)
        user.videoTrack.play('user-${user.uid}')
    }
    if(mediatype=='audio'){
        user.audioTrack.play()
    }
}

let handlUserLeft = async(user)=> {
    delete remoteUsers[user.uid]
    document.getElementById('user-container-${user.uid}').remove()
}

joinAndDisplayLocalStream()
    