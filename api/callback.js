const { createClient } = require("@supabase/supabase-js")
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

module.exports = async (req, res) => {
    const { code } = req.query
    if (!code) return res.status(400).json({ error: "No code provided" })
    try {
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) return res.status(500).json({ error: error.message })
        if (!session) return res.status(500).json({ error: "No session returned" })
        res.redirect(`/?token=${session.access_token}&refresh=${session.refresh_token}`)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}