import { createContext, useContext } from 'react'

export const AdminThemeContext = createContext({ theme: 'light', toggle: () => {} })

export const useAdminTheme = () => useContext(AdminThemeContext)
