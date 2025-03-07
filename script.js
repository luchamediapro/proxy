fetch("https://ip-01dt.onrender.com/get-video")
    .then(response => response.json())
    .then(data => {
        const iframe = document.createElement("iframe");
        iframe.src = data.embedUrl; // Enlace temporal generado
        iframe.width = "100%";
        iframe.height = "500px";
        iframe.style.border = "none";
        document.body.appendChild(iframe);
    })
    .catch(error => console.error("Error cargando el video:", error));
