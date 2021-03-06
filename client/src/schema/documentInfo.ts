import firebase from 'firebase/app'
import 'firebase/firestore'
export type DocumentInfo = {
  name: string
  tags?: string[]
  size: number
  filePath: string
  pdfPath?: string | null
  type: string | undefined // docx, pptx, pdf
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
  lastUpdatedBy: {
    name: string
    ref: firebase.firestore.DocumentReference<firebase.firestore.DocumentData> // User
  }
  analyzeStatus?: {
    managedId?: string | null
    htmlPath?: string | null
    parsedHtmlPath?: string | null
  }
}

export type AnalyzeStatus = {
  managedId?: string | null
  htmlPath?: string | null
  parsedHtmlPath?: string | null
}
