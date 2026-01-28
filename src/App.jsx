import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { MdArrowForwardIos } from "react-icons/md"
// ================= ASSETS =================
import logo from "../public/logo2.png"
import desktopVideo from "../public/videos/hero-desktop.mp4"
import mobileVideo from "../public/videos/hero-mobile.mp4"

export default function App() {
  const videoRef = useRef(null) // Ref for mobile video (to toggle mute)
  const heroRef = useRef(null)  // Ref for hero section (for scroll effects)

  // State for mute toggle, countdown, email input, and loading state
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

  // Handle email submission
  const handleSubmit = async () => {
    if (!email) {
      alert("Email required")
      return
    }

    try {
      setLoading(true)
      await axios.post(
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

  // ⏳ COUNTDOWN TIMER - updates every second
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

  // 🌊 SCROLL EFFECTS - parallax and fade, then hide video wrapper fully after scroll past 100vh
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return

      const scrollY = window.scrollY
      const vh = window.innerHeight
      const progress = Math.min(scrollY / vh, 1)

      const videoWrapper = heroRef.current.querySelector("#video-wrapper")
      if (!videoWrapper) return

      if (progress >= 1) {
        // Hide video wrapper fully
        videoWrapper.style.display = "none"
        // Keep hero height fixed to avoid layout jump
        heroRef.current.style.height = "100vh"
        // Reset transform and opacity (no fade/translate)
        heroRef.current.style.transform = "none"
        heroRef.current.style.opacity = "1"
      } else {
        // Show video wrapper and apply parallax + fade effect
        videoWrapper.style.display = "block"
        heroRef.current.style.height = "100vh"
        heroRef.current.style.transform = `translateY(${scrollY * 0.4}px)`
        heroRef.current.style.opacity = `${1 - progress * 1.2}`
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="">
      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full z-50">
        <div className="h-20 flex mt-5 items-center justify-center px-4">
          <img src={logo} alt="Logo" className="h-24 md:h-28" />
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden will-change-transform"
      >
        {/* VIDEO WRAPPER */}
        <div id="video-wrapper" className="absolute inset-0 w-full h-full">
          {/* DESKTOP VIDEO */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover hidden md:block"
          >
            <source src={desktopVideo} type="video/mp4" />
          </video>

          {/* DESKTOP WHITE FADE-UP OVERLAY */}
          {/* 
            To increase the white fade-up over video, adjust the height and opacity here.
            I set opacity to 0.4 and height to 60% to create stronger fade.
            You can tweak bg-white/40 (40% opacity) and h-[60%] as you like.
          */}
          <div className="hidden md:block absolute bottom-0 left-0 w-full h-[60%] pointer-events-none"></div>

          {/* DESKTOP OVERLAY */}
          <div className="hidden md:block absolute inset-0 bg-black/50"></div>

          {/* MOBILE VIDEO */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover md:hidden"
          >
            <source src={mobileVideo} type="video/mp4" />
          </video>
        </div>

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
      <section
        className="bg-white h-[100vh]  text-black flex flex-col items-center text-center px-4 pt-16 lg:pt-24 pb-10 relative z-10"
      >
        <h1
          className="tracking-[0.3em] text-lg md:text-5xl font-medium md:font-light mb-2 md:mb-6"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.2em" }}
        >
          AN OLFACTIVE JOURNEY
        </h1>

        <h2
          className="tracking-[0.3em] text-lg md:text-5xl font-medium md:font-thin"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.2em" }}
        >
          UNFOLDS WITHIN
        </h2>

        {/* 
          To add space above the email field:
          Add margin-top (e.g., mt-16) here on the input or a wrapper div
        */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-16 w-[70%] md:w-[420px] bg-gray-50 px-4 py-3 text-center text-base text-black placeholder:text-gray-600 placeholder:text-sm placeholder:italic outline-none font-normal"
          style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "0.1em" }}
        />

        <div className="mt-5"></div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="hidden md:inline-flex items-center gap-2 text-xl relative overflow-hidden group"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.2em" }}
        >
          {loading ? "Please Wait..." : "Enter The Circle"}
          <MdArrowForwardIos className="h-4 w-4" />
          <span className="absolute left-1/2 bottom-0 h-[2px] w-0 bg-black transition-all duration-500 group-hover:left-0 group-hover:w-full"></span>
        </button>

        <button
          className="text-lg md:hidden mt-0 font-medium flex items-center gap-2"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.2em" }}
        >
          Enter The Circle <MdArrowForwardIos className="h-3" />
        </button>

        <p
          className="mt-14 text-sm font-extralight md:text-base"
          style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "0.2em" }}
        >
          Unveiling In
        </p>

        <div className="mt-6 flex justify-center gap-8 md:gap-20">
          <TimeBox value={timeLeft.days} label="Days" />
          <TimeBox value={timeLeft.hours} label="Hours" />
          <TimeBox value={timeLeft.minutes} label="Mins" />
        </div>

        <div className="mt-16 flex gap-6">
          <a
            href="https://www.instagram.com/maisonaditi/" // <-- Replace with your Instagram URL
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline underline-offset-8 font-extralight md:text-base"
            style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "0.2em" }}
          >
            JOIN US ON INSTAGRAM
          </a>
        </div>


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