const extractFolderName = (fileName: string): string => {
  const folderMatch = fileName.match(/(.*)\..*/)
  return folderMatch != null ? folderMatch[1] : fileName
}

export { extractFolderName }
