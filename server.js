const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/proxy", async (req, res) => {
    const url = "https://teleclub.xyz/activar"; 

    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

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

app.listen(3000, () => console.log("Proxy corriendo en http://localhost:3000"));
