require("dotenv").config()
const express = require("express")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

const app = express()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

app.get("/auth/discord", async (req, res) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
            redirectTo: process.env.REDIRECT_URL
        }
    })

    if (error) return res.status(500).json({ error: error.message })
    res.redirect(data.url)
})

app.get("/auth/callback", async (req, res) => {
    const { code } = req.query
    if (!code) return res.status(400).json({ error: "No code provided" })

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return res.status(500).json({ error: error.message })

    res.redirect(`/?token=${data.session.access_token}`)
})

app.get("/auth/me", async (req, res) => {
    const Token = req.headers.authorization?.split(" ")[1]
    if (!Token) return res.status(401).json({ error: "No token" })

    const { data, error } = await supabase.auth.getUser(Token)
    if (error) return res.status(401).json({ error: error.message })

    res.json({ user: data.user })
})

app.post("/auth/logout", async (req, res) => {
    const Token = req.headers.authorization?.split(" ")[1]
    if (Token) {
        await supabase.auth.admin.signOut(Token)
    }
    res.json({ ok: true })
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Running on port ${process.env.PORT || 3000}`)
})