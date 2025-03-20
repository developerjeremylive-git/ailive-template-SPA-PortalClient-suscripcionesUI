import React, { createContext, useContext, useState, useEffect } from 'react'

interface AppContextType {
	isDarkTheme: boolean
	isSnowEnabled: boolean
	isPurpleTheme: boolean
	isGraphEnabled: boolean
	toggleTheme: () => void
	toggleSnow: () => void
	toggleGraph: () => void
	toggleBackgroundTheme: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
	const [isDarkTheme, setIsDarkTheme] = useState(() => {
		const saved = localStorage.getItem('theme')
		return saved ? saved === 'dark' : true
	})
	const [isSnowEnabled, setIsSnowEnabled] = useState(() => {
		const saved = localStorage.getItem('snow')
		return saved ? saved === 'true' : false
	})
	const [isPurpleTheme, setIsPurpleTheme] = useState(() => {
		const saved = localStorage.getItem('backgroundTheme')
		return saved ? saved === 'purple' : true
	})
	const [isGraphEnabled, setIsGraphEnabled] = useState(() => {
		const saved = localStorage.getItem('graph')
		return saved ? saved === 'true' : false
	})

	// Apply theme classes to document root
	useEffect(() => {
		const root = document.documentElement
		// Remove all theme classes first
		root.classList.remove('light-theme', 'dark-theme', 'purple-theme', 'gray-theme', 'dark-mode')
		
		if (isDarkTheme) {
			root.classList.add('dark-mode')
			// Dark theme variables
			root.style.setProperty('--bg-gradient-from', '#111827') // gray-900
			root.style.setProperty('--bg-gradient-to', '#1f2937') // gray-800
			
			// Theme variables for components
			root.style.setProperty('--theme-background', '#111827')
			root.style.setProperty('--theme-text-primary', '#ffffff')
			root.style.setProperty('--theme-text-secondary', '#9ca3af')
			root.style.setProperty('--theme-text-highlight', '#a5b4fc')
			root.style.setProperty('--theme-background-highlight', '#4f46e5')
			root.style.setProperty('--theme-background-highlight-hover', '#4338ca')
			root.style.setProperty('--theme-border', '#374151')
			root.style.setProperty('--theme-border-focus', '#6366f1')
			root.style.setProperty('--theme-border-current-plan', '#6366f1')
			root.style.setProperty('--theme-border-popular-plan', '#8b5cf6')
			root.style.setProperty('--theme-border-other-plan', '#374151')
		} else {
			root.style.setProperty('--bg-gradient-from', '#4c1d95') // purple-900
			root.style.setProperty('--bg-gradient-to', '#5b21b6') // violet-800
			
			// Theme variables for components
			root.style.setProperty('--theme-background', '#4c1d95')
			root.style.setProperty('--theme-text-primary', '#ffffff')
			root.style.setProperty('--theme-text-secondary', '#ddd6fe')
			root.style.setProperty('--theme-text-highlight', '#e9d5ff')
			root.style.setProperty('--theme-background-highlight', '#a855f7')
			root.style.setProperty('--theme-background-highlight-hover', '#9333ea')
			root.style.setProperty('--theme-border', '#7e22ce')
			root.style.setProperty('--theme-border-focus', '#c084fc')
			root.style.setProperty('--theme-border-current-plan', '#c084fc')
			root.style.setProperty('--theme-border-popular-plan', '#a855f7')
			root.style.setProperty('--theme-border-other-plan', '#7e22ce')
		}

		// Add bg-theme-gradient class to style.css
		const style = document.createElement('style')
		style.textContent = `
			.bg-theme-gradient {
				background-image: linear-gradient(to bottom, var(--bg-gradient-from), var(--bg-gradient-to));
			}
		`
		document.head.appendChild(style)

		// Store theme preferences
		localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light')

		return () => {
			document.head.removeChild(style)
		}
	}, [isDarkTheme])

	useEffect(() => {
		localStorage.setItem('snow', String(isSnowEnabled))
	}, [isSnowEnabled])

	useEffect(() => {
		localStorage.setItem('graph', String(isGraphEnabled))
	}, [isGraphEnabled])

	const toggleTheme = () => {
		setIsDarkTheme(prev => !prev)
	}

	const toggleSnow = () => setIsSnowEnabled(prev => !prev)
	
	const toggleGraph = () => setIsGraphEnabled(prev => !prev)

	const toggleBackgroundTheme = () => {
		setIsDarkTheme(prev => !prev)
	}

	return (
		<AppContext.Provider value={{ 
			isDarkTheme, 
			isSnowEnabled,
			isPurpleTheme,
			isGraphEnabled,
			toggleTheme, 
			toggleSnow,
			toggleGraph,
			toggleBackgroundTheme
		}}>
			{children}
		</AppContext.Provider>
	)
}

export function useApp() {
	const context = useContext(AppContext)
	if (context === undefined) {
		throw new Error('useApp must be used within an AppProvider')
	}
	return context
}