"use client"
import React, { useState, useEffect, useRef } from "react"
import {
  Mic,
  MicOff,
  Phone,
  Heart,
  Activity,
  Zap,
  Wifi,
  Volume2,
} from "lucide-react"

// Type definitions for SpeechRecognition (not built-in)
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

const HospitalVoiceBot = () => {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [confidence, setConfidence] = useState(0)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    setIsClient(true)

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    const SpeechSynthesis = window.speechSynthesis

    if (SpeechRecognition && SpeechSynthesis) {
      setIsSupported(true)

      const recognition: SpeechRecognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"
      recognitionRef.current = recognition

      recognition.onstart = () => {
        console.log("Speech recognition started")
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcript = result[0].transcript
          const conf = result[0].confidence

          if (result.isFinal) {
            finalTranscript += transcript
            setConfidence(conf || 0.8)
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(finalTranscript || interimTranscript)

        if (finalTranscript) {
          handleSpeechResult(finalTranscript)
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      synthRef.current = SpeechSynthesis
    }

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString())
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSpeechResult = async (text: string) => {
    console.log("Processing speech:", text)

    const res = await fetch("/api/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: text }),
    })

    const { details } = await res.json()

    if (
      !details ||
      !details.patientName ||
      !details.doctorName ||
      !details.datetime
    ) {
      speakResponse(
        "Sorry, I couldn't understand the details clearly. Please try again."
      )
      return
    }

    const appointmentRes = await fetch("/api/appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    })

    const result = await appointmentRes.json()
    speakResponse(result.message || "Something went wrong while scheduling.")
  }

  const speakResponse = (text: string) => {
    if (synthRef.current && isSupported) {
      setIsSpeaking(true)

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 0.8

      const voices = synthRef.current.getVoices()
      const preferredVoice = voices.find(
        (voice) =>
          voice.name.includes("Google") ||
          voice.name.includes("Microsoft") ||
          voice.lang.startsWith("en")
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      synthRef.current.speak(utterance)
    }
  }

  const toggleListening = () => {
    if (!isSupported || !recognitionRef.current) {
      alert(
        "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari."
      )
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setTranscript("")
    } else {
      setTranscript("")
      setConfidence(0)
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const simulateSpeaking = () => {
    speakResponse(
      "Hello! I am MediAssist AI, your digital hospital receptionist. How may I assist you today?"
    )
  }

  // Static particles data to prevent hydration mismatch
  const particles = [
    { left: 10, top: 20, size: 2, delay: 0.5, duration: 3 },
    { left: 80, top: 10, size: 1, delay: 1.2, duration: 2.5 },
    { left: 30, top: 70, size: 3, delay: 0.8, duration: 4 },
    { left: 90, top: 60, size: 1.5, delay: 2, duration: 3.5 },
    { left: 15, top: 90, size: 2.5, delay: 1.5, duration: 2.8 },
    { left: 70, top: 30, size: 1, delay: 0.3, duration: 3.2 },
    { left: 50, top: 15, size: 2, delay: 1.8, duration: 2.2 },
    { left: 25, top: 50, size: 1.5, delay: 0.7, duration: 3.8 },
    { left: 85, top: 80, size: 3, delay: 1.1, duration: 2.7 },
    { left: 60, top: 45, size: 1, delay: 1.6, duration: 3.3 },
    { left: 5, top: 35, size: 2.5, delay: 0.4, duration: 2.9 },
    { left: 95, top: 25, size: 1.5, delay: 1.9, duration: 3.1 },
    { left: 40, top: 85, size: 2, delay: 0.6, duration: 2.4 },
    { left: 75, top: 5, size: 1, delay: 1.4, duration: 3.6 },
    { left: 20, top: 65, size: 2.5, delay: 0.9, duration: 2.6 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Advanced animated background */}
      <div className="absolute inset-0">
        {/* Hexagonal grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(0, 255, 255, 0.2) 2px, transparent 2px),
            radial-gradient(circle at 75px 75px, rgba(147, 51, 234, 0.2) 2px, transparent 2px)
          `,
            backgroundSize: "100px 100px",
            animation: "float 8s ease-in-out infinite",
          }}
        />

        {/* Scanning lines */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"
            style={{ top: "20%", animationDuration: "3s" }}
          />
          <div
            className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"
            style={{
              top: "60%",
              animationDuration: "4s",
              animationDelay: "1s",
            }}
          />
          <div
            className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"
            style={{
              top: "80%",
              animationDuration: "5s",
              animationDelay: "2s",
            }}
          />
        </div>
      </div>

      {/* Enhanced floating particles */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, ${
                i % 3 === 0
                  ? "rgba(6, 182, 212, 0.6)"
                  : i % 3 === 1
                  ? "rgba(147, 51, 234, 0.6)"
                  : "rgba(59, 130, 246, 0.6)"
              }, transparent)`,
              boxShadow: `0 0 ${particle.size * 2}px ${
                i % 3 === 0
                  ? "rgba(6, 182, 212, 0.3)"
                  : i % 3 === 1
                  ? "rgba(147, 51, 234, 0.3)"
                  : "rgba(59, 130, 246, 0.3)"
              }`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Holographic corner effects */}
      <div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-conic from-cyan-500/20 via-transparent to-purple-500/20 rounded-full blur-3xl animate-spin"
        style={{ animationDuration: "30s" }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-conic from-purple-500/20 via-transparent to-pink-500/20 rounded-full blur-3xl animate-spin"
        style={{ animationDuration: "25s", animationDirection: "reverse" }}
      />

      {/* Main container */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Enhanced futuristic header */}
        <div className="text-center mb-12">
          <div className="relative mb-8">
            {/* Animated underline */}
            <div
              className="mt-2 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse mx-auto"
              style={{ width: "60%" }}
            />
          </div>

          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 bg-slate-800/40 backdrop-blur-sm border border-yellow-400/30 rounded-full px-4 py-2">
              <Zap className="text-yellow-400 w-5 h-5 animate-pulse" />
              <span className="text-yellow-300 text-sm font-mono tracking-wider">
                QUANTUM AI
              </span>
            </div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            <div className="flex items-center gap-2 bg-slate-800/40 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-2">
              <Wifi className="text-green-400 w-5 h-5" />
              <span className="text-green-300 text-sm font-mono tracking-wider">
                NEURAL LINK
              </span>
            </div>
          </div>

          <p className="text-blue-200/90 text-xl font-light tracking-[0.15em] mb-2">
            ADVANCED MEDICAL AI RECEPTIONIST
          </p>
          <p className="text-purple-300/70 text-sm tracking-wider">
            VOICE INTERFACE v3.7.2
          </p>

          {/* Enhanced time display */}
          {isClient && (
            <div className="mt-6 flex justify-center">
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-md border-2 border-cyan-500/40 rounded-2xl px-6 py-3 shadow-2xl shadow-cyan-500/20">
                <div className="text-cyan-300 text-lg font-mono tracking-[0.2em] drop-shadow-lg">
                  {currentTime}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced central voice interface */}
        <div className="relative flex items-center justify-center mb-16">
          {/* Multiple orbital rings */}
          <div
            className="absolute w-96 h-96 rounded-full border-2 border-cyan-500/10 animate-spin"
            style={{ animationDuration: "30s" }}
          >
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-400/50"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${
                    i * 30
                  }deg) translateY(-190px)`,
                }}
              />
            ))}
          </div>

          <div
            className="absolute w-80 h-80 rounded-full border border-purple-500/20 animate-spin"
            style={{ animationDuration: "20s", animationDirection: "reverse" }}
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-purple-400/80 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${
                    i * 45
                  }deg) translateY(-155px)`,
                }}
              />
            ))}
          </div>

          {/* Enhanced ripple effects */}
          {isSpeaking && (
            <>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border-2 animate-ping"
                  style={{
                    width: `${160 + i * 25}px`,
                    height: `${160 + i * 25}px`,
                    borderColor:
                      i % 4 === 0
                        ? "rgba(6, 182, 212, 0.6)"
                        : i % 4 === 1
                        ? "rgba(147, 51, 234, 0.5)"
                        : i % 4 === 2
                        ? "rgba(59, 130, 246, 0.4)"
                        : "rgba(168, 85, 247, 0.3)",
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "1.2s",
                    boxShadow: `0 0 20px ${
                      i % 4 === 0
                        ? "rgba(6, 182, 212, 0.3)"
                        : i % 4 === 1
                        ? "rgba(147, 51, 234, 0.3)"
                        : i % 4 === 2
                        ? "rgba(59, 130, 246, 0.3)"
                        : "rgba(168, 85, 247, 0.3)"
                    }`,
                  }}
                />
              ))}
            </>
          )}

          {/* Main enhanced orb */}
          <div
            className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-700 transform ${
              isSpeaking
                ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-2xl shadow-cyan-500/60 scale-115"
                : isListening
                ? "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 shadow-2xl shadow-green-500/60 scale-110"
                : "bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 shadow-xl shadow-slate-500/40"
            }`}
          >
            {/* Multiple inner layers */}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full transition-all duration-700 ${
                  isSpeaking
                    ? "bg-gradient-to-r from-cyan-300/20 via-blue-400/15 to-purple-500/20"
                    : isListening
                    ? "bg-gradient-to-r from-green-300/20 via-emerald-400/15 to-teal-500/20"
                    : "bg-gradient-to-r from-slate-500/15 via-slate-400/10 to-slate-600/15"
                }`}
                style={{
                  inset: `${(i + 1) * 8}px`,
                }}
              />
            ))}

            {/* Central icon with enhanced effects */}
            <div className="relative z-10">
              {isListening ? (
                <div className="relative">
                  <Mic className="w-20 h-20 text-white drop-shadow-2xl animate-pulse" />
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute -inset-4 bg-green-400/20 rounded-full blur-xl animate-ping" />
                </div>
              ) : isSpeaking ? (
                <div className="relative">
                  <Volume2 className="w-20 h-20 text-white drop-shadow-2xl animate-pulse" />
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute -inset-4 bg-cyan-400/20 rounded-full blur-xl animate-ping" />
                </div>
              ) : (
                <div className="relative">
                  <MicOff className="w-20 h-20 text-white/90 drop-shadow-2xl" />
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-xl" />
                </div>
              )}
            </div>

            {/* Enhanced rotating border effects */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-spin"
              style={{ animationDuration: "2s" }}
            />
            <div
              className="absolute inset-2 rounded-full bg-gradient-to-l from-transparent via-white/10 to-transparent animate-spin"
              style={{ animationDuration: "3s", animationDirection: "reverse" }}
            />
          </div>

          {/* Enhanced audio visualizer */}
          {isListening && (
            <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2">
              <div className="flex items-end gap-1">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t from-green-500 via-emerald-400 to-teal-300 rounded-full animate-pulse shadow-lg"
                    style={{
                      width: "4px",
                      height: `${Math.sin(i * 0.4) * 20 + 25}px`,
                      animationDelay: `${i * 0.05}s`,
                      animationDuration: "0.6s",
                      boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Speech recognition display */}
        {(transcript || isListening) && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10">
              <div className="text-center mb-3">
                <span className="text-cyan-400 text-sm font-mono tracking-wider">
                  VOICE INPUT
                </span>
                {confidence > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-slate-600/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-green-400 text-xs mt-1 block">
                      Confidence: {Math.round(confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>
              <p className="text-white text-lg font-light tracking-wide text-center min-h-[2rem]">
                {transcript || (isListening ? "Listening..." : "")}
              </p>
            </div>
          </div>
        )}

        {/* Enhanced status display */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h2 className="text-3xl text-white font-light mb-3 tracking-[0.1em]">
              {isSpeaking
                ? "NEURAL PROCESSING..."
                : isListening
                ? "VOICE ANALYSIS ACTIVE"
                : "AWAITING INPUT COMMAND"}
            </h2>
            <div className="flex justify-center">
              <div
                className={`px-8 py-3 rounded-2xl border-2 backdrop-blur-md shadow-2xl ${
                  isSpeaking
                    ? "border-cyan-400/60 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 text-cyan-300"
                    : isListening
                    ? "border-green-400/60 bg-gradient-to-r from-green-900/30 to-emerald-900/30 text-green-300"
                    : "border-slate-400/60 bg-gradient-to-r from-slate-900/30 to-slate-800/30 text-slate-300"
                }`}
              >
                <p className="text-sm tracking-[0.15em] font-mono">
                  {isSpeaking
                    ? "ANALYZING REQUEST • GENERATING RESPONSE"
                    : isListening
                    ? "VOICE RECOGNITION ACTIVE • SPEAK CLEARLY"
                    : isSupported
                    ? "VOICE INTERFACE READY • TAP TO ACTIVATE"
                    : "VOICE NOT SUPPORTED • USE MODERN BROWSER"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced control panel */}
        <div className="flex justify-center gap-12 mb-12">
          {/* Main interaction button */}
          <button
            onClick={toggleListening}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-125 active:scale-95 ${
              isListening
                ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700 shadow-2xl shadow-red-500/60"
                : "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-2xl shadow-blue-500/60"
            }`}
            disabled={isSpeaking}
          >
            <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
            <div
              className="absolute inset-1 rounded-full bg-gradient-to-r from-white/10 to-transparent animate-spin"
              style={{ animationDuration: "2s" }}
            />
            {isListening ? (
              <Phone className="w-10 h-10 text-white transform rotate-135 drop-shadow-2xl" />
            ) : (
              <Mic className="w-10 h-10 text-white drop-shadow-2xl" />
            )}
          </button>

          {/* Demo speaking button */}
          <button
            onClick={simulateSpeaking}
            className="relative w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 flex items-center justify-center transition-all duration-500 transform hover:scale-125 active:scale-95 shadow-2xl shadow-purple-500/60"
            disabled={isSpeaking || isListening}
          >
            <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
            <div
              className="absolute inset-1 rounded-full bg-gradient-to-l from-white/10 to-transparent animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <Activity className="w-10 h-10 text-white drop-shadow-2xl" />
          </button>
        </div>

        {/* Enhanced info grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-900/60 backdrop-blur-md rounded-3xl p-8 border-2 border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-500 shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
              <span className="text-green-400 text-base font-mono tracking-[0.1em]">
                24/7 NEURAL NET
              </span>
            </div>
            <div className="text-white/80 text-sm tracking-wide">
              CONTINUOUS MEDICAL INTELLIGENCE
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-900/60 backdrop-blur-md rounded-3xl p-8 border-2 border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 shadow-2xl shadow-purple-500/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping" />
              <span className="text-blue-400 text-base font-mono tracking-[0.1em]">
                OMNI-LINGUAL
              </span>
            </div>
            <div className="text-white/80 text-sm tracking-wide">
              UNIVERSAL COMMUNICATION PROTOCOL
            </div>
          </div>
        </div>

        {/* Enhanced emergency protocol */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-900/40 via-red-800/30 to-red-900/40 backdrop-blur-md rounded-3xl p-6 border-2 border-red-500/40 shadow-2xl shadow-red-500/20">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Heart className="text-red-400 w-6 h-6 animate-pulse" />
              <span className="text-red-400 text-lg font-mono tracking-[0.15em]">
                EMERGENCY PROTOCOL ACTIVE
              </span>
              <Heart className="text-red-400 w-6 h-6 animate-pulse" />
            </div>
            <div className="text-red-300/90 text-sm tracking-[0.1em]">
              CRITICAL SITUATIONS: EMERGENCY SERVICES → 911
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  )
}

export default HospitalVoiceBot
