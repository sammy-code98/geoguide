import About from '../../components/Home/About'
import Advice from '../../components/Home/Advice'
import Discover from '../../components/Home/Discover'
import Experts from '../../components/Home/Experts'
import Hero from '../../components/Home/Hero'

export default function HomePage(): JSX.Element {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50  dark:from-gray-900 dark:to-gray-800"
    >
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-16">
        <Discover />
        <Advice />
        <About />
        <Experts />
      </div>
    </div>
  )
}
