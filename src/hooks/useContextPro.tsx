import { useContext } from 'react'
import { MyContext } from '../context/MyContext'

function useContextPro() {
  const context = useContext(MyContext)

  if (!context) {
    throw new Error('useContextPro must be used within a CreateContextPro')
  }

  return context
}

export default useContextPro
