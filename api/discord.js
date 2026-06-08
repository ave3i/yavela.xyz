const { createClient } = require("@supabase/supabase-js")
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

module.exports = async (req, res) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: { redirectTo: process.env.REDIRECT_URL }
    })
    if (error) return res.status(500).json({ error: error.message })
    res.redirect(data.url)
}