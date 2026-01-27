import { useEffect, useRef, useState } from "react"
import axios from "axios"

// ================= ASSETS =================
import logo from "../public/logo.png"
import desktopVideo from "../public/videos/hero-desktop.mp4"
import mobileVideo from "../public/videos/hero-mobile.mp4"

export default function App() {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [timeLeft, setTimeLeft] = useState({})
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  // 🔊 MOBILE SOUND TOGGLE
  const toggleSound = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  const handleSubmit = async () => {
    if (!email) {
      alert("Email required")
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(
        "http://localhost:5000/api/contact/contact-add",
        { email }
      )


      alert("Thank you for joining the circle ✨")
      setEmail("")
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // ⏳ COUNTDOWN
  useEffect(() => {
    const targetDate = new Date("2026-02-22T00:00:00")

    const timer = setInterval(() => {
      const now = new Date()
      const diff = targetDate - now
      if (diff <= 0) return

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white">
        <div className="h-20 flex items-center justify-center">
          <img src={logo} alt="Logo" className="h-16 md:h-20" />
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden">

        {/* DESKTOP VIDEO */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover hidden md:block">
          <source src={desktopVideo} type="video/mp4" />
        </video>

        {/* DESKTOP OVERLAY */}
        <div className="hidden md:block absolute inset-0 bg-black/50"></div>

        {/* MOBILE VIDEO */}
        <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover md:hidden">
          <source src={mobileVideo} type="video/mp4" />
        </video>

        {/* SOUND (MOBILE) */}
        <div
          onClick={toggleSound}
          className="md:hidden absolute bottom-28 left-1/2 -translate-x-1/2 text-white text-xs cursor-pointer"
          style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "0.1em" }}
        >
          {muted ? "Tap To Enable Sound" : "Tap To Disable Sound"}
        </div>

        {/* BOUNCY ARROW */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-10 h-10 border border-white rounded-full flex items-center justify-center animate-bounce">
            <svg
              width="14"
              height="18"
              viewBox="0 0 24 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4V26M12 26L6 20M12 26L18 20"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="bg-white text-black flex flex-col items-center text-center px-4 pt-16 lg:pt-24 pb-10">

        {/* MAIN TITLE */}
        <h1
          className="
            tracking-[0.3em]
            text-lg md:text-5xl
            font-medium md:font-light
            mb-2 md:mb-6
          "
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.2em" }}
        >
          AN OLFACTIVE JOURNEY
        </h1>

        {/* SUBTITLE */}
        <h2
          className="
            tracking-[0.3em]
            text-lg md:text-5xl
            font-medium md:font-thin
            // mb-6
          "
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.2em" }}
        >
          UNFOLDS WITHIN
        </h2>

        {/* EMAIL INPUT */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            mt-10
            w-[70%] md:w-[420px]
            bg-gray-50
            px-4 py-3
            text-center
            text-base        
            text-black
            placeholder:text-gray-600
            placeholder:text-sm         
            placeholder:italic
            outline-none
            font-normal
          "
          style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "0.1em" }}
        />

        {/* BUTTONS */}
        <div className="mt-5"></div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="text-xl relative overflow-hidden hidden md:inline-block group"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.2em" }}
        >
          {loading ? "Please Wait..." : "Enter The Circle"}
          <span className="absolute left-1/2 bottom-0 h-[2px] w-0 bg-black transition-all duration-500 group-hover:left-0 group-hover:w-full"></span>
        </button>


        <button
          className="text-lg md:hidden mt-0 font-medium"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.2em" }}
        >
          Enter The Circle
        </button>

        {/* COUNTDOWN */}
        <p
          className="mt-14 text-sm font-extralight md:text-base"
          style={{
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: "0.2em",
          }}
        >
          Unveiling In
        </p>

        <div className="mt-6 flex justify-center gap-8 md:gap-20">
          <TimeBox value={timeLeft.days} label="Days" />
          <TimeBox value={timeLeft.hours} label="Hours" />
          <TimeBox value={timeLeft.minutes} label="Mins" />
        </div>

        {/* SOCIAL ICONS */}
        <div className="mt-16 flex gap-6">
          <h1
            className=" text-xs font-extralight md:text-base"

            style={{
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "0.2em",
            }}
          >JOIN US ON INSTAGRAM</h1>
          {/* <img src={"/icons/tiktok.svg"} className="w-6" />
          <img src={"/icons/facebook.svg"} className="w-7" />
          <img src={"/icons/instagram.svg"} className="w-8" /> */}
        </div>

        {/* COPYRIGHT */}
        <p
          className="mt-5 text-[10px]"
          style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "0.1em" }}
        >
          ©2026 All Copyrights Reserved
        </p>
      </section>
    </div>
  )
}

const TimeBox = ({ value, label }) => (
  <div className="flex flex-col items-center text-center w-[64px] md:w-[96px]">
    <div
      className="text-3xl md:text-6xl font-thin leading-none"
      style={{ fontFamily: "'Poppins', monospace", letterSpacing: "0.15em" }}
    >
      {value?.toString().padStart(2, "0") || "00"}
    </div>

    <div
      className="mt-1 text-[10px] md:text-sm text-gray-500 leading-none"
      style={{
        fontFamily: "'Montserrat', sans-serif",
        letterSpacing: "0.15em",
        transform: "translateX(-0.16em)",
      }}
    >
      {label}
    </div>
  </div>
)
