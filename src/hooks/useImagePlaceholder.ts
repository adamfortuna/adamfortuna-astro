import { createContext, useContext } from 'react'

export interface ImageType {
  image: string
  blurDataURL: string
}

export interface ImageContextType {
  [name: string]: ImageType
}
const initialContext: ImageContextType = {}
export const ImageContext = createContext(initialContext)

export const useImagePlaceholder = (image: string) => {
  const imageContext = useContext(ImageContext)
  const keys = Object.keys(imageContext)
  return keys.indexOf(image) === -1 ? null : imageContext[image].blurDataURL
}
