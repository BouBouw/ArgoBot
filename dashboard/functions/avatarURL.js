function avatarURL(user) {
    let avatarImg;
    if(user) {
        if (user.avatar.startsWith('a_')){
            avatarImg = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=1024`
        } else {
            avatarImg = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024`
        }
        return avatarImg ? avatarImg : 'http://localhost:3000/images/no_icon_url.png';
    } else {
        return avatarImg = 'http://localhost:3000/images/no_icon_url.png'
    }
}


module.exports = avatarURL;
