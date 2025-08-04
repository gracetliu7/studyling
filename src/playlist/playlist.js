function embedPlaylist() {
  const url = document.getElementById("playlistInput").value.trim();
  const errorMessage = document.getElementById("errorMessage");
  const container = document.getElementById("playlistContainer");

  errorMessage.innerHTML = ""; // Clear previous error

  if (url.includes("youtube.com/playlist")) {
    try {
      const listId = new URL(url).searchParams.get("list");
      if (listId) {
        container.innerHTML = `
        <div style="border-radius:12px; overflow:hidden;">
        <iframe width="300px" height="380px"
          src="https://www.youtube.com/embed/videoseries?list=${listId}"
          frameborder="0" allowfullscreen></iframe>
          </div>`;
      } else {
        errorMessage.innerHTML = "<p>Invalid YouTube playlist URL.</p>";
      }
    } catch {
      errorMessage.innerHTML = "<p>Invalid YouTube playlist URL.</p>";
    }
  } else if (url.includes("spotify.com/playlist")) {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    if (match) {
      const playlistId = match[1];
      container.innerHTML = `<iframe style="border-radius:12px"
        src="https://open.spotify.com/embed/playlist/${playlistId}"
        width="300px" height="380px" frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"></iframe>`;
    } else {
      errorMessage.innerHTML = "<p>Invalid Spotify playlist URL.</p>";
    }
  } else {
    errorMessage.innerHTML = "<p>Unsupported playlist URL.</p>";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById("playlistInput");
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      embedPlaylist();
    }
  });
});
