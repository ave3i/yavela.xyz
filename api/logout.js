const { createClient } = require("@supabase/supabase-js")
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

module.exports = async (req, res) => {
    const Token = req.headers.authorization?.split(" ")[1]
    if (Token) await supabase.auth.admin.signOut(Token)
    res.json({ ok: true })
}