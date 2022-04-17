consoleChecker();

async function consoleChecker() {
    console.log(`La console est bien démarrée.`)
}

let hasPlayed = false;
function handleFirstPlay(event) {
  if(hasPlayed === false) {
    hasPlayed = true;

    let vid = event.target;

    vid.onplay = null;

    // Start whatever you need to do after first playback has started
  }
}