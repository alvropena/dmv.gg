import { getCookie } from '@/lib/cookies';

export default function PreferencesPage() {
  // Get tracking cookie information
  const cookiesAccepted = getCookie('cookies_accepted') === 'true';
  const analyticsEnabled = getCookie('analytics_enabled') === 'true';
  const marketingEnabled = getCookie('marketing_enabled') === 'true';
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Cookie Settings</h1>
      
      <div className="bg-card rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Your Current Cookie Settings</h2>
        
        <div className="mb-6">
          <p className="text-muted-foreground mb-2">
            These settings determine what information we&apos;re allowed to collect to improve your experience:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Cookies Accepted:</span> {cookiesAccepted ? 'Yes' : 'No'}
            </li>
            <li>
              <span className="font-medium">Analytics Tracking:</span> {analyticsEnabled ? 'Enabled' : 'Disabled'}
            </li>
            <li>
              <span className="font-medium">Marketing Cookies:</span> {marketingEnabled ? 'Enabled' : 'Disabled'}
            </li>
          </ul>
        </div>
        
        <div className="bg-muted p-4 rounded-md">
          <p className="text-sm mb-2">
            To update your cookie preferences, click the &quot;Cookie Settings&quot; button in the footer of our website.
          </p>
          <p className="text-sm text-muted-foreground">
            Learn more about how we use cookies in our <a href="/cookies" className="underline hover:text-primary">Cookie Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
} 