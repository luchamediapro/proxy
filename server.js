app.get("/proxy", async (req, res) => {
    const url = "https://teleclub.xyz/activar"; // URL de la página

    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        // Espera el botón "¡Activar Ahora!" para extraerlo
        await page.waitForSelector("button", { timeout: 5000 });

        const botonHTML = await page.evaluate(() => {
            const boton = Array.from(document.querySelectorAll("button"))
                .find(b => b.innerText.includes("¡Activar Ahora!"));
            return boton ? boton.outerHTML : "Botón no encontrado";
        });

        await browser.close();
        res.send(botonHTML);

    } catch (error) {
        res.status(500).send("Error cargando el botón.");
    }
});
