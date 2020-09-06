import { createMuiTheme, useMediaQuery, Theme } from '@material-ui/core'
import { useMemo } from 'react'

const useTheme = () => {
  // Check if we need to use dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme: Theme = useMemo(
    () => {
      return createMuiTheme({
        palette: {
          primary: {
            main: '#0B132B'
          },
          type: prefersDarkMode ? 'dark' : 'light'
        }
      })
    }, [prefersDarkMode]
  )

  return theme
}

export default useTheme
