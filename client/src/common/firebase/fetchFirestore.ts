import { db } from './firebaseClient'
import firebase from 'firebase/app'

export const documentListQuery = (
  workspace: string,
  perPage: number
): firebase.firestore.Query => {
  return db
    .collection('workspaces')
    .doc(workspace)
    .collection('documents')
    .orderBy('updatedAt', 'desc')
    .limit(perPage)
}
