const { createClient } = require("@supabase/supabase-js")
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

module.exports = async (req, res) => {
    const { code } = req.query
    if (!code) return res.status(400).json({ error: "No code provided" })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return res.status(500).json({ error: error.message })
    res.redirect(`/?token=${data.session.access_token}`)
}