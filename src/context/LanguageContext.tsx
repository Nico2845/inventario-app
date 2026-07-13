import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Language } from '../lib/translations'

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es')

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'es' ? 'en' : 'es'))
  }

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
  }

  const value = useMemo(() => ({ language, toggleLanguage, setLanguage }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }

  return context
}
