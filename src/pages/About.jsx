import PageShell from '../components/ui/PageShell'
import { pageDescriptions, pageTitles } from '../data/siteContent'

function About() {
  return (
    <PageShell title={pageTitles.about} description={pageDescriptions.about} />
  )
}

export default About
