import { InfoPage } from "@/components/content/info-page";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Contact & Report a Problem", "Contact QRWright about a broken tool, scan issue or abusive tracked link. Find the details that help reproduce a problem.", "/contact");
export default function Page() {
  return <InfoPage title="Let’s make it work better." description="Found a problem, have a suggestion, or need to report an abusive tracked link?">
    <h2>Contact channels</h2>
    {site.contactEmail && <p>Email: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p>}
    {site.githubUrl && <p>Project and issue tracker: <a href={site.githubUrl} rel="noopener noreferrer">QRWright on GitHub</a>.</p>}
    {!site.contactEmail && !site.githubUrl && <p>A public contact channel has not been configured for this deployment yet. Contact details will appear here when the operator publishes them.</p>}
    <h2>Reporting a tool problem</h2><p>Include your browser, device, the tool you used, the steps to reproduce the problem and the error you saw. For scan failures, include the print size and surface. Use non-sensitive example content where possible.</p>
    <h2>Reporting an abusive link</h2><p>Provide the QRWright tracked link or its count ID and a brief description. The operator can disable a tracked link by its count ID. Direct codes point directly to their destination; report those to the destination’s host or the organisation displaying the code.</p>
    <h2>Lost codes</h2><p>My codes stays in your browser. If you have a QRWright JSON backup, import it on the My codes page. There is no server copy of your local library to recover.</p>
  </InfoPage>;
}
