"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { ProgressBar } from "@/components/progress-bar"
import { WelcomeScreen } from "@/components/screens/welcome-screen"
import { SnapshotScreen } from "@/components/screens/snapshot-screen"
import { TeamScreen } from "@/components/screens/team-screen"
import { BasicsScreen } from "@/components/screens/basics-screen"
import { ProblemScreen } from "@/components/screens/problem-screen"
import { MarketScreen } from "@/components/screens/market-screen"
import { UploadsScreen } from "@/components/screens/uploads-screen"
import { IndustryScreen } from "@/components/screens/industry-screen"
import { FinancialsScreen } from "@/components/screens/financials-screen"
import { ReviewScreen } from "@/components/screens/review-screen"
import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore"

// Initial form state
const initialState = {
  // Snapshot
  companyName: "",
  address: "",
  city: "",
  state: "",
  country: "",
  website: "",
  socials: {
    x: "",
    linkedin: "",
    instagram: "",
    tiktok: "",
    facebook: "",
  },

  // Team
  team: [
    {
      firstName: "",
      lastName: "",
      role: "",
      linkedin: "",
      email: "",
      phone: "",
      bio: "",
      skillsMarkets: "",
    },
  ],

  // Basics
  operatingName: "",
  legalName: "",
  foundedDate: "",
  stage: "",

  // Problem
  problem: "",
  strengths: "",
  productTags: [],

  // Market
  competition: "",
  traction: "",
  valuation: "",
  currency: "USD",
  keyCustomers: "",
  raising: "",
  amountRaising: "",
  salesRevenueRange: "",

  // Uploads/Narratives
  pmf: "",
  biz: "",
  vision: "",
  // Video uploads (optional URLs or file names)
  productVideo: "",
  bizVideo: "",
  companyLinkedIn: "",
  twitter: "",
  instagram: "",

  // Industry Fit
  industryFit: "",
  industryFitAlt: "",
  productDescription: "",
  productType: "",

  // Financials
  revenueRange: "",
  tradeShows: false,
  currentAssets: "",
}

// Tags for product tags selection
const PRODUCT_TAGS = [
  // Food & Nutrition
  "Specialized Diets",
  "Alternative Proteins",
  "Personalized Nutrition",
  "Supplements & Functional Ingredients",
  "Sustainable & Eco-friendly Solutions",
  "Fresh & Human-Grade Meal Services",
  "Treats & Snacks Innovation",
  
  // Pet Care & Wellness
  "Veterinary Telehealth",
  "Preventive Care & Diagnostics",
  "Pet Insurance & Financing",
  "Behavior & Training Solutions",
  "Holistic & Alternative Therapies",
  "Grooming & Hygiene",
  "Pet Mobility & Recovery Solutions",
  "Animal Medicine",
  "Animal Health, other",
  
  // Pet Tech
  "Pet Wearables & Trackers",
  "Pet-focused Social Platforms",
  "Pet Service Platforms",
  "Pet-focused E-commerce Innovations",
  "Interactive Toys & Smart Devices",
  "Pet Data & Insights Platforms",
  "AI-driven Pet Companions",
]

