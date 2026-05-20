export const witnessCardsIntro = {
  eyebrow: 'Witness Cards',
  title: 'Simple tools for Gospel conversations',
  description:
    'Short, visual cards designed to help young Christians start clear, faithful conversations about Jesus.',
}

export const witnessCards = Array.from({ length: 8 }, (_, index) => {
  const id = index + 1
  const paddedId = String(id).padStart(3, '0')
  const hasImage = id === 1

  return {
    id,
    title: `Witness Card ${id}`,
    description: hasImage ? 'A simple visual tool for starting a Gospel conversation.' : '',
    imageThumb: hasImage ? `/images/witness-cards/thumbs/witness-card-${paddedId}.webp` : '',
    imageFull: hasImage ? `/images/witness-cards/full/witness-card-${paddedId}.webp` : '',
    isComingSoon: !hasImage,
  }
})
