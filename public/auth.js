const token = localStorage.getItem("token")

async function Init() {
    if (!token) return

    const Res = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` }
    })

    if (!Res.ok) {
        localStorage.removeItem("token")
        return
    }

    const { user } = await Res.json()
    SetLoggedIn(user)
}

function SetLoggedIn(User) {
    const avatar = User.user_metadata.avatar_url
    const username = User.user_metadata.full_name || User.user_metadata.name
    const email = User.email

    document.getElementById("authorize").style.display = "none"
    document.getElementById("profile_menu").style.display = "flex"

    document.getElementById("profile_avatar").src = avatar
    document.getElementById("profile_name").textContent = username
    document.getElementById("dropdown_avatar").src = avatar
    document.getElementById("dropdown_name").textContent = username
    document.getElementById("dropdown_email").textContent = email

    const download = document.getElementById("download")
    download.disabled = false
    download.querySelector("path").setAttribute("fill", "#fff")

    document.getElementById("profile_trigger").addEventListener("click", () => {
        document.getElementById("profile_dropdown").classList.toggle("open")
    })

    document.addEventListener("click", (e) => {
        if (!document.getElementById("profile_menu").contains(e.target)) {
            document.getElementById("profile_dropdown").classList.remove("open")
        }
    })
}

async function logout() {
    await fetch("/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
    })
    localStorage.removeItem("token")
    window.location.reload()
}

const params = new URLSearchParams(window.location.search)
const session_token = params.get("token")
if (session_token) {
    localStorage.setItem("token", session_token)
    window.history.replaceState({}, "", "/")
}

Init()