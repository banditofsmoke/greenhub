import ShopOnboardingForm from '../components/ShopOnboardingForm'

export default function ShopOnboarding() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Apply to List Your Shop</h1>
      <p className="mb-6">Please fill out the form below to apply for listing your cannabis shop on our platform. We'll review your application and get back to you soon.</p>
      <ShopOnboardingForm />
    </div>
  )
}

