'use client'

import { ChakraProvider, defaultSystem} from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'

export function Provider(props) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}

// 'use client'

// import { ChakraProvider } from '@chakra-ui/react'
// import { ColorModeProvider } from './color-mode' // Only if you need it

// export function Provider({ children }) {
//   return (
//     <ChakraProvider>
//       <ColorModeProvider>{children}</ColorModeProvider>
//     </ChakraProvider>
//   )
// }



