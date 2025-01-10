import { AlertTriangle, Info } from 'lucide-react'

export default function LocalLaws() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">South African Cannabis Laws and Regulations</h1>
      
      <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-md mb-6">
        <div className="flex items-center mb-2">
          <AlertTriangle className="text-yellow-700 dark:text-yellow-500 mr-2" size={20} />
          <h2 className="text-xl font-semibold">Important Notice</h2>
        </div>
        <p>This guide is intended to help minimize traumatic interactions with the South African Police Services and associated law enforcement. It is based on over a decade of experience and focuses on your Human and Constitutional Rights.</p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Current Legal Status</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>The Cannabis for Private Purposes Act (CfPPA) was signed into law on 28 May 2024.</li>
          <li>Regulations for private use and cultivation are pending.</li>
          <li>Cannabis is no longer part of the Drugs & Drug Trafficking Act of 1992.</li>
          <li>Trade ("dealing") remains completely illegal.</li>
          <li>SAHPRA licenses for medical cannabis production are legitimate.</li>
          <li>No local cannabis medicines are currently registered with SAHPRA in South Africa.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Private Use and Possession</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>There are no maximum quantities for private possession, growth, or consumption.</li>
          <li>Keep cultivation reasonable and private to avoid unwanted attention.</li>
          <li>No specific quantity of cannabis can legally indicate dealing.</li>
          <li>Your car, bag, pockets, and shoes are considered private spaces.</li>
          <li>You can fly domestically with a personal stash (be reasonable with the amount).</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Avoiding Arrest</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Be alert when buying cannabis.</li>
          <li>Always be discreet.</li>
          <li>Hide it carefully.</li>
          <li>Do not smoke in public.</li>
          <li>Obey traffic laws.</li>
          <li>Be polite to the police.</li>
          <li>Trading is very dangerous and illegal.</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">If You're Arrested</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Remain calm and polite.</li>
          <li>You have the right to remain silent except for providing your name and address.</li>
          <li>Do not pay admission of guilt fines, as this will result in a criminal record.</li>
          <li>Request to see the "ANNEXURE TO WRITTEN NOTICE TO APPEAR IN COURT IN TERMS OF SECTION 56 OF ACT 51 OF 1977".</li>
          <li>You have the right to contact an attorney.</li>
        </ol>
      </section>

      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-md mb-6">
        <div className="flex items-center mb-2">
          <Info className="text-blue-700 dark:text-blue-500 mr-2" size={20} />
          <h2 className="text-xl font-semibold">Additional Resources</h2>
        </div>
        <p>For more detailed information and up-to-date resources, visit the <a href="https://www.fieldsofgreenforall.org.za" className="text-blue-600 dark:text-blue-400 hover:underline">Fields of Green for ALL website</a>.</p>
      </div>

      <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md">
        <div className="flex items-center mb-2">
          <AlertTriangle className="text-green-700 dark:text-green-500 mr-2" size={20} />
          <h2 className="text-xl font-semibold">Disclaimer</h2>
        </div>
        <p>This information is provided for educational purposes only and should not be considered legal advice. Always consult with a qualified legal professional for specific legal matters.</p>
      </div>
    </div>
  )
}

