import PageShell from '../components/ui/PageShell'
import { pageDescriptions, pageTitles } from '../data/siteContent'

function GospelCards() {
  return (
    <PageShell
      title={pageTitles.gospelCards}
      description={pageDescriptions.gospelCards}
    />
  )
}

export default GospelCards