export function OppMapIntakeForm() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [formState, setFormState] = useState(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [docId, setDocId] = useState<string | null>(null)

  // Load draft + Firestore doc information on mount
  useEffect(() => {
    // 1️⃣ Local draft so we can show something immediately while we fetch remote copy
    const savedState = localStorage.getItem("oppFormDraft")
    if (savedState) {
      try {
        setFormState(JSON.parse(savedState))
      } catch (e) {
        console.error("Failed to parse saved form state", e)
      }
    }

    // 2️⃣ Firestore – if we have a previously created doc, load it and hydrate the form
    const savedDoc = localStorage.getItem("oppFormDocId")
    if (savedDoc) {
      setDocId(savedDoc)
      // Pull the most-recent state from Firestore
      getDoc(doc(db, "intakeForms", savedDoc))
        .then((snapshot) => {
          if (snapshot.exists()) {
            // Firestore may contain richer or fresher data than localStorage
            setFormState(snapshot.data() as typeof initialState)
          }
        })
        .catch((err) => console.error("Failed to fetch Firestore doc", err))
    }
  }, [])

  // Persist to localStorage to provide an offline experience
  useEffect(() => {
    localStorage.setItem("oppFormDraft", JSON.stringify(formState))
  }, [formState])

  // Helper to create / update the Firestore document
  const persistToFirestore = async (state: typeof initialState) => {
    // 🔍 Strip out any undefined values – Firestore rejects them
    const clean = (obj: any): any => {
      if (Array.isArray(obj)) return obj.map((v) => clean(v))
      if (obj && typeof obj === "object") {
        return Object.fromEntries(
          Object.entries(obj)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, clean(v)])
        )
      }
      return obj
    }

    const sanitizedState = clean(state)

    try {
      if (docId) {
        // Update existing doc
        await setDoc(doc(db, "intakeForms", docId), sanitizedState, { merge: true })
      } else {
        // Create new doc and remember its id
        const newDocRef = await addDoc(collection(db, "intakeForms"), sanitizedState)
        setDocId(newDocRef.id)
        localStorage.setItem("oppFormDocId", newDocRef.id)
      }
    } catch (err) {
      console.error("Failed to persist form to Firestore", err)
    }
  }

  // Update the calculateProgress function to account for the new total number of screens
  // Calculate progress based on required fields and current screen
  const calculateProgress = () => {
    const totalScreens = 10 // Including welcome screen, now with 10 total screens
    return Math.min(Math.round((currentScreen / (totalScreens - 1)) * 100), 100)
  }

  // Update form state
  const updateFormState = (updates: Partial<typeof initialState>) => {
    setFormState((prev) => {
      const newState = { ...prev, ...updates }

      // Optimistically persist – we don't await to keep UI responsive
      persistToFirestore(newState)

      // Show toast on field update
      toast({
        title: "Saved",
        duration: 1000,
      })
      return newState
    })
  }

  // Update the goToNextScreen function to account for the new maximum screen index
  // Navigate to next screen
  const goToNextScreen = () => {
    if (currentScreen < 9) {
      setCurrentScreen((prev) => prev + 1)
    }
  }

  // Navigate to previous screen
  const goToPreviousScreen = () => {
    if (currentScreen > 0) {
      setCurrentScreen((prev) => prev - 1)
    }
  }

  // 🔮 Generate narratives via OpenAI (serverless route)
  const generateNarratives = async (
    state: any,
    specificKey: string | null = null,
  ): Promise<Record<string, string>> => {
    try {
      const res = await fetch("/api/generate-narratives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, specificKey }),
      })

      if (!res.ok) throw new Error("OpenAI generation failed")

      const data = await res.json()
      return data.narratives as Record<string, string>
    } catch (err) {
      console.error(err)
      toast({
        title: "Failed to generate narrative",
        variant: "destructive",
        duration: 4000,
      })
      return {}
    }
  }

  // 🌎 Generate "Industry Fit" content via OpenAI
  const generateIndustryContent = async (
    state: any,
    specificKey: string | null = null,
  ): Promise<Record<string, string>> => {
    try {
      const res = await fetch("/api/generate-industry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, specificKey }),
      })

      if (!res.ok) throw new Error("OpenAI industry content failed")

      const data = await res.json()
      return data.content as Record<string, string>
    } catch (err) {
      console.error(err)
      toast({
        title: "Failed to generate industry content",
        variant: "destructive",
        duration: 4000,
      })
      return {}
    }
  }

  // Regenerate a specific narrative
  const regenerateNarrative = async (key: string) => {
    const newNarrative = await generateNarratives(formState, key)
    updateFormState(newNarrative)
  }

  // Regenerate a specific industry content
  const regenerateIndustryContent = async (key: string) => {
    const newContent = await generateIndustryContent(formState, key)
    updateFormState(newContent)
  }

  // Accept a narrative (in a real app, this might do more)
  const acceptNarrative = (key: string) => {
    toast({
      title: "Narrative accepted",
      description: `Your ${key} narrative has been saved.`,
      duration: 2000,
    })
  }

  // Submit the form
  const submitForm = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an actual API call
      // await fetch('/api/opps', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formState),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Form submitted successfully",
        description: "Your opportunity has been mapped!",
        duration: 5000,
      })

      // Mark the submission as final in Firestore
      if (docId) {
        await setDoc(
          doc(db, "intakeForms", docId),
          { submittedAt: new Date().toISOString() },
          { merge: true }
        )
      }

      // Clear local storage + reset state
      localStorage.removeItem("oppFormDraft")
      localStorage.removeItem("oppFormDocId")
      setDocId(null)
      setFormState(initialState)
      setCurrentScreen(0)
    } catch (error) {
      toast({
        title: "Error submitting form",
        description: "Please try again later.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render the current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return <WelcomeScreen onNext={goToNextScreen} />
      case 1:
        return (
          <BasicsScreen
            formState={formState}
            updateFormState={updateFormState}
            onNext={goToNextScreen}
            onPrevious={goToPreviousScreen}
          />
        )
      case 2:
        return (
          <SnapshotScreen
            formState={formState}
            updateFormState={updateFormState}
            onNext={goToNextScreen}
            onPrevious={goToPreviousScreen}
          />
        )
      case 3:
        return (
          <TeamScreen
            formState={formState}
            updateFormState={updateFormState}
            onNext={goToNextScreen}
            onPrevious={goToPreviousScreen}
          />
        )
      case 4:
        return (
          <ProblemScreen
            formState={formState}
            updateFormState={updateFormState}
            productTags={PRODUCT_TAGS}
            onNext={goToNextScreen}
            onPrevious={goToPreviousScreen}
          />
        )
      case 5:
        return (
          <MarketScreen
            formState={formState}
            updateFormState={updateFormState}
            onNext={goToNextScreen}
            onPrevious={goToPreviousScreen}
          />
        )
      case 6:
        return (
          <UploadsScreen
            formState={formState}
            updateFormState={updateFormState}
            generateNarratives={generateNarratives}
            regenerateNarrative={regenerateNarrative}
            acceptNarrative={acceptNarrative}
            onNext={goToNextScreen}
            onPrevious={goToPreviousScreen}
          />
        )
      case 7:
        return (
          <IndustryScreen
            formState={formState}
            updateFormState={updateFormState}
            generateIndustryContent={generateIndustryContent}
            regenerateContent={regenerateIndustryContent}
            acceptContent={acceptNarrative}
            onNext={goToNextScreen}
            onPrevious={goToPreviousScreen}
          />
        )
      case 8:
        return (
          <FinancialsScreen
            formState={formState}
            updateFormState={updateFormState}
            onNext={goToNextScreen}
            onPrevious={goToPreviousScreen}
          />
        )
      case 9:
        return (
          <ReviewScreen
            formState={formState}
            onPrevious={goToPreviousScreen}
            onSubmit={submitForm}
            isSubmitting={isSubmitting}
            setCurrentScreen={setCurrentScreen}
          />
        )
      default:
        return <WelcomeScreen onNext={goToNextScreen} />
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Logo and Progress bar - sticky at top */}
      <div className="sticky top-0 z-10 bg-white py-4">
        <div className="flex items-center justify-between mb-4">
          <Image
            src="/fetchIQ2.png"
            alt="FetchIQ Logo"
            width={120}
            height={40}
            className="h-auto"
            priority
          />
        </div>
        <ProgressBar progress={calculateProgress()} />
      </div>

      {/* Screen content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mt-6"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
