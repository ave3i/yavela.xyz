const { createClient } = require("@supabase/supabase-js")
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

module.exports = async (req, res) => {
    const Token = req.headers.authorization?.split(" ")[1]
    if (!Token) return res.status(401).json({ error: "No token" })
    const { data, error } = await supabase.auth.getUser(Token)
    if (error) return res.status(401).json({ error: error.message })
    res.json({ user: data.user })
}