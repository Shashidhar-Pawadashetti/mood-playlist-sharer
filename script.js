document.getElementById("getPlaylists").addEventListener("click", async () => {
    const mood = document.getElementById("moodInput").value;
    const playlistContainer = document.getElementById("playlistContainer");
    playlistContainer.innerHTML = ""; // clear previous results
  
    try {
      const res = await fetch(`https://mood-playlist-sharer-3.onrender.com/playlists?mood=${mood}`);
      const data = await res.json();
  
      if (!data.length) {
        playlistContainer.innerHTML = "<p>No playlists found for this mood.</p>";
        return;
      }
  
      data.forEach(playlist => {
        const col = document.createElement("div");
        col.className = "col-md-4";
  
        const card = `
          <div class="card h-100 shadow-sm">
            <img src="${playlist.image}" class="card-img-top" alt="${playlist.name}">
            <div class="card-body">
              <h5 class="card-title">${playlist.name}</h5>
              <a href="${playlist.url}" target="_blank" class="btn btn-success">Open in Spotify</a>
            </div>
          </div>
        `;
  
        col.innerHTML = card;
        playlistContainer.appendChild(col);
      });
    } catch (error) {
      console.error("Error fetching playlists:", error);
      playlistContainer.innerHTML = "<p>Failed to fetch playlists. Please try again.</p>";
    }
  });
  